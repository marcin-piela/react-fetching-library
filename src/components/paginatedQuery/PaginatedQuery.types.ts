import { Action } from '../../client/action.types';

export type PaginatedQueryApi<T> = {
  response: T[];
  loading: boolean;
  error: boolean;
  fetch: (...props: any) => void;
};

export type PaginatedQueryProps<T, R> = {
  initFetch?: boolean;
  action: (...props: any) => Action<R>;
  children: (props: PaginatedQueryApi<T>) => any;
};
