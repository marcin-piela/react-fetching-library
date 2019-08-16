import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { convertActionToBase64, QueryResponse } from 'fetching-library';
import { Action } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext/clientContext';
import { responseReducer, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { useCachedResponse } from '../useCachedResponse/useCachedResponse';
import { useDetectResponseError } from '../useDetectResponseError/useDetectResponseError';

export const useQuery = <T = any, R = {}>(action: Action<R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const cachedResponse = useCachedResponse<T>(action);
  const isMounted = useRef(true);

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: cachedResponse ? false : initFetch,
    response: cachedResponse ? cachedResponse : { error: false },
  });

  useDetectResponseError(state.response, action);

  useEffect(() => {
    isMounted.current = true;

    if (initFetch && !cachedResponse) {
      handleQuery();
    }

    return () => {
      isMounted.current = false;
    };
  }, [convertActionToBase64(action)]);

  const handleQuery = useCallback(
    async (skipCache = false) => {
      if (!isMounted.current) {
        return { error: false } as QueryResponse<T>;
      }

      dispatch({ type: SET_LOADING });

      const queryResponse = await clientContext.query<T>(action, skipCache);

      if (isMounted.current) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
      }

      return queryResponse;
    },
    [convertActionToBase64(action)],
  );

  return {
    loading: state.loading,
    query: () => handleQuery(true),
    ...state.response,
  };
};
