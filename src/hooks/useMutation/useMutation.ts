import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { Action, QueryResponse } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';
import { responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';

type ActionCreator<S, R> = (action: S) => Action<R>;

export const useMutation = <T = any, R = {}, S = any>(actionCreator: ActionCreator<S, R>) => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: false,
    response: { error: false },
  });

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

      const queryResponse = await clientContext.query<T>(actionCreator(...params));

      if (isMounted.current) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
      }

      return queryResponse;
    },
    [actionCreator],
  );

  if (state.response && state.response.errorObject && state.response.errorObject instanceof QueryError) {
    throw state.response.errorObject;
  }

  return {
    loading: state.loading,
    mutate: handleQuery,
    ...state.response,
  };
};
