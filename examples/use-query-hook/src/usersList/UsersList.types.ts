export type UsersListProps = {
  loading: boolean;
  error: boolean;
  users: User[] | null;
  onReload: () => void;
};

export type User = {
  firstName: string;
  lastName: string;
  description: string;
  avatar: string;
  role: string;
};
