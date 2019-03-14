import { Action } from './action.types';

export type Client<R = any> = {
  query: <T>(action: Action<R>) => Promise<QueryResponse<T>>;
};

export type ClientOptions<T> = {
  requestInterceptors?: Array<RequestInterceptor<T>>;
  responseInterceptors?: Array<ResponseInterceptor<T, any>>;
};

export type QueryResponse<T = any> = {
  status?: number;
  error: boolean;
  errorObject?: any;
  payload?: T;
  headers?: Headers;
};

export type RequestInterceptor<T = any> = () => (action: Action<T>) => Promise<Action<T>>;

export type ResponseInterceptor<T = any, R = any> = () => (
  action: Action<T>,
  response: QueryResponse<R>,
) => Promise<QueryResponse<R>>;
