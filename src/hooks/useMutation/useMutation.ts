import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { Action, QueryResponse, UseMutationResponse } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';
import { RESET, RESET_LOADING, responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export const useMutation = <T = any, R = {}, S = any>(
  actionCreator: ActionCreator<S, R, T>,
): UseMutationResponse<S, T> => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);
  const controller = useRef<AbortController | null>();

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: false,
    response: { error: false },
  });

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      handleAbort();
    };
  }, []);

  const handleQuery = useCallback(
    async (...params: Parameters<typeof actionCreator>) => {
      if (!isMounted.current) {
        return { error: false } as QueryResponse<T>;
      }

      const action = actionCreator(...params);
      const abortController = 'AbortController' in window ? new AbortController() : undefined;
      const signal = action.signal || (abortController ? abortController.signal : undefined);

      if (controller.current) {
        controller.current.abort();
      }

      controller.current = abortController;

      dispatch({ type: SET_LOADING });

      const queryResponse = await clientContext.query<T>({ ...action, signal: action.signal || signal });

      if (isMounted.current && !(queryResponse.errorObject && queryResponse.errorObject.name === 'AbortError')) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
      }

      if (
        isMounted.current &&
        queryResponse.errorObject?.name === 'AbortError' &&
        controller.current &&
        controller.current === abortController
      ) {
        controller.current = undefined;
        dispatch({ type: RESET_LOADING });
      }

      return queryResponse;
    },
    [actionCreator, clientContext.query],
  );

  const handleAbort = useCallback(() => {
    if (controller.current) {
      controller.current.abort();
    }
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: RESET });
  }, []);

  if (state.response && state.response.errorObject && state.response.errorObject instanceof QueryError) {
    throw state.response.errorObject;
  }

  return {
    abort: handleAbort,
    loading: state.loading,
    mutate: handleQuery,
    reset: handleReset,
    ...state.response,
  };
};
