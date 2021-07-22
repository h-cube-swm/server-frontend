import React from "react";

export default function CheckField({
  checked,
  setChecked,
  disabled,
  ...props
}) {
  return (
    <input
      {...props}
      type="checkbox"
      value={checked}
      onChange={setChecked && ((e) => setChecked(e.target.value))}
      disabled={disabled || !setChecked}
    />
  );
}
