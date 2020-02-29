import { useCallback, useEffect, useReducer } from 'react';

import { convertActionToBase64 } from '../../cache/cache';
import { Action } from '../../client/client.types';
import { responseReducer } from '../../reducers/responseReducer';
import { ResponseReducer } from '../../reducers/responseReducer.types';
import { useBaseQuery } from '../useBaseQuery/useBaseQuery';
import { useCachedResponse } from '../useCachedResponse/useCachedResponse';

export const useQuery = <T = any, R = any>(action: Action<T, R>, initFetch = true) => {
  const cachedResponse = useCachedResponse<T>(action);

  const [state, dispatch] = useReducer(responseReducer as ResponseReducer<T>, {
    loading: cachedResponse ? false : initFetch,
    response: cachedResponse ? cachedResponse : { error: false },
  });

  const { query, ...rest } = useBaseQuery(() => action, state, dispatch, action.resourceName);

  useEffect(() => {
    if (initFetch && !cachedResponse) {
      query({});
    }
  }, [convertActionToBase64(action)]);

  const handleReload = useCallback(() => {
    return query({});
  }, [convertActionToBase64(action)]);

  return {
    query: handleReload,
    ...rest,
  };
};
