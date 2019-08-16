import { createClient, requestJsonInterceptor, responseJsonInterceptor } from 'fetching-library';

import { requestHostInterceptor } from './requestInterceptors/requestHostInterceptor';

// In real application this const will be stored in ENV's
const HOST = 'https://private-34f3a-reactapiclient.apiary-mock.com';

export const Client = createClient({
  requestInterceptors: [requestHostInterceptor(HOST), requestJsonInterceptor, responseJsonInterceptor],
  responseInterceptors: [responseJsonInterceptor],
});
