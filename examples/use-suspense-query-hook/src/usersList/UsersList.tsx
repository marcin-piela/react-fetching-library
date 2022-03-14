import React, { Fragment } from 'react';

import { Avatar, Divider, List, ListItem, ListItemAvatar, Typography, ListItemText } from '../shared';

import { UsersListProps } from './UsersList.types';

export const UsersList = ({ error, users }: UsersListProps) => {
  return (
    <List style={{ padding: '24px', display: 'flex', flexFlow: 'column' }}>
      {!error &&
        users &&
        users.map((user) => (
          <Fragment key={user.uuid}>
            <Divider variant="inset" />
            <ListItem>
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
