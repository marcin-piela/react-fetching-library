import React from 'react';
import { render, waitForElement, fireEvent, act } from 'react-testing-library';
import fetchMock from 'fetch-mock';

import { createClient } from '../../../../src/client/client';
import { QueryErrorBoundary } from '../../../../src/components/queryErrorBoundary/QueryErrorBoundary';
import { Query } from '../../../../src/components/query/Query';
import { Mutation } from '../../../../src/components/mutation/Mutation';
import { Action } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContextProvider';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('queryErrorBoundary test', () => {
  const action: Action = {
    method: 'GET',
    endpoint: 'foo',
    config: {
      emitErrorForStatuses: [200],
    },
  };

  fetchMock.get(action.endpoint, {
    users: [],
  });

  const client = createClient({});

  const wrapper = ({ children }: any) => <ClientContextProvider client={client}>{children}</ClientContextProvider>;

  it('caught error and displays fallback for useQuery', async () => {
    const children = jest.fn(({ loading }) => (loading ? 'loading' : 'loaded'));
    const fallback = jest.fn((response, restart) => (
      <span data-testid="restart" onClick={restart}>
        fallback
      </span>
    ));

    const { getByText } = render(
      <QueryErrorBoundary statuses={[200]} fallback={fallback}>
        <Query action={action}>{children}</Query>
      </QueryErrorBoundary>,
      {
        wrapper: wrapper,
      },
    );

    await waitForElement(() => getByText('fallback'));
    expect(getByText('fallback')).toBeTruthy();

    // Check restart function
    fireEvent.click(getByText('fallback'));
    expect(getByText('loading')).toBeTruthy();
  });

  it('caught error and displays fallback for useMutation', async () => {
    const children = jest.fn(({ mutate, loading }) => (loading ? 'loading' : <span data-testid="mutate" onClick={mutate}>Mutate</span>));
    const fallback = jest.fn((response, restart) => (
      <span test-id="restart" onClick={restart}>
        fallback
      </span>
    ));

    const { getByText, getByTestId } = render(
      <QueryErrorBoundary statuses={[200]} fallback={fallback}>
        <Mutation actionCreator={() => action}>{children}</Mutation>
      </QueryErrorBoundary>,
      {
        wrapper: wrapper,
      },
    );

    act(() => {
      fireEvent.click(getByTestId('mutate'));
    })

    expect(getByText('loading')).toBeTruthy();

    await waitForElement(() => getByText('fallback'));
    expect(getByText('fallback')).toBeTruthy();

    // Check restart function
    fireEvent.click(getByText('fallback'));
    expect(getByText('loading')).toBeTruthy();
  });
});
