import { Action, UseParameterizedQuery } from '../../client/client.types';
import { useMutation } from '../useMutation/useMutation';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export const useParameterizedQuery = <T = any, R = {}, S = any>(
  actionCreator: ActionCreator<S, R, T>,
): UseParameterizedQuery<S, T> => {
  const { mutate, ...rest } = useMutation(actionCreator);

  return {
    ...rest,
    query: mutate,
  };
};
