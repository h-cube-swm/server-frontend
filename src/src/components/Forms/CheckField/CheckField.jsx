import React, { forwardRef } from "react";

function CheckField({ checked, setChecked, disabled, radio, ...props }, ref) {
	return (
		<input
			{...props}
			type={radio ? "radio" : "checkbox"}
			checked={checked}
			onChange={setChecked && ((e) => setChecked(e.target.checked))}
			disabled={disabled || !setChecked}
			ref={ref}
		/>
	);
}

export default forwardRef(CheckField);
