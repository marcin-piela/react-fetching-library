import axios, { AxiosInstance, Method } from 'axios';
import { Action } from 'react-fetching-library';

export const buildAxiosFetch =
  (axiosInstance: AxiosInstance) => async (init: RequestInfo, options?: Partial<Action> & RequestInit) => {
    const cancelSource = axios.CancelToken.source();

    const config = {
      ...options,
      responseType: options && options.responseType ? (options.responseType.toLocaleLowerCase() as any) : undefined,
      url: init as string,
      method: (options && options.method ? options.method : 'GET') as Method,
      data: options && options.body ? options.body : undefined,
      headers:
        options && options.headers
          ? Object.keys(options.headers).reduce((destination, key) => {
              // @ts-ignore
              destination[key.toLowerCase()] = options.headers[key];
              return destination;
            }, {})
          : undefined,
      validateStatus: () => true,
      cancelToken: cancelSource.token,
    };

    if (options && options.signal) {
      options.signal.onabort = () => {
        cancelSource.cancel('Operation canceled from hook');
      };
    }

    const result = await axiosInstance.request(config);
    const headers = new Headers();

    Object.entries(result.headers).forEach(function ([key, value]) {
      headers.append(key, value as string);
    });

    return new Response(result.data, {
      status: result.status,
      statusText: result.statusText,
      headers,
    });
  };
