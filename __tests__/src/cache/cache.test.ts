import { createCache } from '../../../src/cache/cache';

describe('cache', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

  const cache = createCache(
    () => {
      return true;
    },
    () => {
      return true;
    },
  );

  const testAction = { method: 'GET', endpoint: '/foo' };

  it('allows to add entry to cache storage', async () => {
    cache.add(testAction, { data: '/foo' });
    expect(Object.values(cache.getItems()).length).toEqual(1);
  });

  it('allows to get entry from cache', async () => {
    cache.add(testAction, { data: '/foo' });
    expect(cache.get(testAction)).toEqual({ data: '/foo', timestamp: 1479427200000 });
  });

  it('allows to remove entry from cache', async () => {
    cache.add(testAction, { data: '/foo' });
    cache.remove(testAction);
    expect(Object.values(cache.getItems()).length).toEqual(0);
  });

  it('allows to set cache items', async () => {
    cache.add(testAction, { data: '/foo' });
    expect(Object.values(cache.getItems()).length).toEqual(1);
    cache.setItems({});
    expect(Object.values(cache.getItems()).length).toEqual(0);
  });

  it('allows to specify cache options', async () => {
    const cacheWithOptions = createCache(
      action => {
        // Cache only NOT GET methods
        return action.method !== 'GET';
      },
      () => {
        // Set all entries as not valid
        return false;
      },
    );

    const cacheableAction = { method: 'POST', endpoint: '/bar' };

    cacheWithOptions.add(testAction, { data: '/foo' });
    expect(cacheWithOptions.get(testAction)).toEqual(undefined);

    cacheWithOptions.add(cacheableAction, { data: '/bar' });
    expect(cacheWithOptions.get(cacheableAction)).toEqual(undefined);
  });
});
