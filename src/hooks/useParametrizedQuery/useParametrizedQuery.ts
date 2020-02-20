import { Action, UseParametrizedQuery } from '../../client/client.types';
import { useMutation } from '../useMutation/useMutation';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export const useParametrizedQuery = <T = any, R = {}, S = any>(
  actionCreator: ActionCreator<S, R, T>,
): UseParametrizedQuery<S, T> => {
  const { mutate, ...rest } = useMutation(actionCreator);

  return {
    ...rest,
    query: mutate,
  };
};
