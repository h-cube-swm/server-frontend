import { useEffect, useRef, useState } from "react";

export function useDebounce(callback, dependencies, timeout = 1000) {
  const timeoutHandle = useRef(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (timeoutHandle.current !== handle) return;
      callback();
    }, timeout);
    timeoutHandle.current = handle;
  }, dependencies);
}

export function useThrottle(callback, dependencies, timeout = 500) {
  const callbackRef = useRef(null);
  const isWaitingRef = useRef(null);

  useEffect(() => {
    if (isWaitingRef.current) {
      callbackRef.current = callback;
    } else {
      callback();
      isWaitingRef.current = true;
      setTimeout(() => {
        if (callbackRef.current) callbackRef.current();
        callbackRef.current = null;
        isWaitingRef.current = false;
      }, timeout);
    }
  }, dependencies);
}
