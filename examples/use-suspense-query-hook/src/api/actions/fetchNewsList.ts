import { Action } from 'react-fetching-library';
export const fetchNewsList: Action = {
  method: 'GET',
  endpoint: '/news',
};
