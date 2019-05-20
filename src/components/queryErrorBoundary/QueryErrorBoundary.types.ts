import { ReactElement } from 'react';
import { QueryResponse } from '../../client/client.types';

export type ErrorQueryBoundaryProps = {
  fallback: (response: QueryResponse, restart: () => void) => ReactElement;
  statuses: number[];
};

export type ErrorQueryBoundaryState = {
  hasError: boolean;
  response?: QueryResponse;
};
