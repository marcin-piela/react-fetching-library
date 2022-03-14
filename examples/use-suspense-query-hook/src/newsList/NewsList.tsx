import React, { Fragment } from 'react';

import { Avatar, Card, CardContent, CardHeader, CardMedia, Typography } from '../shared';

import { NewsListProps } from './NewsList.types';

export const NewsList = ({ news, error }: NewsListProps) => {
  return (
    <Fragment>
      {error && <span>Error during fetching news list</span>}

      {news &&
        news.map((newsItem) => (
          <Card key={newsItem.uuid}>
            <CardHeader
              avatar={<Avatar aria-label="Recipe">R</Avatar>}
              title={newsItem.title}
              subheader={newsItem.date}
            />
            <CardMedia image={newsItem.image} title={newsItem.title} style={{ height: '200px' }} />
            <CardContent>
              <Typography component="p">{newsItem.description}</Typography>
            </CardContent>
          </Card>
        ))}
    </Fragment>
  );
};
