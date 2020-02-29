import { useCallback, useReducer } from 'react';

import { Action, UseMutationResponse } from '../../client/client.types';
import { responseReducer } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { useBaseQuery } from '../useBaseQuery/useBaseQuery';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export const useMutation = <T = any, R = {}, S = any>(
  actionCreator: ActionCreator<S, R, T>,
  resourceName?: string,
): UseMutationResponse<S, T> => {
  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: false,
    response: { error: false },
  });

  const { query, ...rest } = useBaseQuery(actionCreator, state, dispatch, resourceName);

  const mutate = useCallback(
    async (...params: Parameters<typeof actionCreator>) => {
      return query(...params);
    },
    [actionCreator],
  );

  return {
    ...rest,
    mutate,
  };
};
