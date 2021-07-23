import React, { forwardRef } from "react";

/**
 * Positioner is required for absolute positioning.
 * If transform is set by js, it will override css transform setting.
 * Therefore, All transform setting should be done by js at once and it is not good.
 * Default origin is center of screen.
 * If topLeft flag is set true, origin will be set to top-left.
 */

function Positioner({ x, y, zIndex = 0, children, topLeft }, ref) {
	let style = {
		position: "absolute",
		transitionDuration: "0.5s",
		zIndex,
	};

	if (!topLeft) {
		style.transform = "translate(-50%, -50%)";
		style.left = "50%";
		style.top = "50%";
	}

	if (x) {
		if (typeof x === "number") style.transform += ` translateX(${x}px)`;
		else style.transform += ` translateX(${x})`;
	}
	if (y) {
		if (typeof y === "number") style.transform += ` translateY(${y}px)`;
		else style.transform += ` translateY(${y})`;
	}

	return (
		<div style={style} ref={ref}>
			{children}
		</div>
	);
}

export default forwardRef(Positioner);
