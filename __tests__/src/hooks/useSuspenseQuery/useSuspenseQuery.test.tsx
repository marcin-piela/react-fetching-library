import { fireEvent, getByTestId, render, waitForDomChange, waitForElement } from '@testing-library/react';
import React, { Suspense, useState } from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { CacheStore, SuspenseCacheStore } from '../../../../src/store';
import { Action, QueryResponse } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useSuspenseQuery } from '../../../../src/hooks/useSuspenseQuery/useSuspenseQuery';

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
    cache: new CacheStore(),
    suspenseCache: new SuspenseCacheStore(),
  };

  const wrapper = ({ children }: any) => (
    <Suspense fallback={'loading'}>
      <ClientContextProvider client={client}>{children}</ClientContextProvider>
    </Suspense>
  );

  it('shows fallback during fetch and then return proper data on success', async () => {
    let state: any = {};

    const { unmount, waitForNextUpdate, rerender } = renderHook(
      () => {
        state = useSuspenseQuery(action);
      },
      {
        wrapper,
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

  it('clear updated action from cache', async () => {
    const cache = new SuspenseCacheStore();
    const remove = jest.fn();

    const secondAction: Action = {
      method: 'GET',
      endpoint: 'bar',
    }

    cache.add(secondAction, {
      fetch: jest.fn(),
      response: {
        error: false,
      },
    })

    const client = {
      query: fetchFunction,
      cache: new CacheStore(),
      suspenseCache: {
        ...cache,
        remove,
      },
    };

    const testWrapper = ({ children }: any) => (
      <Suspense fallback={<span data-testid="loading">loading</span>}>
        <ClientContextProvider client={client}>{children}</ClientContextProvider>
      </Suspense>
    );

    const TestComponent = () => {
      const [currentAction, setCurrentAction] = useState(action);
      const { query } = useSuspenseQuery(currentAction);

      return <div>
        <button data-testid="change" onClick={() => setCurrentAction(secondAction)}>change</button>
        <button data-testid="reset" onClick={query}>reset</button>
      </div>;
    }

    const { unmount, getByTestId } = render(
      <TestComponent />,
      {
        wrapper: testWrapper,
      },
    );

    await waitForElement(() => getByTestId('reset'));

    act(() => {
      fireEvent.click(getByTestId('reset'));
      fireEvent.click(getByTestId('change'));
    })

    expect(remove).toHaveBeenCalledTimes(3);
    expect(remove).toHaveBeenCalledWith(action);
    expect(remove).toHaveBeenCalledWith(secondAction);

    unmount();
  });
});