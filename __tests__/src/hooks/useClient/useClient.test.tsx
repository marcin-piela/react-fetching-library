import React from 'react';
import { renderHook } from 'react-hooks-testing-library';

import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { useClient } from '../../../../src/hooks/useClient/useClient';

describe('useClient test', () => {
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
        wrapper,
      },
    );

    expect(clientFromHook).toEqual(client);
  });
});
