import { render, waitForElement } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React, { Suspense } from 'react';

import { createClient } from '../../../../src/client/client';
import { Action } from '../../../../src/client/client.types';
import { QueryErrorBoundary } from '../../../../src/components/queryErrorBoundary/QueryErrorBoundary';
import { SuspenseQuery } from '../../../../src/components/suspenseQuery/SuspenseQuery';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('SuspenseQuery test', () => {
  const action: Action = {
    method: 'GET',
    endpoint: 'foo',
  };

  fetchMock.get(action.endpoint, {
    foo: 'bar',
  });

  const actionWithError: Action = {
    method: 'GET',
    endpoint: 'foo1',
    config: {
      emitErrorForStatuses: [200],
    },
  };

  fetchMock.get(actionWithError.endpoint, {
      baz: 'bar',
  })

  const client = createClient({});

  const wrapper = ({ children }: any) => (
    <Suspense fallback={'loading'}>
      <ClientContextProvider client={client}>{children}</ClientContextProvider>
    </Suspense>
  );

  it('shows fallback during fetch and then returns proper data on success', async () => {
    const children = jest.fn(() => 'loaded');

    const { unmount, getByText } = render(<SuspenseQuery action={action}>{children}</SuspenseQuery>, {
      wrapper,
    });

    await waitForElement(() => getByText('loading'));

    await waitForElement(() => getByText('loaded'));

    expect(children).toHaveBeenCalledWith(expect.objectContaining({ payload: { foo: 'bar' } }));

    unmount();
  });

  it('shows fallback during fetch and then throws error when configured', async () => {
    const children = jest.fn(() => 'loaded');

    const fallback = jest.fn((response, restart) => (
      <span test-id="restart" onClick={restart}>
        fallback
      </span>
    ));

    const { unmount, getByText } = render(
      <QueryErrorBoundary statuses={[200]} fallback={fallback}>
        <SuspenseQuery action={actionWithError}>{children}</SuspenseQuery>
      </QueryErrorBoundary>,
      {
        wrapper,
      },
    );

    await waitForElement(() => getByText('loading'));

    await waitForElement(() => getByText('fallback'));
  });
});