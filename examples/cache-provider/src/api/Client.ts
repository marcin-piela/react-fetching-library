import { createClient, createCache, QueryResponse, Action } from 'react-fetching-library';

import { requestHostInterceptor } from './requestInterceptors/requestHostInterceptor';

// In real application this const will be stored in ENV's
const HOST = 'https://private-34f3a-reactapiclient.apiary-mock.com';

const cache = createCache<QueryResponse<any>>(
  (action: Action<any>) => {
    return action.method === 'GET';
  },
  (response: QueryResponse<any> & { timestamp: number }) => {
    return new Date().getTime() - response.timestamp < 10000;
  },
);

export const Client = createClient({
  requestInterceptors: [requestHostInterceptor(HOST)],
  cacheProvider: cache,
});
