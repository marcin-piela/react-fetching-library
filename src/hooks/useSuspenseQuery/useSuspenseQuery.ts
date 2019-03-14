import { useContext, useEffect, useRef } from 'react';
import { createCache } from '../../cache/cache';
import { Action } from '../../client/action.types';
import { QueryResponse } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext';

type CacheItem = {
  fetch: any;
  response?: QueryResponse;
};

const cache = createCache<CacheItem>();

export const useSuspenseQuery = <T, R = any>(action: Action<R>) => {
  const clientContext = useContext(ClientContext);
  const cacheItem = cache.get(action);

  useEffect(() => {
    return () => {
      cache.remove(action);
    };
  }, []);

  if (cacheItem) {
    if (cacheItem.response) {
      return cacheItem.response as QueryResponse<T>;
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
