import React from "react";

/**
 * Positioner is required for absolute positioning.
 * If transform is set by js, it will override css transform setting.
 * Therefore, All transform setting should be done by js at once and it is not good.
 * Default origin is center of screen.
 * If topLeft flag is set true, origin will be set to top-left.
 */

export function Positioner({ x, y, depth = 0, children, topLeft }) {
	let style = {
		position: "absolute",
		transitionDuration: "0.5s",
		zIndex: -depth,
	};

	if (!topLeft) {
		style.transform = "translate(-50%, -50%)";
		style.left = "50%";
		style.top = "50%";
	}

	if (x) style.transform += ` translateX(${x}px)`;
	if (y) style.transform += ` translateY(${y}px)`;

	return <div style={style}>{children}</div>;
}
