import { QueryResponse } from 'fetching-library';

export type QueryContextType<T> = {
  loading: boolean;
  query: () => Promise<QueryResponse<T>>;
} & QueryResponse<T>;
