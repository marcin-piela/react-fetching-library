import React, { Fragment } from 'react';

import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  ListItemText,
} from '../shared';

import { UsersListProps } from './UsersList.types';

export const UsersList = ({ loading, error, users, onReload }: UsersListProps) => {
  return (
    <List style={{ padding: '24px', display: 'flex', flexFlow: 'column' }}>
      {loading && <CircularProgress style={{ margin: '100px auto' }} />}

      {error && (
        <Button onClick={onReload} variant="contained" color="secondary">
          Error, click to reload
        </Button>
      )}

      {!loading && !error && users && (
        <ListItem>
          <Typography component="span" color="textPrimary">
            You can turn off wi-fi to see errors after fetch :)
          </Typography>
        </ListItem>
      )}

      {!loading &&
        !error &&
        users &&
        users.map((user) => (
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

      {!loading && !error && (
        <Button onClick={onReload} variant="contained" color="primary">
          Click to reload
        </Button>
      )}
    </List>
  );
};
