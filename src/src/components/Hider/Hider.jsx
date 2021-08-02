import React from "react";
import useTimeout from "../../hooks/useTimeout";
import "./Hider.scss";

function Hider({ hide, children, animation = true, appearDelay = 0 }) {
  const isInit = useTimeout(appearDelay);
  hide |= !isInit;

  return (
    <div
      className={`hider ${hide ? "hide" : ""}`}
      style={{ transitionDuration: animation ? "500ms" : "0s" }}>
      {children}
    </div>
  );
}

export default Hider;
