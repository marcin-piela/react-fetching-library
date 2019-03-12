import { useQuery } from "react-fetching-library";
import React from "react";

import { fetchUsersList } from "../api/actions/fetchUsersList";

import { User } from "./UsersList.types";
import { UsersList } from "./UsersList";

export const UsersListContainer = () => {
  const { loading, response, error, fetch } = useQuery<User[]>(
    fetchUsersList
  );

  return (
    <UsersList
      loading={loading}
      error={error}
      users={response}
      onReload={(fetch)}
    />
  );
};
