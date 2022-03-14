import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { Action, QueryResponse } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useBulkMutation } from '../../../../src/hooks/useBulkMutation/useBulkMutation';
import { CacheStore, SuspenseCacheStore } from '../../../../src/store';

describe('useBulkMutation test', () => {
  const actionCreator: any = jest.fn((endpoint: string): Action => ({
    endpoint,
    method: 'GET',
  }));

  const fetchFunction: (action: Action) => Promise<QueryResponse> = async (action) => ({
    error: false,
    payload: {
      foo: action.endpoint,
    },
    status: 200,
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
        state = useBulkMutation(actionCreator);
      },
      {
        wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(0);

    act(() => {
      state.mutate(['foo']);
    });

    expect(state.loading).toEqual(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(1);
    expect(state.responses[0].payload).toEqual({
      foo: 'foo',
    });

    act(() => {
      state.reset();
    });

    expect(state.responses).toHaveLength(0);
  });

  it('fetches multiple resources and returns proper data on success', async () => {
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
    expect(actionCreator).toHaveBeenCalledWith('foo');
    expect(actionCreator).toHaveBeenCalledWith('bar');

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(2);
    expect(state.responses[0].payload).toEqual({
      foo: 'foo',
    });
    expect(state.responses[1].payload).toEqual({
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
      cache: new CacheStore(),
      suspenseCache: new SuspenseCacheStore(),
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

  it('support manual abort', async () => {
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
      state.abort();
      state.mutate(['endpoint']);
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('endpoint');
    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(1);
  });

  it('works without AbortController', async () => {
    // @ts-ignore
    delete(window.AbortController);

    const localFetchFunction: () => Promise<QueryResponse> = async () => ({
      error: true,
      errorObject: {
        name: 'AbortError'
      }
    });

    const localClient = {
      query: localFetchFunction,
      cache: new CacheStore(),
      suspenseCache: new SuspenseCacheStore(),
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
      state.mutate(['endpoint']);
      state.mutate(['endpoint']);
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('endpoint');
    expect(state.loading).toEqual(false);
  });

  it('may return errors and success responses', async () => {

    const localFetchFunction: (action: Action) => Promise<QueryResponse> = async (action) => {
      if (action.endpoint === 'error') {
        return {
          error: true,
          errorObject: {
            name: 'Some error'
          }
        }
      }

      return {
        error: false,
        payload: {
          foo: action.endpoint,
        },
        status: 200,
      };
    };

    const localClient = {
      query: localFetchFunction,
      cache: new CacheStore(),
      suspenseCache: new SuspenseCacheStore(),
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
      state.mutate(['foo', 'error', 'bar']);
      jest.runAllTimers();
    });

    expect(actionCreator).toHaveBeenCalledWith('foo');
    expect(actionCreator).toHaveBeenCalledWith('error');
    expect(actionCreator).toHaveBeenCalledWith('bar');
    expect(state.loading).toEqual(false);
    expect(state.responses).toHaveLength(3);
    expect(state.responses[0].error).toEqual(false);
    expect(state.responses[1].error).toEqual(true);
    expect(state.responses[2].error).toEqual(false);
  });
});
