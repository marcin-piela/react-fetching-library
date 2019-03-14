import { ReactNode } from 'react';
import { Action } from '../../client/action.types';
import { QueryResponse } from '../../client/client.types';

export type QueryApi<T> = {
  loading: boolean;
  query: () => void;
} & QueryResponse<T>;

export type QueryProps<T, R> = {
  initFetch?: boolean;
  action: Action<R>;
  children: (props: QueryApi<T>) => any;
};
