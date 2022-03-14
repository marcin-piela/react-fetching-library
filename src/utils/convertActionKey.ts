import { Action } from '../client/client.types';

export const convertActionKey = (action: Action) => {
  return action.endpoint + action.method;
};
