import { Action } from './action.types';
import { ClientOptions, QueryResponse, RequestInterceptor, ResponseInterceptor } from './client.types';

export type HandleRequestInterceptors<R> = (
  action: Action<R>,
  interceptors: Array<RequestInterceptor<R>>,
) => Promise<Action<R>>;

export type HandleResponseInterceptors<R> = (
  action: Action<R>,
  response: QueryResponse<any>,
  interceptors: Array<ResponseInterceptor<R, any>>,
) => Promise<QueryResponse<any>>;

export const Client = <R = any>(clientOptions: ClientOptions<R>) => {
  const handleRequestInterceptors: HandleRequestInterceptors<R> = async (action, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor ? await handleRequestInterceptors(await interceptor()(action), next) : action;
  };

  const handleResponseInterceptors: HandleResponseInterceptors<R> = async (action, response, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor
      ? await handleResponseInterceptors(action, await interceptor()(action, response), next)
      : response;
  };

  return {
    query: async <T>(actionInit: Action<R>): Promise<QueryResponse<T>> => {
      try {
        const action = await handleRequestInterceptors(actionInit, clientOptions.requestInterceptors || []);
        const { endpoint, body, headers, ...options } = action;

        const response = await fetch(endpoint, {
          body: body ? JSON.stringify(body) : undefined,
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

        return await handleResponseInterceptors(
          action,
          {
            error: !response.ok,
            headers: response.headers,
            payload: await response.json(),
            status: response.status,
          },
          clientOptions.responseInterceptors || [],
        );
      } catch (error) {
        return {
          error: true,
          errorObject: error,
        };
      }
    },
  };
};
