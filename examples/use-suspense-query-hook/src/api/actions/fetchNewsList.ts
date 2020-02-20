import { Action } from 'react-fetching-library';

import { News } from '../types';

export const fetchNewsList: Action<News[]> = {
  method: 'GET',
  endpoint: '/news',
};
