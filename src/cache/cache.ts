import { Action } from '../client/client.types';
import { convertActionToBase64 } from '../utils';
import { Cache } from './cache.types';

export const createCache = <T>(
  isCacheable: (action: Action) => boolean,
  isValid: (response: T & { timestamp: number }) => boolean,
) => {
  let items: { [key: string]: any } = {};

  const add = (action: Action, value: T) => {
    if (isCacheable(action)) {
      items[convertActionToBase64(action)] = { ...value, timestamp: Date.now() };
    }
  };

  const remove = (action: Action) => {
    delete items[convertActionToBase64(action)];
  };

  const get = (action: Action) => {
    const response = items[convertActionToBase64(action)];
    const valid = response && isValid(response);

    if (valid) {
      return response;
    }

    if (response && !valid) {
      remove(action);
    }
  };

  const setItems = (value: { [key: string]: any }) => {
    items = value;
  };

  const getItems = () => {
    return items;
  };

  return {
    add,
    get,
    getItems,
    remove,
    setItems,
  } as Cache<T>;
};
