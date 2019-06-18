import { createContext } from 'react';

import { QueryContextType } from './queryContext.types';

export const QueryContext = createContext<QueryContextType<any> | undefined>(undefined);
