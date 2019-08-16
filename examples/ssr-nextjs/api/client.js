import { createClient, requestJsonInterceptor, responseJsonInterceptor } from 'fetching-library';
import { cache } from './cache';

const client = createClient({
  requestInterceptors: [requestJsonInterceptor, responseJsonInterceptor],
  responseInterceptors: [responseJsonInterceptor],
  cacheProvider: cache,
});

export default client;
