export type UsersListProps = {
  error: boolean;
  users: User[] | undefined;
};

export type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  description: string;
  avatar: string;
  role: string;
};
