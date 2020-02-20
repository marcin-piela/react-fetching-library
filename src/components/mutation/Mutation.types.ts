import { Action, QueryResponse } from '../../client/client.types';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export type MutationApi<T, S> = {
  loading: boolean;
  mutate: (action: S) => Promise<QueryResponse<T>>;
  reset: () => void;
  abort: () => void;
} & QueryResponse<T>;

export type MutationProps<T, R, S> = {
  actionCreator: ActionCreator<S, R, T>;
  children: (props: MutationApi<T, S>) => any;
};
