import { useMutation } from '../../hooks';

import { MutationProps } from './Mutation.types';

export const Mutation = <T = any, R = any, S = any>({ actionCreator, children }: MutationProps<T, R, S>) => {
  const response = useMutation<T, R, S>(actionCreator);

  return children(response);
};
