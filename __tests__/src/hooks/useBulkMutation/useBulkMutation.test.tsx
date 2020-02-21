import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { useBulkMutation } from '../../../../src/hooks/useBulkMutation/useBulkMutation';
import { Action, QueryResponse, SuspenseCacheItem } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { createCache } from '../../../../src/cache/cache';

describe('useMutation test', () => {
  const actionCreator: any = jest.fn((endpoint: string) => ({
    endpoint,
    method: 'GET',
  }));

  const fetchFunction: () => Promise<QueryResponse> = async () => ({
    error: false,
    payload: {
      foo: 'bar',
    },
    status: 200,
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
        state = useBulkMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(0);

    act(() => {
      state.mutate(['foo', 'bar']);
    });

    expect(state.loading).toEqual(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(2);
    expect(state.responses[0].payload).toEqual({
      foo: 'bar',
    });

    act(() => {
      state.reset();
    });

    expect(state.responses).toHaveLength(0);
  });

  it('skips changing state after unmount', async () => {
    jest.useFakeTimers();

    let state: any = {};

    const { unmount } = renderHook(
      () => {
        state = useBulkMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(0);

    await unmount();

    act(() => {
      state.mutate(['endpoint']);
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
        state = useBulkMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(0);

    act(() => {
      state.mutate(['endpoint']);
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
        state = useBulkMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(0);

    act(() => {
      state.mutate(['endpoint']);
      state.mutate(['endpoint']);
      state.mutate(['endpoint']);
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

    const localFetchFunction: () => Promise<QueryResponse> = async () => ({
      error: true,
      errorObject: {
        name: 'AbortError'
      }
    });

    const localClient = {
      query: localFetchFunction,
      suspenseCache: createCache<SuspenseCacheItem>(() => true, () => true),
    };

    const localWrapper = ({ children }: any) => <ClientContextProvider client={localClient}>{children}</ClientContextProvider>;

    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useBulkMutation(actionCreator);
      },
      {
        wrapper: localWrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(0);

    act(() => {
      state.mutate(['endpoint']);
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('endpoint');
    expect(state.loading).toEqual(false);
  });
});
