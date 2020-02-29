import React, { ReactNode, useMemo } from 'react';

import { Client } from '../../client/client.types';
import { ClientContext } from './clientContext';
import { Observable } from './Observable';

export const ClientContextProvider = ({ client, children }: { client: Client; children: ReactNode }) => {
  const observable = useMemo(() => {
    return Observable();
  }, []);

  return (
    <ClientContext.Provider
      value={{ query: client.query, cache: client.cache, suspenseCache: client.suspenseCache, observable }}
    >
      {children}
    </ClientContext.Provider>
  );
};
