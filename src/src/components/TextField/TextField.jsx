import React from "react";
import "./TextField.scss";

function TextField({ text, setText, disabled, size, multiline, ...props }) {
  if (!setText) {
    return <div className={"txt-field " + size}>{text}</div>;
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
      className={"txt-field textarea " + size}
      value={text}
      // onChange={handleOnChange}
      disabled={disabled}
      onInput={handleOnInput}
    />
  );
}

export default TextField;
