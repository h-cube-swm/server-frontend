import { useEffect, useState } from "react";

export default function useDefault(setState, defaults) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {

    if (initialized) return;
    if (!setState) {
      setInitialized(true);
      return;
    }

    setState(state => {
      if (typeof state === 'object') {
        return { ...defaults, ...state };
      } else if (typeof state !== typeof defaults) {
        return defaults;
      } else {
        return state;
      }
    });

    setInitialized(true);
  }, [setState, initialized]);
  return initialized;
}