import * as RFC from 'react-fetching-library';

declare module 'react-fetching-library' {
  export interface Action<R = any, Ext = any> {
    // Only new params
    onDownloadProgress?: (progressEvent: any) => void;
  }
}
