import React from 'react';
import { useQuery } from 'react-fetching-library';

import { fetchUsersList } from '../api/actions/fetchUsersList';

import { UsersList } from './UsersList';

export const UsersListContainer = () => {
  const { loading, payload, error, query, abort } = useQuery({
    ...fetchUsersList,
    onDownloadProgress: (progressEvent) => {
      console.log('download', progressEvent);
    },
  });

  return <UsersList loading={loading} error={error} users={payload} onReload={query} onAbort={abort} />;
};
