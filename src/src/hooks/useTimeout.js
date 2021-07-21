import { useEffect, useState } from 'react';

export default function useTimeout(timeout) {

  const [isInit, setIsInit] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setIsInit(false);
    }, timeout);
    return () => clearTimeout(handle);
  }, [timeout]);

  return isInit;
}
