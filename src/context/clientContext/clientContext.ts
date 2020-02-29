import { createContext } from 'react';

import { createCache } from '../../cache/cache';
import { ClientContextType } from './clientContext.types';
import { Observable } from './Observable';

const initialContext: ClientContextType = {
  query: () => {
    console.warn('Add ClientProvider to use client context');

    return Promise.resolve({ error: true, status: 0 });
  },
  suspenseCache: createCache(() => true, () => true),
  observable: Observable(),
};

export const ClientContext = createContext(initialContext);
