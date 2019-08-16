import { Cache, QueryResponse } from 'fetching-library';
import { Action } from '../../client/client.types';

export type ClientContextType = {
  query: <T>(actionInit: Action, skipCache?: boolean) => Promise<QueryResponse<T>>;
  cache?: Cache<QueryResponse>;
};
