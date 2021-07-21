import React, { useState } from "react";
import "./ToggleSwitch.scss";
import selectedDot from "../../../../assets/icons/selected-dot.svg";
import unselectedDot from "../../../../assets/icons/unselected-dot.svg";

export default function ToggleSwitch(params) {
  const isRequired = params.isRequired;
  const onClick = () => {
    params.setIsRequired(!params.isRequired);
  };

  return (
    <div className="toggle-switch">
      <div className="toggle-box" />
      <button
        className={isRequired ? "toggle-btn" : "unselected-toggle-btn"}
        onClick={onClick}>
        <img
          src={isRequired ? selectedDot : unselectedDot}
          alt="require element switch"
        />
      </button>
    </div>
  );
}
