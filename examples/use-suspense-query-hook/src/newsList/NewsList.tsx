import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';

import { NewsListProps } from './NewsList.types';

export const NewsList = ({ news, error }: NewsListProps) => {
  return (
    <Fragment>
      {error && <span>Error during fetching news list</span>}

      {news &&
        news.map(newsItem => (
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
