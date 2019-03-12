import { Query } from 'react-fetching-library';
import React from 'react';

import { fetchUsersList } from '../api/actions/fetchUsersList';

import { User } from './UsersList.types';
import { UsersList } from './UsersList';

export const UsersListContainer = () => (
  <Query<User[]> action={fetchUsersList}>
    {({ loading, error, response, fetch }) => (
      <UsersList loading={loading} error={error} users={response} onReload={fetch} />
    )}
  </Query>
);
