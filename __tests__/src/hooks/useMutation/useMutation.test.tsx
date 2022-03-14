import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { Action, QueryResponse } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useMutation } from '../../../../src/hooks/useMutation/useMutation';
import { CacheStore, SuspenseCacheStore } from '../../../../src/store';

describe('useMutation test', () => {
  const actionCreator: any = jest.fn((endpoint: string) => ({
    method: 'GET',
    endpoint,
  }));

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
        state = useMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.mutate();
    });

    expect(state.loading).toEqual(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
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
        state = useMutation(actionCreator);
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
      state.mutate('endpoint');
      jest.runAllTimers();
    });

    expect(actionCreator).not.toHaveBeenCalledWith('endpoint');

    expect(state.loading).toEqual(false);
  });

  it('skips changing state after unmount during fetch', async () => {
    jest.useFakeTimers();

    let state: any = {};

    const { unmount } = renderHook(
      () => {
        state = useMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.mutate('endpoint');
      unmount();
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('endpoint');

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
        state = useMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.mutate('endpoint');
      state.mutate('endpoint');
      state.mutate('endpoint');
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('endpoint');

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
        state = useMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.mutate('endpoint');
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('endpoint');
    expect(state.loading).toEqual(false);
  });

  it('updates mutate function with new client', async () => {
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
        return useMutation(props);
      },
      {
        wrapper: localWrapper,
        initialProps: actionCreator
      },
    );

    const prevMutate = hookResults.result.current.mutate;
    hookResults.rerender(actionCreator);

    expect(hookResults.result.current.mutate).toBe(prevMutate);

    // Update client
    localClientUsed = localClient2;
    hookResults.rerender(actionCreator);
    expect(hookResults.result.current.mutate).not.toBe(prevMutate);

  });
});
