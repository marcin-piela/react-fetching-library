import React from 'react';
import { useSuspenseQuery } from 'react-fetching-library';

import { fetchNewsList } from '../api/actions/fetchNewsList';

import { NewsList } from './NewsList';
import { News } from './NewsList.types';

export const NewsListContainer = () => {
  const { payload, error } = useSuspenseQuery<News[]>(fetchNewsList);

  return <NewsList error={error} news={payload} />;
};
