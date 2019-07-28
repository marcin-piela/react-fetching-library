import { Client } from 'fetching-library';
import React, { ReactNode } from 'react';

import { ClientContext } from './clientContext';

export const ClientContextProvider = ({ client, children }: { client: Client; children: ReactNode }) => {
  return (
    <ClientContext.Provider value={{ query: client.query, cache: client.cache }}>{children}</ClientContext.Provider>
  );
};
