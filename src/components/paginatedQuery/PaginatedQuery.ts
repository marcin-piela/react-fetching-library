import { usePaginatedQuery, useQuery } from '../../hooks';

import { PaginatedQueryProps } from './PaginatedQuery.types';

export const PaginatedQuery = <T = any, R = any>({ action, children, initFetch = true }: PaginatedQueryProps<T, R>) => {
  const { error, loading, fetch, response } = usePaginatedQuery<T, R>(action, initFetch);

  return children({
    error,
    fetch,
    loading,
    response,
  });
};
