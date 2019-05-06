import React from "react";
import client from "../client";

const action = {
  method: "GET",
  endpoint: "https://private-34f3a-reactapiclient.apiary-mock.com/users"
};

const Users = ({ loading, payload, error, query }) => {
  return (
    <div>
      {loading && <span>Loading</span>}

      {error && <span>Error</span>}

      {payload && <span>{payload.length}</span>}

      <button onClick={query}>Reload</button>
    </div>
  );
};

Users.getInitialProps = async ({ req }) => {
  // fetch
  const res = await client.query(action);

  // get data from cache
  console.log(client.cache.get(action));

  return res;
}

export default Users;
