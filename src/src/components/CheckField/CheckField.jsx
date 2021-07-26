import React, { forwardRef } from "react";
import "./CheckField.scss";

function CheckField({ checked, setChecked, disabled, radio, ...props }, ref) {
	const classes = ["checkmark"];

	if (radio) classes.push("radio");
	else classes.push("checkbox");
	if (!disabled && checked) classes.push("fill");

	return (
		<div className="check-field">
			<span
				ref={ref}
				class={classes.join(" ")}
				onClick={() => {
					if (setChecked && !disabled) setChecked(!checked);
				}}></span>
		</div>
	);
}

export default forwardRef(CheckField);
