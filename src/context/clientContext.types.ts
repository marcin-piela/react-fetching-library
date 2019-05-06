import { Cache } from '../cache/cache.types';
import { Action, QueryResponse } from '../client/client.types';

export type ClientContextType = {
  query: <T>(actionInit: Action<any>) => Promise<QueryResponse<T>>;
  cache?: Cache<QueryResponse>;
};
