import { Action, QueryResponse } from 'fetching-library';
import { ReactNode } from 'react';

export type SuspenseQueryProps<T, R> = {
  action: Action<R>;
  children: (props: QueryResponse<T>) => any;
};
