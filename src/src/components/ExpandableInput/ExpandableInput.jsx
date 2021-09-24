import React, { forwardRef, useEffect, useRef } from "react";
import "./ExpandableInput.scss";

function ExpandableInput({ text, setText, placeholder, size }, outterRef) {
  const innerRef = useRef(null);
  const isEditable = setText;

  useEffect(() => {
    innerRef.current.innerHTML = text || "";
  }, [innerRef.current]);

  if (innerRef.current && innerRef.current !== document.activeElement)
    innerRef.current.innerHTML = text || "";

  return (
    <div
      ref={(ref) => {
        innerRef.current = ref;
        // eslint-disable-next-line
        if (outterRef) outterRef.current = ref;
      }}
      className="expandable-input"
      onInput={(e) => setText(e.target.innerHTML)}
      contentEditable={isEditable ? "true" : "false"}></div>
  );
}

export default forwardRef(ExpandableInput);
