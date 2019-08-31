import { Cache } from '../../cache/cache.types';
import { Action, QueryResponse } from '../../client/client.types';

export type MutationContextType<T, S> = {
  loading: boolean;
  mutate: (action: S) => Promise<QueryResponse<T>>;
  reset: () => void;
  abort: () => void;
} & QueryResponse<T>;
