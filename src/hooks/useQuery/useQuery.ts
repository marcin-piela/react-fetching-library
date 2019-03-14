import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Action } from '../../client/action.types';
import { QueryResponse } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext';

export const useQuery = <T, R = any>(action: Action<R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);
  const [isLoading, setLoading] = useState(true);
  const [response, setResponse] = useState<QueryResponse<T>>({ error: false });

  useEffect(() => {
    isMounted.current = true;

    if (initFetch) {
      handleQuery();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleQuery = useCallback(
    (keepLastResponse?: boolean) => {
      if (!isMounted.current) {
        return;
      }

      setLoading(true);

      if (!keepLastResponse) {
        setResponse({ error: false });
      }

      clientContext.query(action).then(queryResponse => {
        handleResponse(queryResponse);
      });
    },
    [action],
  );

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
