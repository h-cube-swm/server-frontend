export default function addDefault(state, setState, defualts) {
  if (!setState) return false;
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
  return shouldUpdate;
}