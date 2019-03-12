export type UsersListProps = {
  loading: boolean;
  error: boolean;
  users: User[] | null;
  onLoad: () => void;
};

export type User = {
  firstName: string;
  lastName: string;
  description: string;
  avatar: string;
  role: string;
};
