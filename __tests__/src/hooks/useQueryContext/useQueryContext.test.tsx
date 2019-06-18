import React from 'react';
import { renderHook } from 'react-hooks-testing-library';

import { QueryContext } from '../../../../src/context/queryContext/queryContext';
import { useQueryContext } from '../../../../src/hooks/useQueryContext/useQueryContext';

describe('useQueryContext test', () => {
  const wrapper = ({ children }: any) => (
    <QueryContext.Provider
      value={{
        loading: false,
        query: async () => ({ error: false }),
        error: false,
      }}
    >
      {children}
    </QueryContext.Provider>
  );

  it('returns queryContext if defined', async () => {
    let contextFromHook: any = {};

    renderHook(
      () => {
        contextFromHook = useQueryContext();
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
      useQueryContext();
    });

    expect(result.error).toEqual(Error('useQueryContext must be used within a QueryContext.Provider'));
  });
});
