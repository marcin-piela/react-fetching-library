import { Action, UseParameterizedQuery } from '../../client/client.types';
import { useMutation } from '../useMutation/useMutation';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export const useParameterizedQuery = <T = any, R = {}, S = any>(
  actionCreator: ActionCreator<S, R, T>,
  resourceName?: string,
): UseParameterizedQuery<S, T> => {
  const { mutate, ...rest } = useMutation(actionCreator, resourceName);

  return {
    ...rest,
    query: mutate,
  };
};
