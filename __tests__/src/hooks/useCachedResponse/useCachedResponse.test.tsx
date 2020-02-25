import React from 'react';
import { renderHook } from 'react-hooks-testing-library';

import { Action } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useCachedResponse } from '../../../../src/hooks/useCachedResponse/useCachedResponse';

describe('useQuery test', () => {
  const action: Action = {
    method: 'GET',
    endpoint: 'foo',
  };

  const client: any = {
    cache: {
      get: () => ({
        payload: {
          foo: 'bar',
        },
      }),
    },
  };

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
