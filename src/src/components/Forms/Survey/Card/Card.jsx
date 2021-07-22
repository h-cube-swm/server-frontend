import React from "react";
import { CardTypes, CardStates, CardStyle } from "../constants";
import useTimeout from "../../../../hooks/useTimeout";

/* Assets */
import "../Card/Card.scss";
import hanleImage from "../../../../assets/icons/handle.svg";
import delBtn from "../../../../assets/icons/del-btn.svg";

/* Components */
import Default from "./Types/Default/Default";
import ToggleSwitch from "./ToggleSwitch";
import SingleChoice from "./Types/SingleChoice/SingleChoice";
import MultipleChoice from "./Types/MultipleChoice/MultipleChoice";
import Preference from "./Types/Preference/Preference";
import ShortSentence from "./Types/ShortSentence/ShortSentence";
import LongSentence from "./Types/LongSentence/LongSentence";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";

function getInnerComponent(type) {
	switch (type) {
		case CardTypes.SINGLE_CHOICE:
			return SingleChoice;
		case CardTypes.MULTIPLE_CHOICE:
			return MultipleChoice;
		case CardTypes.PREFERENCE:
			return Preference;
		case CardTypes.SHORT_SENTENCE:
			return ShortSentence;
		case CardTypes.LONG_SENTENCE:
			return LongSentence;
		default:
			return Default;
	}
}

export default function Card({
	// Logic-associated parameters
	state,
	question,
	setQuestion,
	response,
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

	const InnerComponent = getInnerComponent(question.type);

	const _onGrab = (event) => {
		event.preventDefault();
		if (state !== CardStates.EDITTING) return;
		onGrab();
	};

	const className = classes.join(" ");
	return (
		<div className={className} style={{ height: CardStyle.HEIGHT }} ref={dom}>
			<div className="card-header">
				<TextField
					placeholder="질문을 입력하세요."
					value={question.title}
					onChange={setNestedState(setQuestion, ["title"])}
				/>
				<div
					className={`basic-element ${
						state === CardStates.EDITTING ? "" : "hidden"
					}`}>
					<ToggleSwitch
						isRequired={question.isRequired}
						setIsRequired={(isRequired) =>
							setQuestion((question) => ({ ...question, isRequired }))
						}
						label="필수응답"
					/>
					<button
						className={`delete ${onDelete ? "" : "hidden"}`}
						onClick={onDelete}>
						<img src={delBtn} alt="Delete button"></img>
					</button>
				</div>
			</div>
			<div
				className="inner-box"
				onScroll={(e) => e.stopPropagation()}
				onWheel={(e) => e.stopPropagation()}>
				<InnerComponent
					state={state}
					isRequired={question.isRequired}
					question={question}
					setQuestion={setQuestion}
					response={response}
					setResponse={setResponse}
				/>
			</div>
			<div className="handle" onMouseDown={_onGrab}>
				<img src={hanleImage} alt="Handle"></img>
			</div>
		</div>
	);
}
