const deepUpdate = (state, keys, newValue) => {
  if (keys.length === 0) {
    if (typeof newValue === "function") {
      return newValue(state);
    } else {
      return newValue;
    }
  } else {
    let copiedState = null;
    if (Array.isArray(state)) {
      copiedState = [...state];
    } else if (typeof state === "object") {
      copiedState = { ...state };
    } else {
      throw new Error("state[key] must be an array or an object.");
    }
    const [key, ...innerKeys] = keys;
    copiedState[key] = deepUpdate(state[key], innerKeys, newValue);
    return copiedState;
  }
};

const setNestedState = (setState, keys) => setState && ((value) => {
  if (!Array.isArray(keys)) throw new Error("Keys must be an array.");
  setState((state) => deepUpdate(state, keys, value));
});

export default setNestedState;