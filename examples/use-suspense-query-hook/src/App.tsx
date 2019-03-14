import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Fragment, Suspense } from 'react';
import { ClientContextProvider } from 'react-fetching-library';

import { Client } from './api/Client';
import { NewsListContainer } from './newsList/NewsListContainer';
import { UsersListContainer } from './usersList/UsersListContainer';

const App = () => {
  return (
    <ClientContextProvider client={Client}>
      <Suspense fallback={<CircularProgress style={{ margin: '50%' }} />}>
        <Fragment>
          <UsersListContainer />
          <NewsListContainer />
        </Fragment>
      </Suspense>
    </ClientContextProvider>
  );
};

export default App;
