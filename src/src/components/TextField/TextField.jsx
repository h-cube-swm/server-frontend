import React from "react";
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
  const classes = ["txt-field"];
  if (size) classes.push(size);
  if (disabled) classes.push("disabled");
  if (!text) classes.push("placeholder");

  const className = classes.join(" ");

  if (!setText) {
    if (text) {
      return <div className={className}>{text}</div>;
    } else {
      return <div className={className}>{placeholder}</div>;
    }
  }

  const handleOnInput = ({ target }) => {
    let { value } = target;
    if (!multiline) value = value.replace(/\n/g, "");
    target.value = value;
    setText(value);

    target.style.height = "";
    target.style.height = target.scrollHeight + "px";
    if (size === "title" && target.scrollHeight >= 79) {
      target.style.height = "79px";
      target.style.overflow = "scroll";
    } else if (size === "xl" && target.scrollHeight >= 45) {
      target.style.height = "45px";
      target.style.overflow = "scroll";
    }
  };

  return (
    <textarea
      rows={1}
      {...props}
      className={className}
      value={text}
      disabled={disabled}
      placeholder={placeholder}
      onInput={handleOnInput}
    />
  );
}

export default TextField;
