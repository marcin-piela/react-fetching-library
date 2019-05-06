import React from 'react';
import client from '../api/client';
import { useQuery } from 'react-fetching-library';

const action = {
  method: 'GET',
  endpoint: 'https://private-34f3a-reactapiclient.apiary-mock.com/users',
};

const Users = () => {
  const { loading, payload, error, query } = useQuery(action, true);

  return (
    <div>
      {loading && <span>Loading</span>}

      {error && <span>Error</span>}

      {!loading &&
        payload &&
        payload.map((user, index) => (
          <span key={user.uuid}>
            {index + 1} - {user.firstName} <br />
            <br />
          </span>
        ))}

      <button onClick={query}>Reload</button>
    </div>
  );
};

Users.getInitialProps = async () => {
  await client.query(action);

  return {};
};

export default Users;
