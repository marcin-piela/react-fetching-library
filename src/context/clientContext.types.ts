import { Action } from '../client/action.types';
import { QueryResponse } from '../client/client.types';

export type ClientContextType = {
  fetch: <T>(actionInit: Action<any>) => Promise<QueryResponse<T>>;
};
