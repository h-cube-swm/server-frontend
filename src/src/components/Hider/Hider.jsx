import React from "react";
import "./Hider.scss";

function Hider({ hide, children, animation = true }) {
  return (
    <div
      className={`hider ${hide ? "hide" : ""}`}
      style={{ transitionDuration: animation ? "500ms" : "0s" }}>
      {children}
    </div>
  );
}

export default Hider;
