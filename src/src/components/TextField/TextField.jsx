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

  // Build classname
  const classes = ["txt-field"];
  if (size) classes.push(size);
  if (disabled) classes.push("disabled");
  if (!text) classes.push("placeholder");
  if (multiline) classes.push("multiline");
  const className = classes.join(" ");

  // Adjust maximum height. It works similar to max-height option of css.
  const resize = () => {
    const cur = ref.current;

    if (!cur) return;
    cur.style.height = "";
    const height = Math.min(cur.scrollHeight + 2, 100) + "px";
    cur.style.height = height;
  };

  const handleOnInput = () => {
    const cur = ref.current;

    if (disabled) return;
    if (!cur) return;
    let { value } = cur;
    if (!multiline) value = value.replace(/\n/g, "");
    setText(value);
  };

  resize();

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
