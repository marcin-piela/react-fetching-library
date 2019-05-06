import { Action } from '../client/client.types';

export type Cache<T> = {
  add: (action: Action<any>, value: T) => void;
  remove: (action: Action<any>) => void;
  get: (action: Action<any>) => T & { timestamp: number } | undefined;
  getItems: () => { [key: string]: T };
  setItems: (items: { [key: string]: T }) => void;
};
