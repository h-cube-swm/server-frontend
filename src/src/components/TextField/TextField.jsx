import React, { forwardRef } from "react";
import "./TextField.scss";

function TextField(
	{ text, setText, disabled, size, multiline, ...props },
	ref
) {
	if (multiline) {
		const onInput = ({ target }) => {
			target.style.height = "";
			target.style.height = target.scrollHeight + "px";
			if (size === "title" && target.scrollHeight >= 79) {
				target.style.height = "79px";
				target.style.overflow = "scroll";
			} else if (size === "xl" && target.scrollHeight >= 45) {
				target.style.height = "45px";
				target.style.overflow = "scroll";
			}
		};

		return (
			<textarea
				rows={1}
				{...props}
				className={"txt-field textarea " + size}
				value={text}
				onChange={setText ? (e) => setText(e.target.value) : () => {}}
				disabled={disabled || !setText}
				ref={ref}
				onInput={onInput}
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
