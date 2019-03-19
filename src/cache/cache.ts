import { Action } from '../client/client.types';
import { Cache } from './cache.types';

export const convertActionToBase64 = (action: Action<any>) => {
  return Buffer.from(JSON.stringify(action)).toString('base64');
};

export const createCache = <T>(
  isCacheable: (action: Action<T>) => boolean,
  isValid: (response: T & { timestamp: number }) => boolean,
) => {
  const items: { [key: string]: any } = {};

  const add = (action: Action<any>, value: T) => {
    if (isCacheable(action)) {
      items[convertActionToBase64(action)] = { ...value, timestamp: Date.now() };
    }
  };

  const remove = (action: Action<any>) => {
    delete items[convertActionToBase64(action)];
  };

  const get = (action: Action<any>) => {
    const response = items[convertActionToBase64(action)];
    const valid = response && isValid(response);

    if (valid) {
      return response;
    }

    if (response && !valid) {
      remove(action);
    }
  };

  return {
    add,
    get,
    items,
    remove,
  } as Cache<T>;
};
