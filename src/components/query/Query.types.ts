import { Action, QueryResponse } from '../../client/client.types';

export type QueryApi<T> = {
  loading: boolean;
  query: () => Promise<QueryResponse<T>>;
  reset: () => void;
  abort: () => void;
} & QueryResponse<T>;

export type QueryProps<T, R> = {
  initFetch?: boolean;
  action: Action<T, R>;
  children: (props: QueryApi<T>) => any;
};
