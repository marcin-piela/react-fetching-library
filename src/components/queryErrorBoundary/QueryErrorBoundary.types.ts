import { QueryResponse } from 'fetching-library';
import { ReactElement } from 'react';

export type ErrorQueryBoundaryProps = {
  fallback: (response: QueryResponse, restart: () => void) => ReactElement;
  statuses: number[];
};

export type ErrorQueryBoundaryState = {
  hasError: boolean;
  response?: QueryResponse;
};
