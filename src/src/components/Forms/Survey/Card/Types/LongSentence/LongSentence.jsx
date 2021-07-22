import React, { useState } from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../utils/useDefault";
import "./LongSentence.scss";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import IntegerField from "../../../../../IntegerField/IntegerField";

export default function LongSentence({
	question,
	state,
	setQuestion,
	response,
	setResponse,
}) {
	const setAnswer = setNestedState(setQuestion, ["answer"]);
	const setMaxNum = setNestedState(setQuestion, ["maxNum"]);

	const initialized = useDefault(question, setQuestion, {
		answer: "",
		maxNum: 300,
	});
	if (!initialized) return null;

	switch (state) {
		case CardStates.RESPONSE:
			return (
				<div className="long-sentence">
					<TextField
						placeholder="답변을 입력하세요"
						text={question.answer}
						setText={setAnswer}
					/>
					<p>{question.answer}</p>
				</div>
			);

		case CardStates.EDITTING:
		default:
			return (
				<div className="long-sentence">
					<TextField placeholder="장문형 텍스트" disabled />
					<Hider hide={state !== CardStates.EDITTING}>
						<IntegerField number={question.maxNum} setNumber={setMaxNum} />
					</Hider>
				</div>
			);
	}
}
