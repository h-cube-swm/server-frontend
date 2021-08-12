import { useEffect, useState } from "react";

/*

어떻게 하면 useDefault를 효율적으로 만들 수 있을까?
이 작업의 궁극적인 목표는 uninitialized된 state를 initialize하는 것이다.

*/

function checkUpdateAndGetNew(state, defaults, initialized) {
  if (initialized) return [false, null];

  if (typeof state === 'object') {
    let shouldUpdate = false;
    for (const key in defaults) {
      if (!(key in state)) {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) {
      return [true, { ...defaults, ...state }];
    } else {
      return [false, null];
    }
  }

  if (typeof state !== typeof defaults) {
    return [true, defaults];
  }

  return [false, state];
}

export default function useDefault(state, setState, defaults) {

  const [initialized, setInitialized] = useState(false);

  // shouldUpdate is true when
  // 1. Initialized variable is not set (=false)
  // 2. State is not initialized.
  const [shouldUpdate, newState] = checkUpdateAndGetNew(state, defaults, initialized);

  useEffect(() => {
    if (!shouldUpdate) return;
    // If setState is not a function, it means that the state is not used.
    // Therefore, assume that it is initialized.
    if (setState) {
      setState(newState);
      setInitialized(true);
    }
  }, [shouldUpdate, setState, initialized]);

  if (!setState) return false;
  if (!shouldUpdate) return true;

  return initialized;
}