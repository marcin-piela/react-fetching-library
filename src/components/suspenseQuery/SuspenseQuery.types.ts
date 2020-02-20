import { ReactNode } from 'react';
import { Action, QueryResponse } from '../../client/client.types';

export type SuspenseQueryProps<T, R> = {
  action: Action<T, R>;
  children: (props: QueryResponse<T>) => any;
};
