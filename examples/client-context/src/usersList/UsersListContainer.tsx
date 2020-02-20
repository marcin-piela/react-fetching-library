import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ClientContext } from 'react-fetching-library';

import { fetchUsersList } from '../api/actions/fetchUsersList';

import { UsersList } from './UsersList';
import { User } from '../api/types';

export const UsersListContainer = () => {
  const clientContext = useContext(ClientContext);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const query = useCallback(async () => {
    setLoading(true);

    const apiResponse = await clientContext.query(fetchUsersList);

    /**
     *  error: boolean,
        headers: response headers object,
        payload: json response object,
        status: number,
     */

    setUsers(apiResponse.payload);
    setError(apiResponse.error);
    setLoading(false);
  }, []);

  return <UsersList loading={isLoading} error={isError} users={users} onLoad={query} />;
};
