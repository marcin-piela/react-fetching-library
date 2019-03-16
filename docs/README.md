# Getting started

__react-fetching-library__ -  simple and powerful fetching library for React. Use hooks or HOCs to fetch data in easy way. No dependencies! Just react under the hood.

[![Build Status][build-badge]][build] [![version][version-badge]][package] ![downloads][downloads-badge] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] ![Code of Conduct][gzip-badge]

✅ Zero dependencies (react, react-dom as peer deps)

✅ Provides hooks and HOCs

✅ Uses native fetch

✅ Request and response interceptors allows to customize all requests/responses (add authorization, refresh token etc) 

✅ React suspense support 

✅ TypeScript support 

✅ 2.2k minizipped

✅ Provides simple cache mechanism

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

To start using this library we have to create an instance of [`Client`][] and then we will need to provide that client to our React component tree using the [`<ClientContextProvider/>`][] component. 

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

Next we have to add [`<ClientContextProvider/>`][] component to the root of our React component tree. This component [provides](https://reactjs.org/docs/context.html) the react-fetching-library functionality to all the other components in the application without passing it explicitly. To use an [`<ClientContextProvider/>`][] with newly constructed client see the following:

```js
import { ClientContextProvider } from 'react-fetching-library';

ReactDOM.render(
  <ClientContextProvider client={client}>
    <MyApplication />
  </ClientContextProvider>,
  document.getElementById('root'),
);
```

And now we can add components that are connected to defined client.

---

# Client

## Options

During creating instance of Client you can pass additional options:

```js
import { Client as createClient } from 'react-fetching-library';

export const Client = createClient(options);
```

Available options:

| option      | description                                                            | default value |
| ------------------------- | ---------------------------------------------------------------------- | ------------- |
| requestInterceptors         | array of requestInterceptors                               | []               |
| responseInterceptors | array of responseInterceptors | []         |
| cacheProvider                   | cache provider                                  | undefined      |

## Request interceptors

You can intercept requests before they are handled by __Fetch__ function. Interceptor has access to [`Action`][] object.

For example, when you want to add __HOST__ address to all API requests you can create such interceptor:

```js
export const requestHostInterceptor: host => client => async action => {
  return {
    ...action,
    endpoint: `${host}${action.endpoint}`,
  };
};
````

And then you have to add it to the Client:

```js
import { Client as createClient } from 'react-fetching-library';

export const Client = createClient({
  requestInterceptors: [requestHostInterceptor('http://example.com/')]
});
```

## Response interceptors

You can intercept responses before they are handled by __then__. Interceptor has access to [`Action`][] and [`QueryResponse`][] objects.

For example, your API responses with such object :

```json
{
  data: {
    ...
  },
}
```

and you want to get rid of `data` key, you can create response interceptor like that:

```js
export const responseInterceptor = client => async (action, response) => {
  if (response.payload.data) {
    return {
      ...response,
      payload: response.payload.data
    };
  }

  return response;
};
````

And then you have to add it to the Client:

```js
import { Client as createClient } from 'react-fetching-library';

export const Client = createClient({
  responseInterceptors: [responseInterceptor]
});
```

## Methods

| name      | description                | param | response
| ------------------------- | --------------------------------- | ------------- |------------- |
| query         | function which dispatch request to API | [`Action`][]  | [`QueryResponse`][]


## Cache provider

__react-fetching-library__  provides simple cache which you can customize.

```js
  import { createChache } from 'react-fetching-library';

  const cache = createCache(isCacheable, isValid);
```

Parameters:

| option      | description                                                            | required |
| ------------------------- | ---------------------------------------------------------------------- | ------------- |
| isCacheable         | function which checks if provided [`Action`][] is cacheable, returns bool                               | yes               |
| isValid | function which checks if value stored in cache ([`QueryResponse`][] extended with timestamp property)  is valid, returns bool | yes         |

Example of __Cache__ which caching all __GET__ requests for __10__ seconds:

```js
import { createCache } from 'react-fetching-library';

const cache = createCache(
  (action) => {
    return action.method === 'GET';
  },
  (response) => {
    return new Date().getTime() - response.timestamp < 10000;
  },
);
```

Example of use:

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/cache-provider)

## Own CacheProvider

You can create your own cache provider. It should implement this type:

```js
type Cache<T> = {
  add: (action: Action<any>, value: T) => void;
  remove: (action: Action<any>) => void;
  get: (action: Action<any>) => QueryResponse & { timestamp: number } | undefined;
  items: { [key: string]: QueryResponse };
};

```

where `T` is [`QueryResponse`][] 

## Context

You can get [`Client`][] instance in every place in your React application. You have to use [`ClientContext`][] :

```js
import { useState, useContext, useCallback } from 'react'; 
import { ClientContext } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const clientContext = useContext(ClientContext);
  const [users, setUsers] = useState([]);

  const query = useCallback(async () => {
    const apiResponse = await clientContext.query(fetchUsersList);

    setUsers(apiResponse.payload);
  }, []);

    return <UsersList users={users} onLoad={query} />;
}
```

Example of use:

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/client-context)

---

# Action

Action is the object which describes request. 

## Example

For example GET request on `/users` endpoint will look like:

```js
const fetchUsersActions = {
  endpoint: '/users',
  method: 'GET',
}
```

## Prameters

| option      | description   | type | required |
| ------------------------- | ------------------ | ------------- | ------------- |
| endpoint         | request address       | string | yes               |
| method | HTTP method | string         | yes 
| body | body of request | any         | no 
| headers | headers of request | { [propName: string]: string }         | no 
| credentials | - | [RequestCredentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)         | no 
| cache | - | [RequestCache](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)         | no 
| mode | - | [RequestMode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)         | no 
| referrerPolicy | - | [ReferrerPolicy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)         | no 
| referrer | - | string         | no 
| integrity | - | string         | no 
| keepalive | - | bool         | no 
| redirect | - | [RequestRedirect](https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect)         | no 
| signal | - | [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) / null         | no 
| window | - | any         | no 

---

# QueryResponse

This is the results of API query

## Properties

| key      | description   | type | always |
| ------------------------- | ------------------ | ------------- |------------- |
| status         | HTTP response status       | number | no               |
| error | error flag | bool         | yes 
| errorObject | error object | object         | no 
| payload | response payload from API | any         | no 
| headers | response headers | string         | no 

## Example

Example response for `/users` request:

```json
{
  "status": 200,
  "error": false,
  "errorObject": undefined,
  "payload": [],
  "headers": Headers,
}
```

---

# Hooks

Available hooks

## useQuery

This hook is used to query data from API. By default request is sent immediately. You can turn on lazy loading by setting second param as `true`. Response of hook is [`QueryResponse`][] extended by `query` function which allows you to re-run query again or first time (when lazy loading is turned on). First param of this hook is [`Action`][]

```js
import { useQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { loading, payload, error, query } = useQuery(fetchUsersList);

  return <UsersList loading={loading} error={error} users={payload} onReload={query} />;
};
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-query-hook)

## useSuspenseQuery

This hook is also used to query data from API but without lazy loading option. It requires React Suspense component above in React tree. First param of this hook is [`Action`][]

```js
import { useuseSuspenseQueryQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { payload, error } = useSuspenseQuery(fetchUsersList);

  return <UsersList error={error} users={payload} />;
};

```

And above in the tree:

```js
import React, { Suspense } from 'react';

const App = () => {
  return (
    <ClientContextProvider client={Client}>
      <Suspense fallback={<span>Loading</span>}>
          <UsersListContainer />
      </Suspense>
    </ClientContextProvider>
  );
};
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-suspense-query-hook)

---

# HOCs

## Query

This is almost the same as [`useQuery`][] hook, but this is Higher Order Component to use directly in the JSX. Prop `initFetch` can be `false` to turn on lazy loading.

```js
import { Query } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => (
  <Query action={fetchUsersList} initFetch={true}>
    {({ loading, error, payload, query }) => (
      <UsersList loading={loading} error={error} users={payload} onReload={query} />
    )}
  </Query>
);

```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/query-hoc)

## SuspenseQuery

This is almost the same as [`useSuspenseQuery`][] hook, but this is Higher Order Component to use directly in the JSX.


```js
import { SuspenseQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => (
  <SuspenseQuery action={fetchUsersList}>
    {({ error, payload }) => (
      <UsersList error={error} users={payload} />
    )}
  </Query>
);

```

And above in the tree:

```js
import React, { Suspense } from 'react';

const App = () => {
  return (
    <ClientContextProvider client={Client}>
      <Suspense fallback={<span>Loading</span>}>
          <UsersListContainer />
      </Suspense>
    </ClientContextProvider>
  );
};
```

---

# List of examples

All examples are written in TypeScript.

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



[`<ClientContextProvider/>`]: #context
[`Client`]: #client
[`ClientContext`]: #context
[`Action`]: #action
[`QueryResponse`]: #queryresponse
[`useQuery`]: #usequery
[`useSuspenseQuery`]: #usesuspensequery
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/marcin-piela/react-fetching-library.svg?style=flat-square
[build]: https://travis-ci.org/marcin-piela/react-fetching-library
[version-badge]: https://img.shields.io/npm/v/react-fetching-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-fetching-library
[downloads-badge]: https://img.shields.io/npm/dm/react-fetching-library.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-fetching-library.svg?style=flat-square
[license]: https://github.com/marcin-piela/react-fetching-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/marcin-piela/react-fetching-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/marcin-piela/react-fetching-library.svg?style=social
[github-watch]: https://github.com/marcin-piela/react-fetching-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/marcin-piela/react-fetching-library.svg?style=social
[github-star]: https://github.com/marcin-piela/react-fetching-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-fetching-library%20https%3A%2F%2Fgithub.com%2Fmarcin-piela%2Freact-fetching-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/marcin-piela/react-fetching-library.svg?style=social
[gzip-badge]:https://badgen.net/bundlephobia/minzip/react-fetching-library