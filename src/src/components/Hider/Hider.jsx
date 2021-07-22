import React, { forwardRef } from "react";
import "./Hider.scss";

function Hider({ hide, children, animation = true }, ref) {
	return (
		<div
			className={`hider ${hide ? "hide" : ""}`}
			style={{ transitionDuration: animation ? null : "0s" }}
			ref={ref}>
			{children}
		</div>
	);
}

export default forwardRef(Hider);
