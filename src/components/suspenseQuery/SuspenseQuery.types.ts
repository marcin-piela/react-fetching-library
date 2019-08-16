import { QueryResponse } from 'fetching-library';
import { Action } from '../../client/client.types';

export type SuspenseQueryProps<T, R> = {
  action: Action<R>;
  children: (props: QueryResponse<T>) => any;
};
