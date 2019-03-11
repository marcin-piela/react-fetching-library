import { useEffect, useState } from 'react';

export const useInitializeEffect = (onInit: () => void) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      onInit();
      setInitialized(true);
    }
  });
};
