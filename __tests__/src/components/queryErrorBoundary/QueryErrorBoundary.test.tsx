import { act, fireEvent, render, waitForElement } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';

import { createClient } from '../../../../src/client/client';
import { Action } from '../../../../src/client/client.types';
import { Mutation } from '../../../../src/components/mutation/Mutation';
import { Query } from '../../../../src/components/query/Query';
import { QueryErrorBoundary } from '../../../../src/components/queryErrorBoundary/QueryErrorBoundary';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';

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

  it('catches error and displays fallback for useQuery', async () => {
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
        wrapper,
      },
    );

    await waitForElement(() => getByText('fallback'));
    expect(getByText('fallback')).toBeTruthy();

    // Check restart function
    fireEvent.click(getByText('fallback'));
    expect(getByText('loading')).toBeTruthy();
  });

  it('catches error and displays fallback for useMutation', async () => {
    const { getByText, getByTestId } = render(
      <QueryErrorBoundary
        statuses={[200]}
        fallback={(response, restart) => (
          <span data-test-id="restart" onClick={restart}>
            fallback
          </span>
        )}
      >
        <Mutation actionCreator={() => action}>
          {({ mutate, loading }) =>
            loading ? (
              'loading'
            ) : (
              <span data-testid="mutate" onClick={mutate}>
                mutate
              </span>
            )
          }
        </Mutation>
      </QueryErrorBoundary>,
      {
        wrapper,
      },
    );

    act(() => {
      fireEvent.click(getByTestId('mutate'));
    });

    await waitForElement(() => getByText('loading'));
    await waitForElement(() => getByText('fallback'));

    // Check restart function
    fireEvent.click(getByText('fallback'));
    await waitForElement(() => getByText('mutate'));
  });
});