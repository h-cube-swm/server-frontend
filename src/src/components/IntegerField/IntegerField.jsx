import React from "react";
import plusBtn from "../../assets/icons/add-btn.svg";
import minusBtn from "../../assets/icons/minus-btn.svg";
import TextField from "../TextField/TextField";
import "./IntegerField.scss";

function IntegerField(
  { number, setNumber, disabled, label, max, min, ...props },
  ref
) {
  const maxNum = max ? max : 999;
  const minNum = min ? min : 0;

  const onChange = (text) => {
    text = text + "";
    if (!/^[0-9]{0,3}$/.test(text)) return false;
    let number = +text;
    if (number >= maxNum) number = maxNum;
    setNumber(number);
  };

  const plus = () => {
    if (number >= maxNum) return;
    setNumber(number + 1);
  };

  const minus = () => {
    if (number <= minNum) return;
    setNumber(number - 1);
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
      <span className="btn-set">
        <button onClick={plus}>
          <img src={plusBtn} alt="add max length button" />
        </button>
        <button onClick={minus}>
          <img src={minusBtn} alt="minus max length button" />
        </button>
      </span>
    </span>
  );
}

export default IntegerField;
