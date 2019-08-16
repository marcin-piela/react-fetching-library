import { QueryResponse } from 'fetching-library';

export class QueryError extends Error {
  response: QueryResponse;

  constructor(message: string, response: QueryResponse) {
    super(message);

    Object.setPrototypeOf(this, QueryError.prototype);

    this.name = 'QueryError';
    this.response = response;
  }
}
