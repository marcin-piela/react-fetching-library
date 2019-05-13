export class QueryError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'QueryError';
    this.status = status;
  }
}
