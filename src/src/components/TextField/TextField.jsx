import React, { forwardRef } from "react";

function TextField({ text, setText, disabled, ...props }, ref) {
	return (
		<input
			{...props}
			type="text"
			value={text}
			onChange={setText ? (e) => setText(e.target.value) : () => {}}
			disabled={disabled || !setText}
			ref={ref}
		/>
	);
}

export default forwardRef(TextField);
