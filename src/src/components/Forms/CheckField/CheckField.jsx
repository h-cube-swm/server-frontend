import React, { forwardRef } from "react";

function CheckField({ checked, setChecked, disabled, ...props }, ref) {
	return (
		<input
			{...props}
			type="checkbox"
			value={checked}
			onChange={setChecked && ((e) => setChecked(e.target.value))}
			disabled={disabled || !setChecked}
			ref={ref}
		/>
	);
}

export default forwardRef(CheckField);
