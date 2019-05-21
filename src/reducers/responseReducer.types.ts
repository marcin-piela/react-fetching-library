import { QueryResponse } from '../client/client.types';

export type ResponseReducerState<T> = {
  response: QueryResponse<T>;
  loading: boolean;
};

export type Action<T> = {
  response?: QueryResponse<T>;
  type: string;
};

export type ResponseReducer<T> = (state: ResponseReducerState<T>, action: Action<T>) => ResponseReducerState<T>;
