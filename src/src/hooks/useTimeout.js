import { useEffect, useState } from 'react';

export default function useTimeout(timeout) {

  const [isFinished, setIsInit] = useState(timeout === 0);

  useEffect(() => {
    const handle = setTimeout(() => {
      setIsInit(true);
    }, timeout);
    return () => clearTimeout(handle);
  }, [timeout]);

  return isFinished;
}