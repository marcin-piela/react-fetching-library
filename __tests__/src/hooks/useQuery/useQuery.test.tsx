import fetchMock from 'fetch-mock';
import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { createClient } from '../../../../src/client/client';
import { Action, QueryResponse } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useQuery } from '../../../../src/hooks/useQuery/useQuery';
import { CacheStore, SuspenseCacheStore } from '../../../../src/store';

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
    cache: new CacheStore(),
    suspenseCache: new SuspenseCacheStore(),
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
        wrapper,
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
        state = useQuery(action, { initFetch: false });
      },
      {
        wrapper,
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
        state = useQuery(action, { initFetch: false });
      },
      {
        wrapper,
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
        state = useQuery(action, { initFetch: false });
      },
      {
        wrapper,
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
        state = useQuery(action, { initFetch: false });
      },
      {
        wrapper,
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
      cache: new CacheStore(),
      suspenseCache: new SuspenseCacheStore(),
    };

    const wrapper = ({ children }: any) => <ClientContextProvider client={client}>{children}</ClientContextProvider>;

    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useQuery(action, { initFetch: false });
      },
      {
        wrapper,
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

  it('resets payload when re-rendered with changed query', async () => {
    const anotherAction: Action = {
      method: 'GET',
      endpoint: 'bar',
    };

    fetchMock.get(action.endpoint, { foo: 'bar' });
    fetchMock.get(anotherAction.endpoint, { bar: 'baz' });

    const localClient = createClient();

    const localWrapper = ({ children }: any) => (
      <ClientContextProvider client={localClient}>{children}</ClientContextProvider>
    );

    const { rerender, result, waitForNextUpdate } = renderHook(useQuery, {
      wrapper: localWrapper,
      initialProps: action,
    });
    expect(result.current.payload).toBe(undefined);

    await waitForNextUpdate();
    expect(result.current.payload).toStrictEqual({ foo: 'bar' });

    rerender(anotherAction);
    expect(result.current.payload).toStrictEqual({ foo: 'bar' });

    await waitForNextUpdate();
    expect(result.current.payload).toStrictEqual({ bar: 'baz' });

    rerender(action);
    expect(result.current.payload).toStrictEqual({ foo: 'bar' });

    rerender(anotherAction);
    expect(result.current.payload).toStrictEqual({ bar: 'baz' });
  });

  it('updates query function with new client', async () => {
    const abort = jest.fn();
    const abortController = jest.fn(() => ({ abort }));
    Object.defineProperty(window, 'AbortController', { value: abortController, writable: true });

    const localFetchFunction1: () => Promise<QueryResponse> = async () => ({
      error: true,
      errorObject: {
        name: 'AbortError'
      }
    });

    const localFetchFunction2: () => Promise<QueryResponse> = async () => ({
      error: true,
      errorObject: {
        name: 'AbortError'
      }
    });

    const localClient1 = {
      query: localFetchFunction1,
      cache: new CacheStore(),
      suspenseCache: new SuspenseCacheStore(),
    };

    const localClient2 = {
      query: localFetchFunction2,
      cache: new CacheStore(),
      suspenseCache: new SuspenseCacheStore(),
    };

    let localClientUsed = localClient1;

    const localWrapper = ({ children }: any) => <ClientContextProvider client={ localClientUsed }>{ children }</ClientContextProvider>;

    jest.useFakeTimers();

    const hookResults = renderHook<any, any>(
      (props) => {
        return useQuery(props);
      },
      {
        wrapper: localWrapper,
        initialProps: action
      },
    );

    const prevQuery = hookResults.result.current.query;
    hookResults.rerender(action);

    expect(hookResults.result.current.query).toBe(prevQuery);

    // Update client
    localClientUsed = localClient2;
    hookResults.rerender(action);
    expect(hookResults.result.current.query).not.toBe(prevQuery);

  });
});
