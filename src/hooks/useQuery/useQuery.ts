import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Action, QueryResponse } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext';

export const useQuery = <T = any, R = {}>(action: Action<R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);
  const [isLoading, setLoading] = useState(initFetch);
  const [response, setResponse] = useState<QueryResponse<T>>({ error: false });

  useEffect(() => {
    isMounted.current = true;

    if (initFetch) {
      handleQuery();
    }

    return () => {
      isMounted.current = false;
    };
  }, [action]);

  const handleQuery = useCallback(() => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);

    clientContext.query(action).then(queryResponse => {
      handleResponse(queryResponse);
    });
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
