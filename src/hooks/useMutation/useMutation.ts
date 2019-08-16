import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { QueryResponse } from 'fetching-library';
import { Action } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext/clientContext';
import { responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { useDetectResponseError } from '../useDetectResponseError/useDetectResponseError';

type ActionCreator<S, R> = (action: S) => Action<R>;

export const useMutation = <T = any, R = {}, S = any>(actionCreator: ActionCreator<S, R>) => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: false,
    response: { error: false },
  });

  const setMeta = useDetectResponseError();

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleQuery = useCallback(
    async (...params: Parameters<typeof actionCreator>) => {
      if (!isMounted.current) {
        return { error: false } as QueryResponse<T>;
      }

      dispatch({ type: SET_LOADING });
      const action = actionCreator(...params);

      const queryResponse = await clientContext.query<T>(action);

      if (isMounted.current) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
        setMeta(queryResponse, action);
      }

      return queryResponse;
    },
    [actionCreator],
  );

  return {
    loading: state.loading,
    mutate: handleQuery,
    ...state.response,
  };
};
