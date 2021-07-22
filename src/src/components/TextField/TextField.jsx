import React from "react";

export default function TextField({ text, setText, disabled, ...props }) {
	return (
		<input
			{...props}
			type="text"
			value={text}
			onChange={setText && ((e) => setText(e.target.value))}
			disabled={disabled || !setText}
		/>
	);
}
