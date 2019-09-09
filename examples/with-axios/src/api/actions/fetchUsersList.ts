import { Action } from 'react-fetching-library';

export const fetchUsersList: Action = {
  method: 'GET',
  endpoint: '/users',
};
