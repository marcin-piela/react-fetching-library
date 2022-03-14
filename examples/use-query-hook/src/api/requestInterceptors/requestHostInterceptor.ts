import { RequestInterceptor } from 'react-fetching-library';

export const requestHostInterceptor: (host: string) => RequestInterceptor = (host) => () => async (action) => {
  return {
    ...action,
    endpoint: `${host}${action.endpoint}`,
  };
};
