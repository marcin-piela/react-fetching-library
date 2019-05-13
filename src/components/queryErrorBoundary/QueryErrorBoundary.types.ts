import { ReactElement } from 'react';

export type ErrorQueryBoundaryProps = {
  fallback: (status: number) => ReactElement;
  statuses: number[];
};

export type ErrorQueryBoundaryState = {
  hasError: boolean;
  status?: number;
};
