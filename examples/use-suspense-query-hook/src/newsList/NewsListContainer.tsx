import React from 'react';
import { useSuspenseQuery } from 'react-fetching-library';

import { fetchNewsList } from '../api/actions/fetchNewsList';
import { Button } from '../shared';

import { NewsList } from './NewsList';
import { News } from './NewsList.types';

export const NewsListContainer = () => {
  const { payload, error, query } = useSuspenseQuery<News[]>(fetchNewsList);

  return (
    <div>
      <Button onClick={query} variant="contained" color="primary">
        Click to reload
      </Button>

      <NewsList error={error} news={payload} />
    </div>
  );
};
