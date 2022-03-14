import { CacheStore } from '../../../src/store/CacheStore';
import { Action } from '../../../src/client/client.types';

describe('cache', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

  const cache = new CacheStore();

  const testAction: Action = { method: 'GET', endpoint: '/foo' };

  it('allows to add entry to cache storage', async () => {
    cache.setResponse(testAction, { error: false });
    expect(Object.values(cache.getValue()).length).toEqual(1);
  });

  it('allows to get entry from cache', async () => {
    cache.setResponse(testAction, { payload: '/foo', error: false });
    expect(cache.getResponse(testAction)).toEqual({ payload: '/foo',  error: false });
  });

  it('allows to remove entry from cache', async () => {
    cache.setResponse(testAction, { payload: '/foo', error: false });
    cache.removeResponse(testAction);
    expect(Object.values(cache.getValue()).length).toEqual(0);
  });

  it('allows to set cache items', async () => {
    cache.setResponse(testAction, { payload: '/foo', error: false });
    expect(Object.values(cache.getValue()).length).toEqual(1);
    cache.setValue({});
    expect(Object.values(cache.getValue()).length).toEqual(0);
  });

  it('allows to update payload of cache item', async () => {
    cache.setResponse(testAction, { payload: '/foo', error: false });
    expect(cache.getPayload(testAction)).toEqual('/foo');
    cache.updatePayload(testAction, '/baz');
    expect(cache.getPayload(testAction)).toEqual('/baz');
  })
});