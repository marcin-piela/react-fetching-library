import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useInitializeEffect } from '..';
import { Action } from '../../client/action.types';
import { QueryResponse } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext';

export const useQuery = <T, R = any>(action: Action<R>, initFetch = true) => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [response, setResponse] = useState<T | null>(null);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  const handleFetch = useCallback(
    (keepLastResponse?: boolean) => {
      if (!isMounted.current) {
        return;
      }

      setLoading(true);
      setError(false);

      if (!keepLastResponse) {
        setResponse(null);
      }

      clientContext
        .fetch(action)
        .then(fetchResponse => {
          if (fetchResponse.error) {
            handleError();
          } else {
            handleSuccess(fetchResponse);
          }
        })
        .catch((error: Error) => {
          handleError();
        });
    },
    [action],
  );

  useInitializeEffect(() => {
    if (initFetch) {
      handleFetch();
    }
  });

  const handleSuccess = (fetchResponse: QueryResponse) => {
    if (!isMounted.current) {
      return;
    }

    setLoading(false);
    setResponse(fetchResponse.payload);
  };

  const handleError = () => {
    if (!isMounted.current) {
      return;
    }

    setError(true);
    setLoading(false);
  };

  return {
    error: isError,
    fetch: handleFetch,
    loading: isLoading,
    response,
  };
};
