import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Action } from '../../client/action.types';
import { useQuery } from '../useQuery/useQuery';

export const usePaginatedQuery = <T, R = any>(
  action: (...props: any) => Action<R>,
  actionProps: any,
  initFetch = true,
) => {
  const [initialized, setInitialized] = useState(false);
  const [queryAction, setQueryAction] = useState(action(...actionProps));
  const [response, setResponse] = useState<T[]>([]);
  const { error, loading, fetch: queryFetch, response: queryResponse } = useQuery<[T], R>(queryAction, initFetch);

  useEffect(() => {
    if (initialized) {
      queryFetch();
    }

    setInitialized(true);
  }, [queryAction]);

  useEffect(() => {
    if (queryResponse) {
      setResponse([...response, ...queryResponse]);
    }
  }, [queryResponse]);

  const fetch = (props: any) => {
    setQueryAction(action(...props));
  };

  return {
    error,
    fetch,
    loading,
    response,
  };
};
