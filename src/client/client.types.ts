import { Action as BaseAction } from 'fetching-library';

export type Action<R = {}> = BaseAction<
  R & {
    config?: {
      emitErrorForStatuses?: number[];
    };
  }
>;
