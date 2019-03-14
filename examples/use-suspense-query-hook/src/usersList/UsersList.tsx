import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';

import { UsersListProps } from './UsersList.types';

export const UsersList = ({ error, users }: UsersListProps) => {
  return (
    <List style={{ padding: '24px', display: 'flex', flexFlow: 'column' }}>
      {!error &&
        users &&
        users.map(user => (
          <Fragment key={user.uuid}>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={user.firstName} src={user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={`${user.firstName} ${user.lastName}`}
                secondary={
                  <Fragment>
                    <Typography component="span" color="textPrimary">
                      {user.role}
                    </Typography>
                    {user.description}
                  </Fragment>
                }
              />
            </ListItem>
          </Fragment>
        ))}

      {error && <span>Error during fetch</span>}
    </List>
  );
};
