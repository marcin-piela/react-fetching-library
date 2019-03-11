import { useQuery } from '../../hooks';

import { QueryProps } from './Query.types';

export const Query = <T = any, R = any>({ action, children, initFetch = true }: QueryProps<T, R>) => {
  const { error, loading, fetch, response } = useQuery<T, R>(action, initFetch);

  return children({
    error,
    fetch,
    loading,
    response,
  });
};
