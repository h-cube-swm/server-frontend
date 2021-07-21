import React from "react";
import "./ToggleSwitch.scss";
import selectedDot from "../../../../assets/icons/selected-dot.svg";
import unselectedDot from "../../../../assets/icons/unselected-dot.svg";

export default function ToggleSwitch(params) {
	const isRequired = params.isRequired;
	const label = params.label;
	const onClick = () => {
		params.setIsRequired(!params.isRequired);
	};

	return (
		<div className="toggle-box">
			<div className="toggle-switch">
				<div className="toggle-background" />
				<button
					className={isRequired ? "toggle-btn" : "unselected-toggle-btn"}
					onClick={onClick}>
					<img
						src={isRequired ? selectedDot : unselectedDot}
						alt="require element switch"
					/>
				</button>
			</div>
			<p className={isRequired ? "selected-label" : "unselected-label"}>
				{label}
			</p>
		</div>
	);
}
