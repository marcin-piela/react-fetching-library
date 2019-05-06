import { Action } from '../client/client.types';
import { Cache } from './cache.types';

export const convertActionToBase64 = (action: Action<any>) => {
  return Buffer.from(
    JSON.stringify({
      body: action.body,
      endpoint: action.endpoint,
      method: action.method,
    }),
  ).toString('base64');
};

export const createCache = <T>(
  isCacheable: (action: Action<T>) => boolean,
  isValid: (response: T & { timestamp: number }) => boolean,
) => {
  let items: { [key: string]: any } = {};

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
