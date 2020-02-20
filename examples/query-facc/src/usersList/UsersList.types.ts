import { User } from '../api/types';

export type UsersListProps = {
  loading: boolean;
  error: boolean;
  users: User[] | undefined;
  onReload: () => void;
};
