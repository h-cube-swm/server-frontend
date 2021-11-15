import React from "react";
import "./ToggleSwitch.scss";
import selectedDot from "assets/icons/selected-dot.svg";
import unselectedDot from "assets/icons/unselected-dot.svg";

export default function ToggleSwitch({
  isRequired,
  setIsRequired,
  selectedLabel,
  unselectedLabel,
}) {
  const onClick = () => {
    setIsRequired(!isRequired);
  };

  return (
    <div className="toggle-box" onMouseDown={(event) => event.preventDefault()} onClick={onClick}>
      <div className="toggle-switch">
        <div className="toggle-background" />
        <div className={isRequired ? "toggle-btn" : "unselected-toggle-btn"}>
          <img src={isRequired ? selectedDot : unselectedDot} alt="require element switch" />
        </div>
      </div>
      <p className="label">{isRequired ? selectedLabel : unselectedLabel}</p>
    </div>
  );
}
