import {
  Action,
  ClientOptions,
  QueryResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ResponseType,
} from './client.types';
import { QueryError } from './errors/QueryError';

export type HandleRequestInterceptors<R> = (
  action: Action<R>,
  interceptors: Array<RequestInterceptor<R>>,
) => Promise<Action<R>>;

export type HandleResponseInterceptors<R> = (
  action: Action<R>,
  response: QueryResponse<any>,
  interceptors: Array<ResponseInterceptor<R, any>>,
) => Promise<QueryResponse<any>>;

export const createClient = <R = any>(clientOptions: ClientOptions<R>) => {
  const cache = clientOptions.cacheProvider;

  const handleRequestInterceptors: HandleRequestInterceptors<R> = async (action, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor ? await handleRequestInterceptors(await interceptor(client)(action), next) : action;
  };

  const handleResponseInterceptors: HandleResponseInterceptors<R> = async (action, response, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor
      ? await handleResponseInterceptors(action, await interceptor(client)(action, response), next)
      : response;
  };

  const client = {
    cache,
    query: async <T>(actionInit: Action<R>, skipCache = false): Promise<QueryResponse<T>> => {
      try {
        const action = await handleRequestInterceptors(actionInit, clientOptions.requestInterceptors || []);
        const { endpoint, body, responseType, ...options } = action;

        if (cache && !skipCache) {
          const cachedResponse = cache.get(actionInit);

          if (cachedResponse) {
            return cachedResponse;
          }
        }

        const headers = { ...{ 'Content-Type': 'application/json; charset=utf-8' }, ...options.headers };
        const shouldStringify = headers['Content-Type'].indexOf('json') !== -1;
        const fetchFunction = clientOptions.fetch || fetch;

        const response = await fetchFunction(endpoint, {
          body: body ? (shouldStringify ? JSON.stringify(body) : body) : undefined,
          cache: options.cache,
          credentials: options.credentials,
          headers,
          integrity: options.integrity,
          keepalive: options.keepalive,
          method: options.method,
          mode: options.mode,
          redirect: options.redirect,
          referrer: options.referrer,
          referrerPolicy: options.referrerPolicy,
          signal: options.signal,
          window: options.window,
        });

        const queryResponse = await handleResponseInterceptors(
          action,
          {
            error: !response.ok,
            headers: response.headers,
            payload: await resolveResponse(response, responseType),
            status: response.status,
          },
          clientOptions.responseInterceptors || [],
        );

        if (cache && response.ok) {
          cache.add(actionInit, queryResponse);
        }

        if (
          queryResponse.status &&
          action.config &&
          action.config.emitErrorForStatuses &&
          action.config.emitErrorForStatuses.includes(queryResponse.status)
        ) {
          throw new QueryError('request-error', queryResponse);
        }

        return queryResponse;
      } catch (error) {
        return {
          error: true,
          errorObject: error,
        };
      }
    },
  };

  return client;
};

async function resolveResponse(
  response: Response,
  responseType?: ResponseType,
): Promise<any | string | ArrayBuffer | Blob | FormData> {
  if (responseType) {
    return response[responseType]();
  } else {
    const emptyCodes = [204, 205];
    const contentType = response.headers.get('Content-Type');
    const isJSON = emptyCodes.indexOf(response.status) === -1 && contentType && contentType.indexOf('json') !== -1;

    return isJSON ? await response.json() : await response.text();
  }
}
