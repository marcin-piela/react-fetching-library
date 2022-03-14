import { Action } from '../client/client.types';
import { convertActionKey } from '../utils';

export class RequestStore {
  value: Record<string, Promise<any> | undefined> = {};

  add = (action: Action, request: Promise<any>, options?: { removeTimeout: number; removeOnError: boolean }) => {
    this.value[convertActionKey(action)] = request;

    if (options?.removeTimeout) {
      request.then(() => {
        setTimeout(() => this.remove(action), options.removeTimeout);
      });
    }

    if (options?.removeOnError) {
      request.catch(() => this.remove(action));
    }
  };

  remove = (action: Action) => {
    const key = convertActionKey(action);

    delete this.value[key];
  };

  get = (action: Action) => {
    return this.value[convertActionKey(action)];
  };

  has = (action: Action) => {
    return Boolean(this.value[convertActionKey(action)]);
  };
}
