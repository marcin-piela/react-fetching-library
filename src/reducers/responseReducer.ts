import { QueryResponse } from '../client/client.types';
import { Action, ResponseReducerState } from './responseReducer.types';

export const SET_LOADING = 'response/loading';
export const RESET = 'response/reset';
export const SET_RESPONSE = 'response/set';

export const responseReducer = <T>(state: ResponseReducerState<T>, action: Action<T>) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_RESPONSE: {
      if (!action.response) {
        throw new Error();
      }

      return {
        ...state,
        loading: false,
        response: action.response,
      };
    }
    case RESET: {
      return {
        loading: false,
        response: {
          error: false,
        },
      };
    }
    default: {
      throw new Error();
    }
  }
};
