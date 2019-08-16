import { QueryResponse } from 'fetching-library';
import { useEffect, useState } from 'react';
import { Action } from '../../client/client.types';
import { QueryError } from '../../errors/QueryError';

export const useDetectResponseError = (
  initQueryResponse: QueryResponse | null = null,
  initAction: Action | null = null,
) => {
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(initQueryResponse);
  const [action, setAction] = useState<Action | null>(initAction);

  useEffect(() => {
    setQueryResponse(initQueryResponse);
    setAction(initAction);
  }, [initAction, initQueryResponse]);

  if (
    action &&
    queryResponse &&
    queryResponse.status &&
    action.config &&
    action.config.emitErrorForStatuses &&
    action.config.emitErrorForStatuses.includes(queryResponse.status)
  ) {
    throw new QueryError('query-error', queryResponse);
  }

  return (newQueryResponse: QueryResponse, newAction: Action) => {
    setQueryResponse(newQueryResponse);
    setAction(newAction);
  };
};
