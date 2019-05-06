import { createClient } from 'react-fetching-library';
import { cache } from './cache';

const client = createClient({
  cacheProvider: cache,
});

export default client;
