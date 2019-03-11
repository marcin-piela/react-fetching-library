import React, { ReactNode } from 'react';

import { Client } from '../client/client.types';
import { ClientContext } from './clientContext';

export const ClientContextProvider = ({ client, children }: { client: Client; children: ReactNode }) => {
  return <ClientContext.Provider value={{ fetch: client.query }}>{children}</ClientContext.Provider>;
};
