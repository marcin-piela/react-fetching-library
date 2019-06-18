import { useContext } from 'react';

import { QueryContext } from '../../context/queryContext/queryContext';
import { QueryContextType } from '../../context/queryContext/queryContext.types';

export const useQueryContext = <T = any>() => {
  const context = useContext(QueryContext);

  if (context === undefined) {
    throw new Error('useQueryContext must be used within a QueryContext.Provider');
  }

  return context as QueryContextType<T>;
};
