import { Action } from 'react-fetching-library';

import { User } from '../types';

export const fetchUsersList: Action<User[]> = {
  method: 'GET',
  endpoint: '/users',
};
