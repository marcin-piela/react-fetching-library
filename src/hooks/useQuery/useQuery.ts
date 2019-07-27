import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { convertActionToBase64 } from '../../cache/cache';
import { Action, QueryResponse } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';
import { responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { useCachedResponse } from '../useCachedResponse/useCachedResponse';

export const useQuery = <T = any, R = {}>(action: Action<R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const cachedResponse = useCachedResponse<T>(action);
  const isMounted = useRef(true);

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: cachedResponse ? false : initFetch,
    response: cachedResponse ? cachedResponse : { error: false },
  });

  useEffect(() => {
    isMounted.current = true;

    if (initFetch && !cachedResponse) {
      handleQuery();
    }

    return () => {
      isMounted.current = false;
    };
  }, [convertActionToBase64(action)]);

  const handleQuery = useCallback(async () => {
    if (!isMounted.current) {
      return { error: false } as QueryResponse<T>;
    }

    dispatch({ type: SET_LOADING });

    const queryResponse = await clientContext.query<T>(action);

    if (isMounted.current) {
      dispatch({ type: SET_RESPONSE, response: queryResponse });
    }

    return queryResponse;
  }, [convertActionToBase64(action)]);

  if (state.response && state.response.errorObject && state.response.errorObject instanceof QueryError) {
    throw state.response.errorObject;
  }

  return {
    loading: state.loading,
    query: handleQuery,
    ...state.response,
  };
};
