import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Client } from './api/Client';
import { UsersListContainer } from './usersList/UsersListContainer';

const App = () => {
  return (
    <ClientContextProvider client={Client}>
      <UsersListContainer />
    </ClientContextProvider>
  );
};

export default App;
