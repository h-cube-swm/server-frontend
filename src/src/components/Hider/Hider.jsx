import React, { forwardRef } from "react";
import "./Hider.scss";

export default forwardRef(function Hider({ hide, children }, ref) {
	return (
		<div className={`hider ${hide ? "hide" : ""}`} ref={ref}>
			{children}
		</div>
	);
});
