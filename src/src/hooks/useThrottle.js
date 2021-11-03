import { useEffect, useRef, useState } from "react";

export default function useThrottle(callback, dependencies, timeout = 1000) {
  const timeoutHandle = useRef(0);
  useEffect(() => {
    const handle = setTimeout(() => {
      if (timeoutHandle.current !== handle) return;
      callback();
    }, timeout);
    timeoutHandle.current = handle;
  }, dependencies);
}

export function useThrottleWithTimeout(callback, timeout = 1000) {
  const timeoutHandle = useRef(0);
  const [isFirst, setIsFirst] = useState(true);

  function onEvent() {
    const previous = timeoutHandle.current;

    if (previous) {
      return;
    }
    if (isFirst) {
      callback();
      setIsFirst(false);
    }

    const handle = setTimeout(() => {
      if (timeoutHandle.current === handle) {
        callback();
      }
      timeoutHandle.current = 0;
    }, timeout);

    timeoutHandle.current = handle;
  }

  return onEvent;
}
