import React from 'react';
import { useSuspenseQuery } from 'react-fetching-library';

import { fetchUsersList } from '../api/actions/fetchUsersList';

import { UsersList } from './UsersList';

export const UsersListContainer = () => {
  const { payload, error } = useSuspenseQuery(fetchUsersList);

  return <UsersList error={error} users={payload} />;
};
