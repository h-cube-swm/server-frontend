import React, { useEffect, useRef } from "react";
import useScrollBlock from "../../hooks/useScrollBlock";
import "./TextField.scss";

function TextField({
  text,
  setText,
  disabled,
  size,
  multiline,
  placeholder,
  focused,
  ...props
}) {
  const ref = useRef(null);

  // Build classname
  const classes = ["text-field"];
  if (size) classes.push(size);
  if (disabled) classes.push("gray viewmode");
  if (!text) classes.push("gray");
  if (!setText) classes.push("viewmode");
  if (multiline) classes.push("multiline");
  const className = classes.join(" ");

  const handleOnInput = () => {
    const cur = ref.current;
    if (disabled) return;
    if (!cur) return;
    if (!multiline) cur.value = cur.value.replace(/\n/g, "");
    setText(cur.value);
  };

  if (!setText) {
    if (text) {
      return <div className={className}>{text}</div>;
    } else {
      return <div className={className}>{placeholder}</div>;
    }
  }

  return (
    <textarea
      className={className}
      ref={ref}
      rows={1}
      {...props}
      onInput={handleOnInput}
      value={text}
      disabled={disabled || !setText}
      placeholder={placeholder}
    />
  );
}

export default TextField;
