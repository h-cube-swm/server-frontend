import React from "react";
import "./FadeBox.scss";

export default function FadeBox({ children }) {
  return (
    <div>
      <div className="input-box">
        {children}
        <div className="fade-in"></div>
        <div className="fade-out"></div>
      </div>
    </div>
  );
}
