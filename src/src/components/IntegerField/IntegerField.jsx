import React from "react";
import TextField from "../TextField/TextField";
import "./IntegerField.scss";

function IntegerField({ number, setNumber, disabled, label, max, min, ...props }) {
  const maxNum = max || 999;
  const minNum = min || 0;

  const onChange = (value) => {
    const text = value + "";
    if (!/^[0-9]{0,3}$/.test(text)) return false;
    let number = +text;
    if (number >= maxNum) number = maxNum;
    setNumber(number);
    return true;
  };

  return (
    <span className="integer-field">
      <div className="text-set">
        <p className="label">{label}</p>
        <TextField
          {...props}
          text={number}
          disabled={disabled || !setNumber}
          setText={onChange}
          size="md"
          max={maxNum}
          min={minNum}
        />
      </div>
    </span>
  );
}

export default IntegerField;
