import { createContext } from 'react';

import { MutationContextType } from './mutationContext.types';

export const MutationContext = createContext<MutationContextType<any, any> | undefined>(undefined);
