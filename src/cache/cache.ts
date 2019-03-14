import { Action } from '../client/action.types';
import { Cache } from './cache.types';

export const convertActionToBase64 = (action: Action<any>) => {
  return Buffer.from(JSON.stringify(action)).toString('base64');
};

export const createCache: <T>() => Cache<T> = <T>() => {
  const items: { [key: string]: any } = {};

  const add = (action: Action<any>, value: T) => {
    items[convertActionToBase64(action)] = value;
  };

  const remove = (action: Action<any>) => {
    delete items[convertActionToBase64(action)];
  };

  const get = (action: Action<any>) => {
    return items[convertActionToBase64(action)];
  };

  return {
    add,
    get,
    items,
    remove,
  };
};
