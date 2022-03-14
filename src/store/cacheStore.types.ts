import { Action, QueryResponse } from '../client/client.types';

export type Cache = {
  getValue: () => Record<string, QueryResponse>;
  setValue: (value: Record<string, QueryResponse>) => void;
  setResponse: (action: Action, value: QueryResponse) => void;
  getResponse: (action: Action) => QueryResponse | undefined;
  removeResponse: (action: Action) => void;
  getPayload: (action: Action) => any;
  updatePayload: (action: Action, payload: any) => void;
  on: (event: CacheStoreEvent, cb: () => void) => void;
  off: (event: CacheStoreEvent, cb: () => void) => void;
};

export type CacheStoreEvent = 'updated';
