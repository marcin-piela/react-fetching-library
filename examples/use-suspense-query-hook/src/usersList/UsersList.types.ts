import { User } from '../api/types';

export type UsersListProps = {
  error: boolean;
  users: User[] | undefined;
};
