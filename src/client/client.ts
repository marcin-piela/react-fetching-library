import { Action, ClientOptions, QueryResponse, RequestInterceptor, ResponseInterceptor } from './client.types';
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

const emptyCodes = [204, 205];

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
    query: async <T>(actionInit: Action<R>): Promise<QueryResponse<T>> => {
      try {
        const action = await handleRequestInterceptors(actionInit, clientOptions.requestInterceptors || []);
        const { endpoint, body, headers, ...options } = action;

        if (cache) {
          const cachedResponse = cache.get(action);

          if (cachedResponse) {
            return cachedResponse;
          }
        }

        const response = await fetch(endpoint, {
          body: body ? (body instanceof URLSearchParams ? body : JSON.stringify(body)) : undefined,
          cache: options.cache,
          credentials: options.credentials,
          headers: { ...{ 'Content-Type': 'application/json; charset=utf-8' }, ...headers },
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

        const contentType = response.headers.get('Content-Type');
        const isJSON = emptyCodes.indexOf(response.status) === -1 && contentType && contentType.indexOf('json') !== -1;

        const queryResponse = await handleResponseInterceptors(
          action,
          {
            error: !response.ok,
            headers: response.headers,
            payload: isJSON ? await response.json() : await response.text(),
            status: response.status,
          },
          clientOptions.responseInterceptors || [],
        );

        if (cache && response.ok) {
          cache.add(action, queryResponse);
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
