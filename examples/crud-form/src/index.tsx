import React from 'react';
import ReactDOM from 'react-dom';
import { createClient, ClientContextProvider } from 'react-fetching-library';
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core';

import './index.css';
import App from './App';

const client = createClient({
  requestInterceptors: [],
  responseInterceptors: [],
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CSSReset />
    <ClientContextProvider client={client}>
      <App />
    </ClientContextProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);
