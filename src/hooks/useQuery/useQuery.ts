import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { Action, QueryResponse } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';
import { RESET, RESET_LOADING, responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { convertActionKey } from '../../utils';

type UseQueryOptionsType = Partial<{
  initFetch: boolean;
  skipCache: boolean;
  pollInterval: number;
}>;

export const useQuery = <T = any, R = any>(
  action: Action<T, R>,
  { initFetch = true, skipCache = false, pollInterval }: UseQueryOptionsType = {},
) => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);
  const controller = useRef<AbortController | null>();

  const cachedResponse = skipCache ? null : clientContext.cache.getResponse(action);

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: cachedResponse ? false : initFetch,
    response: cachedResponse ? cachedResponse : { error: false },
  });

  const actionKey = convertActionKey(action);

  const updateResponseByCache = () => {
    const responseFromCache = clientContext.cache.getResponse(action);

    if (responseFromCache && state.response !== responseFromCache) {
      dispatch({ type: SET_RESPONSE, response: responseFromCache });
    }
  };

  useEffect(() => {
    isMounted.current = true;

    if (initFetch && !cachedResponse) {
      handleQuery(skipCache);
    }

    return () => {
      isMounted.current = false;
      handleAbort();
    };
  }, [actionKey]);

  useEffect(() => {
    let intervalId: number | null = null;

    if (pollInterval) {
      intervalId = window.setInterval(() => {
        handleQuery(true);
      }, pollInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [actionKey, pollInterval]);

  useEffect(updateResponseByCache, [actionKey]);

  useEffect(() => {
    clientContext.cache.on('updated', updateResponseByCache);

    return () => {
      clientContext.cache.off('updated', updateResponseByCache);
    };
  }, [actionKey, state.response]);

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

      const requestInterrupted = queryResponse.errorObject?.name === 'AbortError';
      const responseEqualsCache = clientContext.cache.getResponse(action) === queryResponse;

      if (isMounted.current && !requestInterrupted && !responseEqualsCache) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
      }

      if (isMounted.current && requestInterrupted && controller.current && controller.current === abortController) {
        controller.current = undefined;
        dispatch({ type: RESET_LOADING });
      }

      return queryResponse;
    },
    [actionKey, clientContext.query],
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
