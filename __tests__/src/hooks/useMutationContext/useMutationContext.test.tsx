import React from 'react';
import { renderHook } from 'react-hooks-testing-library';

import { MutationContext } from '../../../../src/context/mutationContext/mutationContext';
import { useMutationContext } from '../../../../src/hooks/useMutationContext/useMutationContext';

describe('useMutationContext test', () => {
  const wrapper = ({ children }: any) => (
    <MutationContext.Provider
      value={{
        loading: false,
        mutate: async () => ({ error: false }),
        error: false,
      }}
    >
      {children}
    </MutationContext.Provider>
  );

  it('returns mutationContext if defined', async () => {
    let contextFromHook: any = {};

    renderHook(
      () => {
        contextFromHook = useMutationContext();
      },
      {
        wrapper: wrapper,
      },
    );

    expect(contextFromHook.loading).toEqual(false);
    expect(contextFromHook.error).toEqual(false);
  });

  it('throws error when useQueryContext is not used within context provider', async () => {
    const { result } = renderHook(() => {
      useMutationContext();
    });

    expect(result.error).toEqual(Error('useMutationContext must be used within a MutationContext.Provider'));
  });
});
