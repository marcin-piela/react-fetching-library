import { ReactNode } from 'react';
import { Action } from '../../client/action.types';

export type QueryApi<T> = {
  response: null | T;
  loading: boolean;
  error: boolean;
  fetch: () => void;
};

export type QueryProps<T, R> = {
  initFetch?: boolean;
  action: Action<R>;
  children: (props: QueryApi<T>) => any;
};
