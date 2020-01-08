import { Cache } from '../../cache/cache.types';
import { Action, QueryResponse, SuspenseCacheItem } from '../../client/client.types';

export type ClientContextType = {
  query: <T>(actionInit: Action<any>, skipCache?: boolean) => Promise<QueryResponse<T>>;
  cache?: Cache<QueryResponse>;
  suspenseCache: Cache<SuspenseCacheItem>;
};
