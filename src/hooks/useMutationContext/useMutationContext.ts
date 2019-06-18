import { useContext } from 'react';

import { MutationContext } from '../../context/mutationContext/mutationContext';
import { MutationContextType } from '../../context/mutationContext/mutationContext.types';

export const useMutationContext = <T = any, S = any>() => {
  const context = useContext(MutationContext);

  if (context === undefined) {
    throw new Error('useMutationContext useQueryContext must be used within a MutationContext.Provider');
  }

  return context as MutationContextType<T, S>;
};
