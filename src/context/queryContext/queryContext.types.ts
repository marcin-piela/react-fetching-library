import { QueryResponse } from '../../client/client.types';

export type QueryContextType<T> = {
  loading: boolean;
  query: () => Promise<QueryResponse<T>>;
} & QueryResponse<T>;
