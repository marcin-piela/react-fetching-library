import App, { Container } from 'next/app';
import 'isomorphic-unfetch';

import { ClientContextProvider } from "react-fetching-library";
import client from '../client';

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <ClientContextProvider client={client}>
          <Component {...pageProps} />
        </ClientContextProvider>
      </Container>
    )
  }
}

export default MyApp