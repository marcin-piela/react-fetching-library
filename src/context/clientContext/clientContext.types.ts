import { Cache } from '../../store/CacheStore.types';
import { SuspenseCache } from '../../store/SuspenseCacheStore.types';
import { Action, QueryResponse } from '../../client/client.types';

export type ClientContextType = {
  query: <T = any, R = any>(actionInit: Action<T, R>, skipCache?: boolean) => Promise<QueryResponse<T>>;
  cache: Cache;
  suspenseCache: SuspenseCache;
};
