import React, { useEffect, useState } from "react";
import { CardTypes, CardStates, CardStyle } from "../constants";
import "../Card/Card.scss";
import hanleImage from "../../../../assets/icons/handle.svg";

export default function Card({
	// Logic-associated parameters
	question,
	state,
	setQuestion,
	setResponse,

	// UI-associated parameters
	index,
	selectedIndex,
	onGrab,
	dom,
}) {
	const [isInit, setIsInit] = useState(true);
	const yPos =
		(index - selectedIndex) * (CardStyle.HEIGHT + CardStyle.DISTANCE);

	// Implement delayed fade-in effect
	useEffect(() => {
		setTimeout(() => {
			setIsInit(false);
		}, 400);
	}, []);

	let classes = ["survey-card"];

	let style = {
		height: CardStyle.HEIGHT,
	};
	if (isInit) style.opacity = 0;

	switch (state) {
		case CardStates.EDITTING:
			style.transform = `translate(-50%, -50%) translateY(${yPos}px)`;
			classes.push("highlight");
			classes.push("show-handle");
			break;

		case CardStates.ORDERING:
			style.transform = `translate(-50%, -50%) translateY(${yPos}px)`;
			classes.push("hidden");
			break;

		case CardStates.RESPONSE:
			style.transform = `translate(-50%, -50%) translateY(${yPos}px)`;
			break;

		case CardStates.GHOST:
			if (index == 0) {
				classes.push("hidden");
			} else {
				classes.push("ghost");
				classes.push("show-handle");
				classes.push("highlight");
			}
			break;
	}

	let inner = <div className="loading">Loading</div>;

	const type = question.type;
	switch (type) {
	}

	const _onGrab = (event) => {
		event.preventDefault();
		if (state !== CardStates.EDITTING) return;
		onGrab();
	};

	const className = classes.join(" ");

	return (
		<div className={className} style={style} ref={dom}>
			<div className="inner-container">{inner}</div>
			<div className="handle" onMouseDown={_onGrab}>
				<img src={hanleImage}></img>
			</div>
		</div>
	);
}
