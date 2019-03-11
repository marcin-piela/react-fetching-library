type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type Action<T = any> = {
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
} & T;
