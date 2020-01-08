import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { useQuery } from '../../../../src/hooks/useQuery/useQuery';
import { Action, QueryResponse, SuspenseCacheItem } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { createCache } from '../../../../src/cache/cache';

describe('useQuery test', () => {
  const action: Action = {
    method: 'GET',
    endpoint: 'foo',
  };

  const fetchFunction: () => Promise<QueryResponse> = async () => ({
    error: false,
    status: 200,
    payload: {
      foo: 'bar',
    },
  });

  const client = {
    query: fetchFunction,
    suspenseCache: createCache<SuspenseCacheItem>(() => true, () => true),
  };

  const wrapper = ({ children }: any) => <ClientContextProvider client={client}>{children}</ClientContextProvider>;

  it('fetches resource and returns proper data on success', async () => {
    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useQuery(action);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(true);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);

    expect(state.payload).toEqual({
      foo: 'bar',
    });
  });

  it('fetches resource on demand and returns proper data on success', async () => {
    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useQuery(action, false);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);

    act(() => {
      state.query();
      jest.runAllTimers();
    });

    expect(state.payload).toEqual({
      foo: 'bar',
    });

    act(() => {
      state.reset();
    });

    expect(state.payload).toEqual(undefined);
  });

  it('skips changing state after unmount', async () => {
    jest.useFakeTimers();

    let state: any = {};

    const { unmount } = renderHook(
      () => {
        state = useQuery(action, false);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    await unmount();

    act(() => {
      state.query();
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
  });

  it('skips changing state after unmount during fetch', async () => {
    jest.useFakeTimers();

    let state: any = {};

    const { unmount } = renderHook(
      () => {
        state = useQuery(action, false);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.query();
      unmount();
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
  });

  it('aborts requests during race conditions', async () => {
    const abort = jest.fn();
    const abortController = jest.fn(() => ({ abort }));
    Object.defineProperty(window, 'AbortController', { value: abortController, writable: true });

    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useQuery(action, false);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.query();
      state.query();
      state.query();
      jest.runAllTimers();
    });

    expect(abortController).toHaveBeenCalledTimes(3); // count of creater abort controllers
    expect(abort).toHaveBeenCalledTimes(2); // count of aborted requests
  });

  it('resets loading and abort controller after abort', async () => {
    const abort = jest.fn();
    const abortController = jest.fn(() => ({ abort }));
    Object.defineProperty(window, 'AbortController', { value: abortController, writable: true });

    const fetchFunction: () => Promise<QueryResponse> = async () => ({
      error: true,
      errorObject: {
        name: 'AbortError'
      }
    });
  
    const client = {
      query: fetchFunction,
      suspenseCache: createCache<SuspenseCacheItem>(() => true, () => true),
    };
  
    const wrapper = ({ children }: any) => <ClientContextProvider client={client}>{children}</ClientContextProvider>;

    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useQuery(action, false);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.query();
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
  });
});
