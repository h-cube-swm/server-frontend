import React, { useState } from "react";
import useDefault from "../../../../../../hooks/useDefault";
import { CardStates } from "../../../constants";
import "./ShortSentence.scss";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import IntegerField from "../../../../../IntegerField/IntegerField";
import { useQuestion } from "../../../../../../contexts/QuestionContext";

export default function ShortSentence() {
	const { state, question, setQuestion, response, setResponse } = useQuestion();
	const setMaxLen = setNestedState(setQuestion, ["maxLen"]);

	const ia = useDefault(setQuestion, {
		answer: "",
		maxLen: 32,
	});
	const ib = useDefault(setResponse, "");

	if (!ia || !ib) return null;

	switch (state) {
		case CardStates.RESPONSE:
			return (
				<div className="short-sentence">
					<div className="response">
						<TextField
							placeholder="답변을 입력하세요"
							size="lg"
							setText={setResponse}
							text={response}
							maxLength={question.maxLen}
						/>
						<Hider hide={state !== CardStates.RESPONSE}>
							<div className="max-len-indicator">
								{response.length === question.maxLen ? (
									<p className="red">
										{response.length + " / " + question.maxLen}
									</p>
								) : (
									<p>{response.length + " / " + question.maxLen}</p>
								)}
							</div>
						</Hider>
					</div>
				</div>
			);
		case CardStates.EDITTING:
		default:
			return (
				<div className="short-sentence">
					<TextField placeholder="단답형 텍스트" size="lg" disabled />
					<Hider hide={state !== CardStates.EDITTING}>
						<IntegerField
							number={question.maxLen}
							setNumber={setMaxLen}
							label="최대 글자수"
						/>
					</Hider>
				</div>
			);
	}
}
