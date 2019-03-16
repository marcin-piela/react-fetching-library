# Getting started

__react-fetching-library__ -  simple and powerful fetching library for React. Use hooks or HOCs to fetch data in easy way. No dependencies! Just react under the hood.

## Installation

__react-fetching-library__ requires react and react-dom version 16.8 or higher.

Run the following from your project root :

```sh
npm install react-fetching-library
```
or
```sh
yarn add react-fetching-library
```

That’s it! You may now use __react-fetching-library__ in your React application.

## Usage

To get started you need to create an instance of [`Client`][] and then you will want to provide that client to your React component tree using the [`<ClientContextProvider/>`][] component. 

First we need an instance of [`Client`][]. We have to import `Client` function.

```js
import { Client as createClient } from 'react-fetching-library';

export const Client = createClient({
  //None option is required
  requestInterceptors: [],
  responseInterceptors: [],
  cacheProvider: cacheProvider,
});
```

Next you have to add [`<ClientContextProvider/>`][] component to the root of your React component tree. This component [provides](https://reactjs.org/docs/context.html) the react-fetching-library functionality to all the other components in the application without passing it explicitly. To use an [`<ClientContextProvider/>`][] with your newly constructed client see the following:

```js
import { ClientContextProvider } from 'react-fetching-library';

ReactDOM.render(
  <ClientContextProvider client={client}>
    <MyApplication />
  </ClientContextProvider>,
  document.getElementById('root'),
);
```

From now you can add components that are connected to defined client.

[`<ClientContextProvider/>`]: https://example.com
[`Client`]: https://example.com

# Examples

## useQuery hook

For an example of useQuery hook view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-query-hook)

## Query HOC

For an example of Query HOC view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/query-hoc)

## ClientContext

For an example of use ClientContext view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/client-context)

## useSuspenseQuery hook

For an example of useSuspenseQuery (to see powerful of react suspense, you can show one spinner for two lists at the same time) view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-suspense-query-hook)

## Caching responses

For an example of simple caching responses view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/cache-provider)

