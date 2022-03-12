import { Buffer } from 'buffer';
import { Action } from '../client/client.types';

export const convertActionToBase64 = (action: Action) => {
  return Buffer.from(JSON.stringify(action)).toString('base64');
};
