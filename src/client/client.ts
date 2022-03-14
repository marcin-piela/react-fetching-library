import { CacheStore, SuspenseCacheStore, RequestStore } from '../store';
import {
  Action,
  Client,
  ClientOptions,
  QueryResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ResponseType,
} from './client.types';
import { QueryError } from './errors/QueryError';

export type HandleRequestInterceptors<R> = (
  action: Action<any, R>,
  interceptors: RequestInterceptor<R>[],
) => Promise<Action<any, R>>;

export type HandleResponseInterceptors<R> = (
  action: Action<any, R>,
  response: QueryResponse<any>,
  interceptors: ResponseInterceptor<R, any>[],
) => Promise<QueryResponse<any>>;

export const createClient = <R = any>(clientOptions: ClientOptions<R> = {}): Client => {
  const cacheStore = new CacheStore();
  const suspenseCacheStore = new SuspenseCacheStore();
  const requestStore = new RequestStore();

  const handleRequestInterceptors: HandleRequestInterceptors<R> = async (action, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor ? await handleRequestInterceptors(await interceptor(client as Client)(action), next) : action;
  };

  const handleResponseInterceptors: HandleResponseInterceptors<R> = async (action, response, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor
      ? await handleResponseInterceptors(action, await interceptor(client as Client)(action, response), next)
      : response;
  };

  const client = {
    cache: cacheStore,
    suspenseCache: suspenseCacheStore,
    query: async <T>(actionInit: Action<T, R>, skipCache = false): Promise<QueryResponse<T>> => {
      try {
        if (!skipCache) {
          const cachedResponse = cacheStore.getResponse(actionInit);

          if (cachedResponse) {
            return cachedResponse;
          }
        }

        const action = await handleRequestInterceptors(actionInit, clientOptions.requestInterceptors || []);
        const { endpoint, body, responseType, ...options } = action;

        let headers = options.headers;

        if (!(body && (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer))) {
          headers = { ...{ 'Content-Type': 'application/json; charset=utf-8' }, ...options.headers };
        }

        const shouldStringify = headers && headers['Content-Type'] && headers['Content-Type'].indexOf('json') !== -1;
        const shouldStartNewRequest = !requestStore.has(actionInit);
        const fetchFunction = clientOptions.fetch || fetch;

        if (shouldStartNewRequest) {
          requestStore.add(
            actionInit,
            fetchFunction(endpoint, {
              ...options,
              body: body ? (shouldStringify ? JSON.stringify(body) : body) : undefined,
              headers,
              responseType,
            }).then(async (response) => {
              const payload = await resolveResponse(response, responseType);

              return { response, payload };
            }),
            { removeTimeout: clientOptions?.dedupingInterval ?? 2000, removeOnError: true },
          );
        }

        const { response, payload } = await requestStore.get(actionInit);

        const queryResponse = await handleResponseInterceptors(
          action,
          {
            error: !response.ok,
            headers: response.headers,
            payload,
            status: response.status,
          },
          clientOptions.responseInterceptors || [],
        );

        if (
          queryResponse.status &&
          action.config &&
          action.config.emitErrorForStatuses &&
          action.config.emitErrorForStatuses.includes(queryResponse.status)
        ) {
          throw new QueryError('request-error', queryResponse);
        }

        if (response.ok && actionInit.method === 'GET') {
          cacheStore.setResponse(actionInit, queryResponse);
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
