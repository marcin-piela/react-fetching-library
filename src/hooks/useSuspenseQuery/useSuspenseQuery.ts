import { Action, convertActionToBase64, createCache, QueryError, QueryResponse } from 'fetching-library';
import { useContext, useEffect, useState } from 'react';
import { ClientContext } from '../../context/clientContext/clientContext';

type CacheItem = {
  fetch: any;
  response?: QueryResponse;
};

const cache = createCache<CacheItem>(() => true, () => true);

export const useSuspenseQuery = <T, R = any>(action: Action<R>) => {
  const clientContext = useContext(ClientContext);
  const [flag, setFlag] = useState<null | boolean>(null);
  const cacheItem = cache.get(action);

  useEffect(() => {
    if (cacheItem && cacheItem.response && flag !== null) {
      cache.remove(action);
    }

    return () => {
      cache.remove(action);
    };
  }, [convertActionToBase64(action)]);

  const forceQuery = () => {
    cache.remove(action);
    setFlag(!flag);
  };

  if (cacheItem) {
    if (cacheItem.response) {
      if (cacheItem.response.errorObject && cacheItem.response.errorObject instanceof QueryError) {
        throw cacheItem.response.errorObject;
      }

      return {
        ...(cacheItem.response as QueryResponse<T>),
        query: forceQuery,
      };
    }

    throw cacheItem.fetch;
  }

  const fetch = clientContext.query(action).then(res => {
    cache.add(action, {
      fetch,
      response: res,
    });
  });

  cache.add(action, {
    fetch,
  });

  throw fetch;
};
