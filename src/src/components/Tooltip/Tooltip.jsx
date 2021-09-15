import React from "react";
import "./Tooltip.scss";

export default function Tooltip({ children, text, size }) {
  return (
    <div className="tooltip">
      {children}
      <span className={"tooltiptext " + size}>{text}</span>
    </div>
  );
}
