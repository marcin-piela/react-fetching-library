import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Action, QueryResponse, UseBaseQuery } from '../../client/client.types';
import { QueryError } from '../../client/errors/QueryError';
import { ClientContext } from '../../context/clientContext/clientContext';
import { RESET, RESET_LOADING, SET_LOADING, SET_RESPONSE } from '../../reducers/responseReducer';

type ActionCreator<S, R, T> = (action: S) => Action<T, R>;

export const useBaseQuery = <T = any, R = {}, S = any>(
  actionCreator: ActionCreator<S, R, T>,
  state: any,
  dispatch: any,
  resourceName?: string,
): UseBaseQuery<S, T> => {
  const clientContext = useContext(ClientContext);
  const isMounted = useRef(true);
  const controller = useRef<AbortController | null>();

  useEffect(() => {
    if (resourceName) {
      const unsubscribeRefresh = clientContext.observable.subscribe(resourceName, { type: 'refresh' }, () => {
        handleQuery({} as S);
      });

      const unsubscribeUpdate = clientContext.observable.subscribe(
        resourceName,
        { type: 'update' },
        (publishAction, data) => {
          switch (publishAction.strategy) {
            case 'add-end':
              {
                dispatch({
                  type: SET_RESPONSE,
                  response: {
                    ...state.response,
                    payload: ([...(state.response.payload as any), data] as unknown) as T,
                  },
                });
              }
              break;
            case 'add-start':
              {
                dispatch({
                  type: SET_RESPONSE,
                  response: {
                    ...state.response,
                    payload: ([data, ...(state.response.payload as any)] as unknown) as T,
                  },
                });
              }
              break;
            case 'replace': {
              dispatch({
                type: SET_RESPONSE,
                response: {
                  ...state.response,
                  payload: data as T,
                },
              });
            }
          }
        },
      );

      return () => {
        unsubscribeRefresh();
        unsubscribeUpdate();
      };
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      handleAbort();
    };
  }, []);

  const handleQuery = useCallback(
    async (...params: Parameters<typeof actionCreator>) => {
      if (!isMounted.current) {
        return { error: false } as QueryResponse<T>;
      }

      const action = actionCreator(...params);
      const abortController = 'AbortController' in window ? new AbortController() : undefined;
      const signal = action.signal || (abortController ? abortController.signal : undefined);

      if (controller.current) {
        controller.current.abort();
      }

      controller.current = abortController;

      dispatch({ type: SET_LOADING });

      const queryResponse = await clientContext.query<T>({ ...action, signal: action.signal || signal }, true);

      if (isMounted.current && !(queryResponse.errorObject && queryResponse.errorObject.name === 'AbortError')) {
        dispatch({ type: SET_RESPONSE, response: queryResponse });
      }

      if (
        isMounted.current &&
        (queryResponse.errorObject && queryResponse.errorObject.name === 'AbortError') &&
        controller.current &&
        controller.current === abortController
      ) {
        controller.current = undefined;
        dispatch({ type: RESET_LOADING });
      }

      return queryResponse;
    },
    [actionCreator],
  );

  const handleAbort = useCallback(() => {
    if (controller.current) {
      controller.current.abort();
    }
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: RESET });
  }, []);

  if (state.response && state.response.errorObject && state.response.errorObject instanceof QueryError) {
    throw state.response.errorObject;
  }

  return {
    abort: handleAbort,
    loading: state.loading,
    query: handleQuery,
    reset: handleReset,
    ...state.response,
  };
};
