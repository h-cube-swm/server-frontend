import { useEffect, useState } from "react";

/**
 * Return True if two objects are identical
 */
function deepComp(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (JSON.stringify(a) !== JSON.stringify(b)) return false;
  return true;
}

export default function useOnly(callback, dependencies) {
  const [state, setState] = useState(null);
  useEffect(() => {
    // If nothing changed, return false
    if (deepComp(state, dependencies)) return;
    setState(dependencies);
    callback();
  }, [callback, state, setState, dependencies]);
}
