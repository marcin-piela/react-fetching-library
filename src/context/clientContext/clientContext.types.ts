import { Action, Cache, QueryResponse } from 'fetching-library';

export type ClientContextType = {
  query: <T>(actionInit: Action<any>) => Promise<QueryResponse<T>>;
  cache?: Cache<QueryResponse>;
};
