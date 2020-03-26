import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { convertActionToBase64 } from '../../cache/cache';
import { Action, QueryResponse } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';
import { RESET, RESET_LOADING, responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { useCachedResponse } from '../useCachedResponse/useCachedResponse';

export const useQuery = <T = any, R = any>(action: Action<T, R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const cachedResponse = useCachedResponse<T>(action);
  const isMounted = useRef(true);
  const controller = useRef<AbortController | null>();

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
      handleAbort();
    };
  }, [convertActionToBase64(action)]);

  const handleQuery = useCallback(
    async (skipCache = false) => {
      const abortController = 'AbortController' in window ? new AbortController() : undefined;
      const signal = action.signal || (abortController ? abortController.signal : undefined);

      if (controller.current) {
        controller.current.abort();
      }

      controller.current = abortController;

      if (!isMounted.current) {
        return { error: false } as QueryResponse<T>;
      }

      dispatch({ type: SET_LOADING });

      const queryResponse = await clientContext.query<T>({ ...action, signal: action.signal || signal }, skipCache);

      if (isMounted.current && !(queryResponse.errorObject && queryResponse.errorObject.name === 'AbortError')) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
      }

      if (
        isMounted.current &&
        (queryResponse.errorObject && queryResponse.errorObject.name === 'AbortError') &&
        controller.current &&
        controller.current === abortController
      ) {
        controller.current = undefined;
        dispatch({ type: RESET_LOADING });
      }

      return queryResponse;
    },
    [convertActionToBase64(action), clientContext.query],
  );

  const handleReload = useCallback(() => {
    return handleQuery(true);
  }, [handleQuery]);

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
    query: handleReload,
    reset: handleReset,
    ...state.response,
  };
};
