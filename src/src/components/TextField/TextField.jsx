import React from "react";

export default function TextField({ onChange, ...props }) {
	return (
		<input
			{...props}
			type="text"
			onChange={onChange && ((e) => onChange(e.target.value))}></input>
	);
}
