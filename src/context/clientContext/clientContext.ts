import { createContext } from 'react';
import { CacheStore, SuspenseCacheStore } from '../../store';
import { ClientContextType } from './clientContext.types';

const initialContext: ClientContextType = {
  query: () => {
    console.warn('Add ClientProvider to use client context');

    return Promise.resolve({ error: true, status: 0 });
  },
  cache: new CacheStore(),
  suspenseCache: new SuspenseCacheStore(),
};

export const ClientContext = createContext(initialContext);
