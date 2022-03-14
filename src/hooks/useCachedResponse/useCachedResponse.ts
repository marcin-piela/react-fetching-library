import { useContext, useState, useEffect } from 'react';

import { Action } from '../../client/client.types';
import { ClientContext } from '../../context/clientContext/clientContext';
import { convertActionKey } from '../../utils';

export const useCachedResponse = <T = any, R = {}>(action: Action<T, R>) => {
  const clientContext = useContext(ClientContext);

  const [response, setResponse] = useState(clientContext.cache.getResponse(action));

  useEffect(() => {
    const handleCacheUpdated = () => {
      const responseFromCache = clientContext.cache.getResponse(action);

      if (responseFromCache !== response) {
        setResponse(responseFromCache);
      }
    };

    clientContext.cache.on('updated', handleCacheUpdated);

    return () => {
      clientContext.cache.off('updated', handleCacheUpdated);
    };
  }, [convertActionKey(action), response]);

  return response;
};
