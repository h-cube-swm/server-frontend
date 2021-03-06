import React from "react";
import "./CheckField.scss";

function CheckField({ checked, setChecked, disabled, radio }) {
  const classes = ["checkmark"];

  if (radio) classes.push("radio");
  else classes.push("checkbox");
  if (!disabled && checked) classes.push("fill");

  return (
    <div className="check-field">
      <div
        className={classes.join(" ")}
        onClick={() => {
          if (setChecked && !disabled) setChecked(!checked);
        }}></div>
    </div>
  );
}

export default CheckField;
