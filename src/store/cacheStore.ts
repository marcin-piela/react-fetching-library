import { Action, QueryResponse } from '../client/client.types';
import { convertActionKey } from '../utils';
import { CacheStoreEvent } from './CacheStore.types';

export class CacheStore {
  value: Record<string, QueryResponse> = {};

  callbacks: Record<CacheStoreEvent, (() => void)[]> = { updated: [] };

  // ** For SSR ** //

  getValue = () => {
    return this.value;
  };

  setValue = (value: Record<string, QueryResponse>) => {
    this.value = value;

    this.callbacks.updated.forEach((cb) => cb());
  };

  // ** ** //

  getResponse = (action: Action) => {
    return this.value[convertActionKey(action)];
  };

  setResponse = (action: Action, value: QueryResponse) => {
    this.value[convertActionKey(action)] = value;

    this.callbacks.updated.forEach((cb) => cb());
  };

  removeResponse = (action: Action) => {
    delete this.value[convertActionKey(action)];

    this.callbacks.updated.forEach((cb) => cb());
  };

  getPayload = (action: Action) => {
    return this.getResponse(action)?.payload;
  };

  updatePayload = (action: Action, payload: any) => {
    this.setResponse(action, { ...this.getResponse(action), payload });
  };

  on = (eventType: CacheStoreEvent, cb: () => void) => {
    this.callbacks[eventType].push(cb);
  };

  off = (eventType: CacheStoreEvent, cb: () => void) => {
    this.callbacks[eventType] = this.callbacks[eventType].filter((fn) => fn !== cb);
  };
}
