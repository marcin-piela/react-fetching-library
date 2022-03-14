import { useContext, useEffect, useState } from 'react';
import { convertActionKey } from '../../utils';
import { Action, QueryResponse } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';

export const useSuspenseQuery = <T, R = any>(action: Action<T, R>) => {
  const clientContext = useContext(ClientContext);
  const [flag, setFlag] = useState<null | boolean>(null);
  const cacheItem = clientContext.suspenseCache.get(action);

  useEffect(() => {
    if (cacheItem && cacheItem.response && flag !== null) {
      clientContext.suspenseCache.remove(action);
    }

    return () => {
      clientContext.suspenseCache.remove(action);
    };
  }, [convertActionKey(action)]);

  const forceQuery = () => {
    clientContext.suspenseCache.remove(action);
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

  const fetch = clientContext.query(action, flag !== null).then((res) => {
    clientContext.suspenseCache.add(action, {
      fetch,
      response: res,
    });
  });

  clientContext.suspenseCache.add(action, {
    fetch,
  });

  throw fetch;
};
