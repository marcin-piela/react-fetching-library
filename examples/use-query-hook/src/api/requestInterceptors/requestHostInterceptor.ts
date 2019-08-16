import { RequestInterceptor } from 'fetching-library';
import { Action } from 'react-fetching-library';

export const requestHostInterceptor: (host: string) => RequestInterceptor<Action> = host => () => async action => {
  return {
    ...action,
    endpoint: `${host}${action.endpoint}`,
  };
};
