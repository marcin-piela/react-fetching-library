import { ReactNode } from 'react';
import { Action, QueryResponse } from '../../client/client.types';

type ActionCreator<S, R> = (action: S) => Action<R>;

export type MutationApi<T, S> = {
  loading: boolean;
  mutate: (action: S) => Promise<void>;
} & QueryResponse<T>;

export type MutationProps<T, R, S> = {
  actionCreator: ActionCreator<S, R>;
  children: (props: MutationApi<T, S>) => any;
};
