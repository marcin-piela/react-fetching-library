import { News } from '../api/types';

export type NewsListProps = {
  error: boolean;
  news: News[] | undefined;
};
