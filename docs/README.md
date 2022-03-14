# Getting started

__react-fetching-library__ -  simple and powerful fetching library for React. Use hooks or FACCs (Function as Child Components) to fetch data in easy way. No dependencies! Just react under the hood.

[![Build Status][build-badge]][build] [![version][version-badge]][package] ![downloads][downloads-badge] [![MIT License][license-badge]][license]
 [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] ![Code of Conduct][gzip-badge] [![codecov](https://codecov.io/gh/marcin-piela/react-fetching-library/branch/master/graph/badge.svg)](https://codecov.io/gh/marcin-piela/react-fetching-library)

✅ Zero dependencies (react, react-dom as peer deps)

✅ Provides hooks and FACCs (Function as Child Components)

✅ SSR support 

✅ Uses Fetch API (but allows to use custom fetch implemenation and axios as well)

✅ Request and response interceptors allows to easily customize connection with API

✅ React Suspense support ([experimental *](#using-suspense-to-fetch-data))

✅ TypeScript support 

✅ Error boundaries to catch bad API responses

✅ Less than 3k minizipped

✅ Simple cache provider - easily to extend

✅ Handle race conditions

✅ Allows to abort pending requests

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

To start using this library we have to create an instance of [`Client`][] and then we will need to provide that client to our React component tree using the `<ClientContextProvider>` component. 

First we need an instance of [`Client`][]:

```js
import { createClient } from 'react-fetching-library';

const client = createClient({
  //None of the options is required
  requestInterceptors: [],
  responseInterceptors: [],
  fetch: customFetchImplementation,
});
```

Next we have to add `<ClientContextProvider>` component to the root of our React component tree. This component [provides](https://reactjs.org/docs/context.html) the react-fetching-library functionality to all the other components in the application without passing it explicitly. To use an `<ClientContextProvider>` with newly constructed client see the following:

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

Object which exposes `query` method and `cache` object. 

## How to create instance of Client

```js
import { createClient } from 'react-fetching-library';

const client = createClient(options);
```

## Available methods

| name      | description                | param | response
| ------------------------- | --------------------------------- | ------------- |------------- |
| query         | function which dispatch request to API | [`Action`][], skipCache flag  | Promise which resolves to [`QueryResponse`][]
| cache         |

```js
import { Action } from 'react-fetching-library';

const action: Action = { 
  method: 'GET',
  endpoint: '/users',
};

const skipCache = false;

client.query(action, skipCache);

client.cache.get(action);

```

## Available options

| option                | description                               | required | default value |
| --------------------- | ----------------------------------------- | -------- | ------------- |
| requestInterceptors   | array of requestInterceptors              | no       | []            |
| responseInterceptors  | array of responseInterceptors             | no       | []            |
| fetch                 | custom  fetch implementation              | no       | undefined     |

## Request interceptors

You can intercept requests before they are handled by __Fetch__ function. Interceptor has access to [`Action`][] object.

For example, when you want to add __HOST__ address to all API requests you can create such interceptor:

```js
export const requestHostInterceptor = host => client => async action => {
  return {
    ...action,
    endpoint: `${host}${action.endpoint}`,
  };
};
````

And then you have to add it to the Client:

```js
import { createClient } from 'react-fetching-library';

export const client = createClient({
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
import { createClient } from 'react-fetching-library';

export const client = createClient({
  responseInterceptors: [responseInterceptor]
});
```

## Context

You can get [`Client`][] instance in every place in your React application. To do it you have to use `ClientContext`. It returns `query` method and `cache` object when provided.

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

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/client-context?module=/src/usersList/UsersListContainer.tsx)

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

## Parameters

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
| config | additional config of action | see below         | no 
| responseType | type of expected response | arrayBuffer &#124; blob &#124; json &#124; text &#124; formData | no


### Config object:

| option      | description   | type | required |
| ------------------------- | ------------------ | ------------- | ------------- |
| emitErrorForStatuses         | list of HTTP status codes which throw error to allow to catch it in error boundary       | number[] | no               |

When you're using TypeScript and need to add some new params to config object or directly to `Action` then you have 3 possibilities to do that:

1. Add second param to `Action` config interface directly in action definition (`skipAuth` in example):

```js

type Response = {
  name: string;
}

const action:Action<Response, { skipAuth: boolean }> = {
    method: 'GET',
    endpoint: '/',
    config: {
      skipAuth: true,
    }
}
```

Obviously you can define that type before and use it in whole project:

```js
import { Action as BaseAction } from 'react-fetching-library';

type Action<R> = BaseAction<R, { skipAuth: boolean }>
```

2. Extend `ActionConfig` interface in `rfc-extended.d.ts` file with new params:

```js

import * as RFC from 'react-fetching-library';

declare module 'react-fetching-library' {
  export interface ActionConfig {
    // Only new params
    skipAuth: boolean;
    params: any;
  };
}
```

3. Extend `Action` interface in `rfc-extended.d.ts` with new params:
   
```js

import 'react-fetching-library';

declare module 'react-fetching-library' {
  export interface Action<R = any, Ext = any> {
    // Only new params
    skipAuth: boolean;
  }
}


```
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

This hook is used to query data (can be used to get data from API and mutate data as well) . By default request is sent immediately (`initFetch = true`). You can turn on lazy loading by setting second param as `false`. Response of hook is [`QueryResponse`][] extended by `query` function which allows you to re-run query again or first time (when lazy loading is turned on), `abort` function to abort pending request, `reset` function to reset state of hook and `loading` boolean to indicate if the query is still in progress. First param of this hook is [`Action`][]

```js
import { useQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { loading, payload, error, query, reset, abort } = useQuery(fetchUsersList);

  return <UsersList loading={loading} error={error} users={payload} onReload={query} />;
};
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-query-hook?module=/src/usersList/UsersListContainer.tsx)

## useSuspenseQuery 

This hook is also used to query data from API but without lazy loading option. It requires [React Suspense *](#using-suspense-to-fetch-data) component above in React tree. With Suspense you can control loading state of application, ie. show one spinner instead of dozen of it for every section of application. 


First param of this hook is [`Action`][]

```js
import { useSuspenseQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { payload, error, query } = useSuspenseQuery(fetchUsersList);

  return <UsersList error={error} users={payload} onReload={query} />;
};

```

And above in the tree:

```js
import React, { Suspense } from 'react';

const App = () => {
  return (
    <ClientContextProvider client={client}>
      <Suspense fallback={<span>Loading</span>}>
          <UsersListContainer />
      </Suspense>
    </ClientContextProvider>
  );
};
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-suspense-query-hook?module=/src/App.tsx)

## useMutation

This hook is used when you need to mutate data, ie for POST/PATCH/PUT actions. 
First param of this hook is function which returns [`Action`][] object. All params of this function have to be provided in returned `mutate` function. Hook returns loading flag, response payload, error flag and errorObject as well. To reset state of hook use `reset` method without any params. To abort pending request use `abort` function.

```js
import { useMutation } from 'react-fetching-library';

const addUserAction = (formValues) => ({
  method: 'POST',
  endpoint: '/users',
  body: formValues,
});

export const AddUserFormContainer = () => {
  const { loading, payload, mutate, error, reset, abort } = useMutation(addUserAction);

  const handleSubmit = async (formValues) => {
    const { error: mutateError } = await mutate(formValues);

    if (mutateError) {
      //show ie. notification
    }

    //success
  }

  return <AddUserForm loading={loading} error={error} onSubmit={handleSubmit} />;
};
```

## useBulkMutation

This hook is used when you need to mutate multiple data, ie for POST/PATCH/PUT actions for mass delete using a delete endpoint of one element. 
First param of this hook is function which returns [`Action`][] object. An array of params of this function have to be provided in returned `mutate` function. Hook returns loading flag, responses array, each containing the payload, error flag and errorObject. To reset state of hook use `reset` method without any params. To abort pending request use `abort` function.

```js
import { useBulkMutation } from 'react-fetching-library';

const deleteUserAction = (user) => ({
  method: 'DELETE',
  endpoint: '/users?id=' + user.id
});

export const DeleteUserFormContainer = () => {
  const { loading, responses, mutate, reset, abort } = useBulkMutation(deleteUserAction);

  const handleSubmit = async (selectedUsers) => {
    const { responses: responses } = await mutate(selectedUsers);
 
    const errors = responses.filter(response => response).map(response => response.error);


    if (errors.length > 0) {
      //show ie. notification
    }

    //success
  }

  return <DeleteUserFormContainer loading={loading} onSubmit={handleSubmit} />;
};
```

## useParameterizedQuery

This hook is used when you need to lazy load data with some parameters (parameters are not known during first render) passed to action creator.
First param of this hook is function which returns [`Action`][] object. All params of this function have to be provided in returned `query` function. Hook returns loading flag, response payload, error flag and errorObject as well. To reset state of hook use `reset` method without any params. To abort pending request use `abort` function.

```js
import { useParameterizedQuery } from 'react-fetching-library';

const fetchUserAction = (userId) => ({
  method: 'GET',
  endpoint: `/users/${userId}`,
});

export const UserDetailsContainer = ({ userId }) => {
  const { loading, payload, query, error, reset, abort } = useParameterizedQuery(fetchUserAction);

  useEffect(() => { 
    query(userId);
  }, [userId]);

  return <UserDetails loading={loading} error={error} user={payload} />;
};
```

## useCachedResponse 

This hook is used to get response object from cache.

First param of this hook is [`Action`][]

```js
import { useCachedResponse } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { payload, error } = useCachedResponse(fetchUsersList);

  return <UsersList error={error} users={payload} />;
};
```

## useClient 

This hook is used to get Client instance from ClientContext.

```js
import { useClient } from 'react-fetching-library';

export const UsersListContainer = () => {
  const { query, cache } = useClient();
};
```

---

# FACCs (Function as Child Components)

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

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/query-facc?module=/src/usersList/UsersListContainer.tsx)

## SuspenseQuery

This is almost the same as [`useSuspenseQuery`][#using-suspense-to-fetch-data] hook, but this is Higher Order Component to use directly in the JSX. It needs [React Suspense *]() above in React tree.


```js
import { SuspenseQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => (
  <SuspenseQuery action={fetchUsersList}>
    {({ error, payload, query }) => (
      <UsersList error={error} users={payload} onReload={query} />
    )}
  </Query>
);

```

And above in the tree:

```js
import React, { Suspense } from 'react';

const App = () => {
  return (
    <ClientContextProvider client={client}>
      <Suspense fallback={<span>Loading</span>}>
          <UsersListContainer />
      </Suspense>
    </ClientContextProvider>
  );
};
```

## Mutation

Higher Order Component to fire mutate action like POST/PUT/PATCH. The prop `actionCreator` is the function which returns `Action` object.

```js
import { Mutation } from 'react-fetching-library';

const addUserAction = (formValues) => ({
  method: 'POST',
  endpoint: '/users',
  body: formValues,
});

export const AddUserFormContainer = () => (
  <Mutation actionCreator={addUserAction}>
    {({ loading, error, payload, mutate }) => (
      <AddUserForm loading={loading} error={error} onSubmit={formValues => mutate(formValues)} />
    )}
  </Mutation>
);
```

---

# Error boundaries

[See React documentation first](https://reactjs.org/docs/error-boundaries.html).

If you want to use Error Boundary to easily handle API errors like 404, you can use QueryErrorBoundary in the three:

```js
import { ClientContextProvider, QueryErrorBoundary } from 'react-fetching-library';

const App = () => (
  <QueryErrorBoundary
    statuses={[404]}
    fallback={(response, restart) => (
      <div>
        Error {response.status} :(
        <span onClick={restart}>Click here to try again</span>
      </div>
    )}
  >
    <UserProfile/>
  </QueryErrorBoundary>
);
```

And action inside `UserProfile` has to be configured with `config.emitErrorForStatuses` key i.e:

```js
export const fetchUserProfile = (profile) => ({
  method: 'GET',
  endpoint: `/profile/${profile}`,
  config: {
    emitErrorForStatuses: [404],
  },
});
```

Please remember that only actions fired with hooks or components can throw errors based on `config.emitErrorForStatuses`, when you use `client.query` directly:

```js
const { query } = useClient();

const handleSubmit = async () => {
  const response = await query(action);
}
```

you have to throw error manually:

```js
export const UsersListContainer = () => {
  const [error, setError] = useState<QueryError | undefined>(undefined);
  const { query } = useClient();

  const handleSubmit = async () => {
    const response = await query(fetchUsersList);
  
    if (response.error && response.errorObject && response.errorObject instanceof QueryError) {
      setError(response.errorObject);
    }
  }

  if (error) {
    throw error;
  }

  return (
    <div>
      <span onClick={handleSubmit}>Query</span>
    </div>
  );
};
```

You can create your own ErrorBoundary, all you have to do is catch `QueryError` error.

```js

import React, { Component } from 'react';
import { QueryError } from 'react-fetching-library';

export class QueryErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    if (error instanceof QueryError) {
      return { hasError: true, response: error.response };
    }
  }

  state = {
    hasError: false,
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false, response: undefined };
  }

  restart = () => {
    this.setState({
      hasError: false,
      response: undefined,
    });
  };

  render() {
    if (
      this.state.hasError &&
      this.state.response &&
      this.state.response.status &&
      this.props.statuses.includes(this.state.response.status)
    ) {
      return this.props.fallback(this.state.response, this.restart);
    }

    return this.props.children;
  }
}

```

---

# Use with AXIOS

react-fetching-library allows to use custom `fetch` implementation so it's doable to use this library with AXIOS.

**See below example**

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/with-axios)

---

# SSR - server side rendering

To use react-fetching-library on server side you have to use isomporphic-fetch package ie. https://github.com/developit/unfetch#readme and then use library as in SPA apps.

**Example app for next.js framework (responses are cached for 100s on server side):**

`client.js` - client configuration
```js
import { createClient } from "react-fetching-library";

const client = createClient();

export default client;

```

`pages/_app.js` - in this file we're providing saved cache from server to client and initializing client context

```js
import App, { Container } from 'next/app';
import 'isomorphic-unfetch';

import { ClientContextProvider} from "react-fetching-library";
import client from '../api/client';

class MyApp extends App {
  static async getInitialProps (appContext) {
    let appProps = {}

    if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
    }

    return {
        ...appProps,
        cacheItems: client.cache.getValue(),
    }
  }

  render () {
    const { Component, pageProps, cacheItems } = this.props
    client.cache.setValue(cacheItems);

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
```

`pages/index.js` - in component we're fetching data in `getInitialProps` on server side and then all data are available on client side without additional fetching and everything is rendered by server (no `loading` text in rendered html ;) )

```js
import React, { useContext } from "react";
import client from "../api/client";
import { useQuery, ClientContext} from 'react-fetching-library';

const action = {
  method: "GET",
  endpoint: "https://private-34f3a-reactapiclient.apiary-mock.com/users"
};

const Users = () => {
  const { loading, payload, error, query } = useQuery(action, true);

  return (
    <div>
      {loading && <span>Loading</span>}

      {error && <span>Error</span>}

      {!loading && payload && payload.map((user, index) => (
        <span key={user.uuid}>
          {index + 1} - {user.firstName} <br/><br/>
        </span>
      ))}

      <button onClick={query}>Reload</button>
    </div>
  );
};

Users.getInitialProps = async () => {
  await client.query(action);

  return {}
}

export default Users;
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/ssr-nextjs)

---

# How to test

Let's say that you want to test following component:

```js
import React, { Fragment } from 'react';
import { useQuery } from 'react-fetching-library';

export const UsersListContainer = () => {
  const { loading, payload, error, query } = useQuery<User[]>(fetchUsersList);

  return (
    <Fragment>
      {loading && <span>Loading</span>}

      {error && <span>Error</span>}

      {payload && <span>Number of users {payload.data.length}</span>}

      <button onClick={query}>Refetch</button>
    </Fragment>
  );
};
```

You've got 2 ways to do it. First is to mock [`ClientContext`][] in the following way:

```js
import React from 'react';
import { act, render } from '@testing-library/react';
import { ClientContextProvider } from 'react-fetching-library';

import { UsersListContainer } from './UsersListContainer';

describe('users list test', () => {
  const client = {
    query: async () => ({
      error: false,
      status: 200,
      payload: {
        data: [
          {
            id: 'foo',
            name: 'foo,
          }
        ]
      },
    }),
  };

  it('fetches users and returns proper data on success', async () => {
    jest.useFakeTimers();

    const { getByText } = render(
      <ClientContextProvider client={client}>
        <UsersListContainer/>
      </ClientContextProvider>
    );

    expect(getByText('Loading')).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(getByText('Number of users 1')).toBeTruthy();
  });
});
```

Second way (recommended) is to use [`fetch-mock`](https://github.com/wheresrhys/fetch-mock):

```js
import React from 'react';
import { act, render } from '@testing-library/react';
import fetchMock from 'fetch-mock';

import { UsersListContainer } from './UsersListContainer';

describe('users list test', () => {
  fetchMock.get('/users', {
    data: [
      {
        id: 'foo',
        name: 'foo',
      },
    ],
  });

  it('fetches users and returns proper data on success', async () => {
    jest.useFakeTimers();

    const { getByText } = render(<UsersListContainer />);

    expect(getByText('Loading')).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(getByText('Number of users 1')).toBeTruthy();
  });
});

```

---

# List of examples

All examples are written in TypeScript.

## useQuery hook

For an example of useQuery hook view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-query-hook?module=/src/usersList/UsersListContainer.tsx)

## Query FACC

For an example of Query FACC view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/query-facc?module=/src/usersList/UsersListContainer.tsx)

## ClientContext

For an example of use ClientContext view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/client-context?module=/src/usersList/UsersListContainer.tsx)

## useSuspenseQuery hook

For an example of useSuspenseQuery (to see powerful of react suspense, you can show one spinner for two lists at the same time) view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-suspense-query-hook?module=/src/App.tsx)

## Caching responses

For an example of simple caching responses view this CodeSandbox (Typescript, CRA, Material-UI):

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/cache-provider?module=/src/api/Client.ts)

## SSR

For an example of SSR with next.js framework view this CodeSandbox:

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/ssr-nextjs)

## With Formik

For an example of a contact form submission with Formik and the useMutation hook:

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/crud-form)

## With AXIOS

Example with AXIOS instead of native Fetch API

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/with-axios)


---

# Legend

## Using Suspense to fetch data

For now React Suspense is not production ready to use it for fetch data as described [here](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-16x-mid-2019-the-one-with-suspense-for-data-fetching), so API of our component/hook may change in the future.

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
[gzip-badge]:https://badgen.net/bundlephobia/minzip/react-fetching-library@1.6.1
