import React, { Suspense } from 'react';
import { render, waitForElement } from 'react-testing-library';

import { SuspenseQuery } from '../../../../src/components/suspenseQuery/SuspenseQuery';
import { Action, QueryResponse } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContextProvider';

describe('SuspenseQuery test', () => {
  const action: Action = {
    method: 'GET',
    endpoint: 'foo',
  };

  const fetchFunction: () => Promise<QueryResponse> = jest.fn(async () => {
    await new Promise(res => setTimeout(res, 1000));

    return {
      error: false,
      status: 200,
      payload: {
        foo: 'bar',
      },
    };
  });

  const client = {
    query: fetchFunction,
  };

  const wrapper = ({ children }: any) => (
    <Suspense fallback={'loading'}>
      <ClientContextProvider client={client}>{children}</ClientContextProvider>
    </Suspense>
  );

  it('shows fallback during fetch and then returns proper data on success', async () => {
    const children = jest.fn(() => 'loaded');

    const { unmount, getByText } = render(<SuspenseQuery action={action}>{children}</SuspenseQuery>, {
      wrapper: wrapper,
    });

    await waitForElement(() => getByText('loading'));

    expect(fetchFunction).toHaveBeenCalledTimes(1);

    await waitForElement(() => getByText('loaded'));

    expect(children).toHaveBeenCalledWith({ error: false, payload: { foo: 'bar' }, status: 200 });

    unmount();
  });
});
