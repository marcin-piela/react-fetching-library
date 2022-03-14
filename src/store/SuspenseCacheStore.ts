import { Action, QueryResponse } from '../client/client.types';
import { convertActionKey } from '../utils';
import { SuspenseCacheItem } from './SuspenseCacheStore.types';

export class SuspenseCacheStore {
  value: Record<string, SuspenseCacheItem> = {};

  get = (action: Action) => {
    return this.value[convertActionKey(action)];
  };

  add = (action: Action, value: SuspenseCacheItem) => {
    this.value[convertActionKey(action)] = value;
  };

  remove = (action: Action) => {
    delete this.value[convertActionKey(action)];
  };
}
