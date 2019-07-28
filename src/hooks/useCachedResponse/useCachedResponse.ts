import { useContext } from 'react';

import { Action } from 'fetching-library';
import { ClientContext } from '../../context/clientContext/clientContext';

export const useCachedResponse = <T = any, R = {}>(action: Action<R>) => {
  const clientContext = useContext(ClientContext);

  if (clientContext.cache) {
    return clientContext.cache.get(action);
  }

  return undefined;
};
