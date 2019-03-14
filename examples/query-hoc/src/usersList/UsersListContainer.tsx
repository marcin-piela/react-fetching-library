import React from 'react';
import { Query } from 'react-fetching-library';

import { fetchUsersList } from '../api/actions/fetchUsersList';

import { UsersList } from './UsersList';
import { User } from './UsersList.types';

export const UsersListContainer = () => (
  <Query<User[]> action={fetchUsersList}>
    {({ loading, error, payload, query }) => (
      <UsersList loading={loading} error={error} users={payload} onReload={query} />
    )}
  </Query>
);
