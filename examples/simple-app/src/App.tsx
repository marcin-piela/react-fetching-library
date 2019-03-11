import React, { Component, useState } from 'react';

import {
  Client,
  RequestInterceptor,
  ResponseInterceptor,
  Action,
  ClientContextProvider,
  useQuery,
  usePaginatedQuery,
  Query,
} from 'react-fetching-library';

type ActionExtension = {
  api?: string;
};

const requestMiddleware: RequestInterceptor = () => async action => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return action;
};

const responseMiddleware: ResponseInterceptor = () => async (action, response) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return response;
};

const client = Client({
  requestInterceptors: [requestMiddleware],
  responseInterceptors: [responseMiddleware],
});

type ApiResponse = {
  question: string;
};

const exampleAction = (): Action<ActionExtension> => ({
  method: 'GET',
  endpoint: 'http://private-34f3a-reactapiclient.apiary-mock.com/questions',
  api: 'test',
});

const examplePaginatedQuery = (page: number): Action<ActionExtension> => {
  return {
    method: 'GET',
    endpoint: 'http://private-34f3a-reactapiclient.apiary-mock.com/questions/' + page,
    api: 'test',
  };
};

const TestComponent = () => {
  const { response, error, loading } = useQuery<ApiResponse, ActionExtension>(exampleAction());
  const { fetch, response: paginatedResponse } = usePaginatedQuery<ApiResponse, ActionExtension>(
    examplePaginatedQuery,
    [1],
  );
  const [page, setPage] = useState(1);

  return (
    <span>
      {error && 'error'}
      {loading && 'loading'}
      {response && 'response'}

      {paginatedResponse && paginatedResponse.length}

      <button
        onClick={() => {
          fetch([page + 1]);
          setPage(page + 1);
        }}
      >
        Test
      </button>

      <Query<ApiResponse, ActionExtension> action={exampleAction()} initFetch={false}>
        {({ error, loading, response }) => (
          <span>
            {error && 'error'}
            {loading && 'loading'}
            {response && 'response'}
          </span>
        )}
      </Query>
    </span>
  );
};

class App extends Component {
  componentDidMount() {
    client.query<ApiResponse>(exampleAction()).then(response => {
      console.log(response);
      if (response.payload) {
        console.log(response.payload);
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ClientContextProvider client={client}>
            <TestComponent />
          </ClientContextProvider>
        </header>
      </div>
    );
  }
}

export default App;
