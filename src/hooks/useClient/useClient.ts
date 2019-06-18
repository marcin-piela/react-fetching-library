import { useContext } from 'react';

import { ClientContext } from '../../context/clientContext/clientContext';

export const useClient = () => {
  return useContext(ClientContext);
};
