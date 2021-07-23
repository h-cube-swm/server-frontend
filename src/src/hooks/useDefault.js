import React, { useEffect, useState } from "react";

export default function useDefault(state, setState, defualts) {
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (!setState) {
      console.error("State must be provided when use useDefault hook.");
      /* 여기 적어도 알러트나 에러가 들어가야 함! */
      setShouldUpdate(false);
      return;
    }
    let shouldUpdate = false;
    const newAttributes = {};
    Object.entries(defualts).forEach(([key, value]) => {
      if (!(key in state)) {
        shouldUpdate = true;
        newAttributes[key] = value;
      }
    });
    if (shouldUpdate) {
      setState(state => ({ ...state, ...newAttributes }));
    }
    setShouldUpdate(shouldUpdate);
  }, [state, setState]);
  return !shouldUpdate;
}