import { createCache } from 'react-fetching-library';

export const cache = createCache(
  action => {
    return action.method === 'GET';
  },
  response => {
    return new Date().getTime() - response.timestamp < 100000;
  },
);
