import { Cache } from '../cache/cache.types';

export type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
export type ResponseType = 'arrayBuffer' | 'blob' | 'json' | 'text' | 'formData';

export interface ActionConfig {
  emitErrorForStatuses?: number[];
}

export interface Action<R = any, Ext = any> {
  endpoint: string;
  method: Method;
  body?: any;
  headers?: { [propName: string]: string };
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
  referrerPolicy?: ReferrerPolicy;
  referrer?: string;
  integrity?: string;
  keepalive?: boolean;
  redirect?: RequestRedirect;
  signal?: AbortSignal | null;
  window?: any;
  config?: ActionConfig & Ext;
  responseType?: ResponseType;
}

export type QueryResponse<T = any> = {
  status?: number;
  error: boolean;
  errorObject?: any;
  payload?: T;
  headers?: Headers;
};

export type UseQueryResponse<T> = {
  loading: boolean;
  abort: () => void;
  reset: () => void;
  query: () => Promise<QueryResponse<T>>;
} & QueryResponse<T>;

export type UseMutationResponse<S, T> = {
  abort: () => void;
  loading: boolean;
  mutate: (action: S) => Promise<QueryResponse<T>>;
  reset: () => void;
} & QueryResponse<T>;

export type UseBulkMutationResponse<S, T> = {
  abort: () => void;
  loading: boolean;
  mutate: (actions: S[]) => Promise<Array<QueryResponse<T> | undefined>>;
  reset: () => void;
  responses: Array<QueryResponse<T> | undefined>;
};

export type UseParameterizedQuery<S, T> = {
  abort: () => void;
  loading: boolean;
  query: (action: S) => Promise<QueryResponse<T>>;
  reset: () => void;
} & QueryResponse<T>;

export type SuspenseCacheItem = {
  fetch: any;
  response?: QueryResponse;
};

export type Client<R = any> = {
  query: <T>(action: Action<T, R>, skipCache?: boolean) => Promise<QueryResponse<T>>;
  cache?: Cache<QueryResponse>;
  suspenseCache: Cache<SuspenseCacheItem>;
};

export type ClientOptions<T> = {
  requestInterceptors?: Array<RequestInterceptor<T>>;
  responseInterceptors?: Array<ResponseInterceptor<T, any>>;
  cacheProvider?: Cache<QueryResponse>;
  fetch?: (input: RequestInfo, init?: Partial<Action> & RequestInit) => Promise<Response>;
};

export type RequestInterceptor<T = any> = (client: Client<T>) => (action: Action<any, T>) => Promise<Action<any, T>>;

export type ResponseInterceptor<T = any, R = any> = (
  client: Client<T>,
) => (action: Action<R, T>, response: QueryResponse<R>) => Promise<QueryResponse<R>>;
