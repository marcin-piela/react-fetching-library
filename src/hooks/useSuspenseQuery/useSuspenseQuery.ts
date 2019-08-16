import { convertActionToBase64, createCache, QueryResponse } from 'fetching-library';
import { useContext, useEffect, useState } from 'react';
import { Action } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext/clientContext';
import { QueryError } from '../../errors/QueryError';

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
      if (
        cacheItem.response.status &&
        action.config &&
        action.config.emitErrorForStatuses &&
        action.config.emitErrorForStatuses.includes(cacheItem.response.status)
      ) {
        throw new QueryError('query-error', cacheItem.response);
      }

      return {
        ...(cacheItem.response as QueryResponse<T>),
        query: forceQuery,
      };
    }

    throw cacheItem.fetch;
  }

  const fetch = clientContext.query(action, flag !== null).then(res => {
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
