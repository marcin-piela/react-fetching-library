import { Action } from '../client/client.types';

export type Cache<T> = {
  add: (action: Action, value: T) => void;
  remove: (action: Action) => void;
  get: (action: Action) => T & { timestamp: number } | undefined;
  getItems: () => { [key: string]: T };
  setItems: (items: { [key: string]: T }) => void;
};
