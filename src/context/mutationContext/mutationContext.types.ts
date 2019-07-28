import { Action, QueryResponse } from 'fetching-library';

export type MutationContextType<T, S> = {
  loading: boolean;
  mutate: (action: S) => Promise<QueryResponse<T>>;
} & QueryResponse<T>;

type ActionCreator<S, R> = (action: S) => Action<R>;

export type MutationApi<T, S> = {
  loading: boolean;
  mutate: (action: S) => Promise<QueryResponse<T>>;
} & QueryResponse<T>;

export type MutationProps<T, R, S> = {
  actionCreator: ActionCreator<S, R>;
  children: (props: MutationApi<T, S>) => any;
};
