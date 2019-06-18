import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { useQuery } from '../../../../src/hooks/useQuery/useQuery';
import { Action, QueryResponse } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';

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
});
