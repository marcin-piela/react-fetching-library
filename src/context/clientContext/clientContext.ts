import { createContext } from 'react';

import { ClientContextType } from './clientContext.types';

const initialContext: ClientContextType = {
  query: () => {
    console.warn('Add ClientProvider to use client context');

    return Promise.resolve({ error: true, status: 0 });
  },
};

export const ClientContext = createContext(initialContext);
