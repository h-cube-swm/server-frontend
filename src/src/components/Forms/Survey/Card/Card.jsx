import React from "react";
import { CardTypes, CardStates, CardStyle } from "../constants";
import "../Card/Card.scss";
import hanleImage from "../../../../assets/icons/handle.svg";
import delBtn from "../../../../assets/icons/del-btn.svg";
import ToggleSwitch from "./ToggleSwitch";
import useTimeout from "../../../../hooks/useTimeout";

export default function Card({
	// Logic-associated parameters
	question,
	state,
	setQuestion,
	setResponse,
	onDelete,

	// UI-associated parameters
	onGrab,
	dom,
	slowAppear,
	hidden,
}) {
	const isInit = useTimeout(slowAppear ? 400 : 0);

	if (!question) return null;

	let classes = ["survey-card"];

	if (isInit) classes.push("hidden");

	switch (state) {
		case CardStates.EDITTING:
			classes.push("highlight");
			classes.push("show-handle");
			break;

		case CardStates.ORDERING:
			classes.push("hidden");
			break;

		case CardStates.PREVIEW:
			classes.push("preview");
			break;

		case CardStates.GHOST:
			if (hidden) {
				classes.push("hidden");
			} else {
				classes.push("ghost");
				classes.push("show-handle");
				classes.push("highlight");
			}
			break;

		default:
			break;
	}

	let inner = <div className="inner-default">Type : {question.type}</div>;

	const type = question?.type;
	switch (type) {
		case CardTypes.SINGLE_CHOICE:
			break;
		case CardTypes.MULTIPLE_CHOICE:
			break;
		case CardTypes.PREFERENCE:
			break;
		case CardTypes.SHORT_SENTENCE:
			break;
		case CardTypes.LONG_SENTENCE:
			break;
		default:
			inner = <div className="inner-default">Unsupported Card Type</div>;
			break;
	}

	const _onGrab = (event) => {
		event.preventDefault();
		if (state !== CardStates.EDITTING) return;
		onGrab();
	};

	const className = classes.join(" ");
	return (
		<div
			className={className}
			style={{
				height: CardStyle.HEIGHT,
			}}
			ref={dom}>
			<div className="card-header">
				<input type="text" placeholder="제목을 입력하세요." />
				<div
					className={`basic-element ${
						state === CardStates.EDITTING ? "" : "hidden"
					}`}>
					<ToggleSwitch
						isRequired={question.isRequired}
						setIsRequired={(isRequired) => {
							const newQuestion = { ...question, isRequired };
							setQuestion(newQuestion);
						}}
						label="필수요소"
					/>
					<button className="delete" onClick={onDelete}>
						<img src={delBtn} alt="Delete button"></img>
					</button>
				</div>
			</div>
			<div className="inner-box">{inner}</div>
			<div className="handle" onMouseDown={_onGrab}>
				<img src={hanleImage} alt="Handle"></img>
			</div>
		</div>
	);
}
