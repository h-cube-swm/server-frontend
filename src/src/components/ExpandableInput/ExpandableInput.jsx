import React, { forwardRef, useEffect, useRef } from "react";
import "./ExpandableInput.scss";

function ExpandableInput({ text, setText, placeholder }, outterRef) {
  const innerRef = useRef(null);
  const isEditable = setText;

  useEffect(() => {
    innerRef.current.innerText = text || "";
  }, [innerRef.current]);

  if (innerRef.current && innerRef.current !== document.activeElement)
    innerRef.current.innerText = text || "";

  return (
    <div className="expandable-input">
      <div
        ref={(ref) => {
          innerRef.current = ref;
          // eslint-disable-next-line
          if (outterRef) outterRef.current = ref;
        }}
        className="input-field"
        onInput={(e) => setText(e.target.innerText)}
        contentEditable={isEditable ? "true" : "false"}></div>
      {!text && <div className="placeholder">{placeholder}</div>}
    </div>
  );
}

export default forwardRef(ExpandableInput);
