export type NewsListProps = {
  error: boolean;
  news: News[] | undefined;
};

export type News = {
  uuid: string;
  title: string;
  description: string;
  date: string;
  image: string;
};
