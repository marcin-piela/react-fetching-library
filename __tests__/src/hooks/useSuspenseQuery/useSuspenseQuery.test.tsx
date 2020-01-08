import React, { Suspense } from 'react';
import { renderHook, act } from 'react-hooks-testing-library';

import { useSuspenseQuery } from '../../../../src/hooks/useSuspenseQuery/useSuspenseQuery';
import { Action, QueryResponse, SuspenseCacheItem } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { createCache } from '../../../../src/cache/cache';

describe('useSuspenseQuery test', () => {
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
    suspenseCache: createCache<SuspenseCacheItem>(() => true, () => true),
  };

  const wrapper = ({ children }: any) => (
    <Suspense fallback={'loading'}>
      <ClientContextProvider client={client}>{children}</ClientContextProvider>
    </Suspense>
  );

  it('shows fallback during fetch and then returs proper data on success', async () => {
    let state: any = {};

    const { unmount, waitForNextUpdate, rerender } = renderHook(
      () => {
        state = useSuspenseQuery(action);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.payload).toEqual(undefined);

    rerender();

    await waitForNextUpdate();

    expect(state.payload).toEqual({
      foo: 'bar',
    });

    expect(fetchFunction).toHaveBeenCalledTimes(1);

    act(() => {
      state.query();
    })
    
    rerender();

    expect(state.payload).toEqual({
      foo: 'bar',
    });

    expect(fetchFunction).toHaveBeenCalledTimes(2);

    unmount();
  });
});
