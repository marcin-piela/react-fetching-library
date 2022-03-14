import { Action, QueryResponse } from '../client/client.types';

export type SuspenseCacheItem = { fetch: any; response?: QueryResponse };

export type SuspenseCache = {
  get: (action: Action) => SuspenseCacheItem;
  add: (action: Action, value: SuspenseCacheItem) => void;
  remove: (action: Action) => void;
};
