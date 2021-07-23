import React, { forwardRef } from "react";
import "./TextField.scss";

function TextField(
	{ text, setText, disabled, size, multiline, ...props },
	ref
) {
	if (multiline) {
		return (
			<textarea
				{...props}
				className={"txt-field textarea " + size}
				value={text}
				onChange={setText ? (e) => setText(e.target.value) : () => {}}
				disabled={disabled || !setText}
				ref={ref}
			/>
		);
	} else {
		return (
			<input
				{...props}
				className={"txt-field " + size}
				type="text"
				value={text}
				onChange={setText ? (e) => setText(e.target.value) : () => {}}
				disabled={disabled || !setText}
				ref={ref}
			/>
		);
	}
}

export default forwardRef(TextField);
