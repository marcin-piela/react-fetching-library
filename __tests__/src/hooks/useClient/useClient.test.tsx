import React from 'react';
import { renderHook } from 'react-hooks-testing-library';

import { Action } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContextProvider';
import { useClient } from '../../../../src/hooks/useClient/useClient';

describe('useClient test', () => {
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

  it('returns client from context', async () => {
    let clientFromHook: any = {};

    renderHook(
      () => {
        clientFromHook = useClient();
      },
      {
        wrapper: wrapper,
      },
    );

    expect(clientFromHook).toEqual(client);
  });
});
