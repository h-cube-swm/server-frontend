import { useRef } from "react";

export default function useThrottle(callback) {
  const timeoutHandle = useRef(0);

  function onEvent() {
    const handle = setTimeout(() => {
      if (timeoutHandle.current === handle) {
        callback();
      }
    }, 1000);

    timeoutHandle.current = handle;
  }

  return onEvent;
}