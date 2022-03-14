import React from 'react';
import { renderHook } from 'react-hooks-testing-library';

import { Action } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useCachedResponse } from '../../../../src/hooks/useCachedResponse/useCachedResponse';
import { CacheStore } from '../../../../src/store';

describe('useQuery test', () => {
  const action: Action = {
    method: 'GET',
    endpoint: 'foo',
  };

  const cache = new CacheStore();

  cache.setResponse(action, { error: false, payload: { foo: 'bar' } })

  const client: any = { cache };

  const wrapper = ({ children }: any) => <ClientContextProvider client={client}>{children}</ClientContextProvider>;

  it('returns cached response', async () => {
    let state: any = {};

    renderHook(
      () => {
        state = useCachedResponse(action);
      },
      {
        wrapper,
      },
    );

    expect(state.payload).toEqual({
      foo: 'bar',
    });
  });
});
