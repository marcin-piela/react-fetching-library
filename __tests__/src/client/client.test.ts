import fetchMock from 'fetch-mock';

import { createClient } from '../../../src/client/client';
import { Action, QueryResponse } from '../../../src/client/client.types';

describe('Client test', () => {
  it('responses with queryResponse object on success fetch', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users',
    };

    fetchMock.get(action.endpoint, {
      users: [],
    });

    const client = createClient();

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ users: [] });
    expect(queryResponse.status).toEqual(200);
    expect(queryResponse.error).toEqual(false);
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('12');
  });

  it('responses correctly for empty API response', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/204',
    };

    fetchMock.get(action.endpoint, async () => '');

    const client = createClient({});

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual('');
    expect(queryResponse.status).toEqual(200);
    expect(queryResponse.error).toEqual(false);
  });

  it('responses with queryResponse object containing error flag true on failed fetch', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users/error',
    };

    fetchMock.get(action.endpoint, {
      throws: new TypeError('Failed to fetch'),
    });

    const client = createClient({});

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual(undefined);
    expect(queryResponse.status).toEqual(undefined);
    expect(queryResponse.error).toEqual(true);
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('12');
  });

  it('intercepts response when responseInterceptor is configured', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users/response-interceptors',
    };

    fetchMock.get(action.endpoint, {
      data: {
        users: [],
      },
    });

    const responseInterceptor = () => async (action: Action, response: QueryResponse<any>) => {
      if (response.payload.data) {
        return {
          ...response,
          payload: response.payload.data,
        };
      }

      return response;
    };

    const client = createClient({
      responseInterceptors: [responseInterceptor],
    });

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ users: [] });
  });

  it('intercepts request when requestInterceptor is configured', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'request-interceptors',
    };

    fetchMock.get('http://example.com/users/request-interceptors', {
      users: [],
    });

    const requestInterceptor = () => async (action: Action) => {
      return {
        ...action,
        endpoint: `http://example.com/users/${action.endpoint}`,
      };
    };

    const client = createClient({
      requestInterceptors: [requestInterceptor],
    });

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ users: [] });
  });

  it('returns cached value on second fetch', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/cached-endpoint',
    };

    fetchMock.get(
      action.endpoint,
      {
        users: [],
      },
      { overwriteRoutes: true },
    );

    const client = createClient();

    const queryResponse = await client.query(action);
    expect(queryResponse.payload).toEqual({ users: [] });

    fetchMock.get(
      action.endpoint,
      {
        users: [
          {
            uuid: 1,
          },
        ],
      },
      { overwriteRoutes: true },
    );

    const cachedQueryResponse = await client.query(action);
    expect(cachedQueryResponse.payload).toEqual({ users: [] });
  });

  it('responses with correct payload for default content type', async () => {
    const action: Action = {
      method: 'POST',
      endpoint: 'http://example.com/user/json',
      body: { name: 'User Name' },
    };

    fetchMock.post(action.endpoint, action.body);

    const client = createClient();

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ name: 'User Name' });
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('20');
  });

  it('responses with corect payload for custom content type', async () => {
    const action: Action = {
      method: 'POST',
      endpoint: 'http://example.com/user/text',
      headers: { 'Content-Type': 'text/plain' },
      body: 'User Name',
    };

    fetchMock.post(action.endpoint, { headers: action.headers, body: action.body });

    const client = createClient({});

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual('User Name');
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('9');
  });

  it('skips content-type for FormData body', async () => {
    const body = new FormData();
    body.append('key', 'test');

    const action: Action = {
      method: 'POST',
      endpoint: 'http://example.com/user/file',
      body,
    };

    const mock = fetchMock.post(action.endpoint, { body: action.body });

    const client = createClient({});

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({});
    expect(fetchMock.called())
    expect(mock.called(action.endpoint, { headers: {} })).toEqual(true);
  });

  it('resolve a response correctly to a blob', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/user/blob',
      responseType: 'blob',
    };

    fetchMock.get(action.endpoint, async () => 'example');

    const client = createClient({});

    const queryResponse = await client.query<Blob>(action);

    if (queryResponse && queryResponse.payload) {
      expect(queryResponse.payload.constructor.name).toEqual('Blob');
    } else {
      throw Error('Something went wrong resolving the response to a blob')
    }

  });
});
