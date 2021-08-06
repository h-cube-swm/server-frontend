import React, { useEffect, useRef } from "react";
import "./TextField.scss";

/*

  if disabled : font color is gray instead of black, and not editable.
  else        : font color is black.

  if setText is supplied : editable
  else                   : not editable

  if both setText is supplied and disabled : not editable.
 */

function TextField({
  text,
  setText,
  disabled,
  size,
  multiline,
  placeholder,
  ...props
}) {
  const ref = useRef(null);
  const { current } = ref;

  // Build classname
  const classes = ["txt-field"];
  if (size) classes.push(size);
  if (disabled) classes.push("disabled");
  if (!text) classes.push("placeholder");
  if (multiline) classes.push("multiline");
  const className = classes.join(" ");

  // Adjust maximum height. It works similar to max-height option of css.
  const resize = () => {
    if (!current) return;
    current.style.height = "";
    const height = Math.min(current.scrollHeight + 2, 100) + "px";
    current.style.height = height;
  };

  const handleOnInput = () => {
    if (disabled) return;
    if (!current) return;
    let { value } = current;
    if (!multiline) value = value.replace(/\n/g, "");
    setText(value);
  };

  resize();
  console.log("asdF");

  if (!setText) {
    if (text) {
      return <div className={className}>{text}</div>;
    } else {
      return <div className={className}>{placeholder}</div>;
    }
  }

  return (
    <textarea
      ref={ref}
      rows={1}
      {...props}
      className={className}
      onInput={handleOnInput}
      value={text}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

export default TextField;
