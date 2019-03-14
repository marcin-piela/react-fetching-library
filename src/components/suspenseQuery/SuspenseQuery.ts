import { useSuspenseQuery } from '../../hooks';

import { SuspenseQueryProps } from './SuspenseQuery.types';

export const SuspenseQuery = <T = any, R = any>({ action, children}: SuspenseQueryProps<T, R>) => {
  const response = useSuspenseQuery<T, R>(action);

  return children(response);
};
