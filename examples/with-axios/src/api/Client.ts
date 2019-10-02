import { createClient } from 'react-fetching-library';
import axios from 'axios';

import { requestHostInterceptor } from './requestInterceptors/requestHostInterceptor';
import { buildAxiosFetch } from './buildAxiosFetch';

// In real application this const will be stored in ENV's
const HOST = 'https://private-34f3a-reactapiclient.apiary-mock.com';

const axiosInstance = axios.create({
  timeout: 10000,
});

export const Client = createClient({
  requestInterceptors: [requestHostInterceptor(HOST)],
  fetch: buildAxiosFetch(axiosInstance),
});
