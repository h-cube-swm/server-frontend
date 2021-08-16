import React from "react";
import "./FadeBox.scss";

export default function FadeBox({ children }) {
  return (
    <div>
      <div class="input-box">
        {children}
        <div class="fade-in"></div>
        <div class="fade-out"></div>
      </div>
    </div>
  );
}
