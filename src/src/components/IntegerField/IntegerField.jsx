import React, { forwardRef } from "react";
import plusBtn from "../../assets/icons/add-btn.svg";
import minusBtn from "../../assets/icons/minus-btn.svg";
import "./IntegerField.scss";

function IntegerField({ number, setNumber, disabled, ...props }, ref) {
  const onChange = (e) => {
    let text = e.target.value + "";
    if (!/^[0-9]{0,3}$/.test(text)) return false;
    const number = +text;
    setNumber(number);
  };

  const plus = () => {
    if (number >= 999) return;
    setNumber(number + 1);
  };

  const minus = () => {
    if (number <= 0) return;
    setNumber(number - 1);
  };

  return (
    <span className="integer-field">
      <input
        {...props}
        type="text"
        value={number}
        disabled={disabled || !setNumber}
        onChange={onChange}
      />
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

export default forwardRef(IntegerField);
