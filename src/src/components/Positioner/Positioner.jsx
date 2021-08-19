import React from "react";

/**
 * Positioner is required for absolute positioning.
 * If transform is set by js, it will override css transform setting.
 * Therefore, All transform setting should be done by js at once and it is not good.
 * Default origin is center of screen.
 * If topLeft flag is set true, origin will be set to top-left.
 */

function Positioner({ x, y, zIndex = 0, children, topLeft }) {
  // Default style.
  const style = {
    position: "absolute",
    transitionDuration: "500ms",
    zIndex,
  };

  // If topLeft is not set, consider top center of element instead of top-left corner.
  if (!topLeft) {
    style.transform = "translate(-50%, -50%)";
    style.left = "50%";
    style.top = "50%";
  }

  // If x is set, move to right with given amount.
  if (x) {
    if (typeof x === "number") style.transform += ` translateX(${x}px)`;
    else style.transform += ` translateX(${x})`;
  }

  // If x is set, move to bottom with given amount.
  if (y) {
    if (typeof y === "number") style.transform += ` translateY(${y}px)`;
    else style.transform += ` translateY(${y})`;
  }

  return <div style={style}>{children}</div>;
}

export default Positioner;
