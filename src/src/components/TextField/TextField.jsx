import React, { forwardRef } from "react";
import "./TextField.scss";

function TextField({ text, setText, disabled, size, ...props }, ref) {
  return (
    <input
      {...props}
      className={"txt-field " + size}
      type="text"
      value={text}
      onChange={setText ? (e) => setText(e.target.value) : () => {}}
      disabled={disabled || !setText}
      ref={ref}
    />
  );
}

export default forwardRef(TextField);
