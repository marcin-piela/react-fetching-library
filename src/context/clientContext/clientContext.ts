import { createContext } from 'react';

import { createCache } from '../../cache/cache';
import { ClientContextType } from './clientContext.types';

const initialContext: ClientContextType = {
  query: () => {
    console.warn('Add ClientProvider to use client context');

    return Promise.resolve({ error: true, status: 0 });
  },
  suspenseCache: createCache(() => true, () => true),
};

export const ClientContext = createContext(initialContext);
