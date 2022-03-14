import App, { Container } from 'next/app';
import 'isomorphic-unfetch';

import { ClientContextProvider } from 'react-fetching-library';
import client from '../api/client';

class MyApp extends App {
  static async getInitialProps(appContext) {
    let appProps = {};

    if (typeof App.getInitialProps === 'function') {
      appProps = await App.getInitialProps(appContext);
    }

    return {
      ...appProps,
      cacheItems: client.cache.getValue(),
    };
  }

  render() {
    const { Component, pageProps, cacheItems } = this.props;
    client.cache.setValue(cacheItems);

    return (
      <Container>
        <ClientContextProvider client={client}>
          <Component {...pageProps} />
        </ClientContextProvider>
      </Container>
    );
  }
}

export default MyApp;
