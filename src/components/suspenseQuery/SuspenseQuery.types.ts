import { ReactNode } from 'react';
import { Action } from '../../client/action.types';
import { QueryResponse } from '../../client/client.types';

export type SuspenseQueryProps<T, R> = {
  action: Action<R>;
  children: (props: QueryResponse<T>) => any;
};
