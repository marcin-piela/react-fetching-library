import React from 'react';
import { useQuery } from 'react-fetching-library';

import { fetchUsersList } from '../api/actions/fetchUsersList';

import { UsersList } from './UsersList';
import { User } from './UsersList.types';

export const UsersListContainer = () => {
  const { loading, response, error, fetch } = useQuery<User[]>(fetchUsersList);

  return <UsersList loading={loading} error={error} users={response} onReload={fetch} />;
};
