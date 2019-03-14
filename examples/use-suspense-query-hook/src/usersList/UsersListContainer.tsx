import React from "react";
import { useSuspenseQuery } from "react-fetching-library";

import { fetchUsersList } from "../api/actions/fetchUsersList";

import { UsersList } from "./UsersList";
import { User } from "./UsersList.types";

export const UsersListContainer = () => {
  const { payload, error } = useSuspenseQuery<User[]>(fetchUsersList);

  return <UsersList error={error} users={payload} />;
};
