import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Action, QueryResponse } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext';
import { useCachedResponse } from '../useCachedResponse/useCachedResponse';

export const useQuery = <T = any, R = {}>(action: Action<R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const cachedResponse = useCachedResponse(action);
  const isMounted = useRef(true);
  const [isLoading, setLoading] = useState(cachedResponse ? false : initFetch);
  const [response, setResponse] = useState<QueryResponse<T>>(cachedResponse ? cachedResponse : { error: false });

  useEffect(() => {
    isMounted.current = true;

    if (initFetch && !cachedResponse) {
      handleQuery();
    }

    return () => {
      isMounted.current = false;
    };
  }, [action]);

  const handleQuery = useCallback(async () => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);

    const queryResponse = await clientContext.query(action);

    handleResponse(queryResponse);
  }, [action]);

  const handleResponse = (queryResponse: QueryResponse) => {
    if (!isMounted.current) {
      return;
    }

    setLoading(false);
    setResponse(queryResponse);
  };

  return {
    loading: isLoading,
    query: handleQuery,
    ...response,
  };
};
