import React, { forwardRef, useEffect, useRef } from "react";
import "./ExpandableInput.scss";

function ExpandableInput({ text, setText, placeholder, type }, outterRef) {
  const innerRef = useRef(null);
  const isEditable = setText;

  useEffect(() => {
    innerRef.current.innerText = text || "";
  }, [innerRef.current]);

  if (innerRef.current && innerRef.current !== document.activeElement)
    innerRef.current.innerText = text || "";

  const onPaste = (e) => {
    e.preventDefault();
    let pastedText = "";
    if (window.clipboardData && window.clipboardData.getData) {
      // IE
      pastedText = window.clipboardData.getData("Text");
    } else if (e.clipboardData && e.clipboardData.getData) {
      pastedText = e.clipboardData.getData("text/plain");
    }
    e.target.textContent = e.target.innerText + pastedText;
    setText(e.target.textContent);
    return false;
  };

  return (
    <div className={"expandable-input " + type}>
      <div
        ref={(ref) => {
          innerRef.current = ref;
          // eslint-disable-next-line
          if (outterRef) outterRef.current = ref;
        }}
        className="input-field"
        onInput={(e) => setText(e.target.innerText)}
        onPaste={(e) => onPaste(e)}
        contentEditable={isEditable ? "true" : "false"}></div>
      {!text && <div className="placeholder">{placeholder}</div>}
    </div>
  );
}

export default forwardRef(ExpandableInput);
