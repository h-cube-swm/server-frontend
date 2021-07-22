import React, { useEffect, useState } from "react";

export default function useDefault(state, setState, defualts) {
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (!setState) {
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