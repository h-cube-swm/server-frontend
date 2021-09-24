import React from "react";
import "./Tooltip.scss";

export default function Tooltip({ children, text, size, pos }) {
  const classes = ["tooltiptext"];
  if (size) classes.push(size);
  if (pos) classes.push(pos);
  return (
    <div className="tooltip">
      {children}
      <span className={classes.join(" ")}>{text}</span>
    </div>
  );
}
