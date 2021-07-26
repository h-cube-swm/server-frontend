import React, { useState } from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../hooks/useDefault";
import "./LongSentence.scss";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import IntegerField from "../../../../../IntegerField/IntegerField";
import { useQuestion } from "../../../../../../contexts/QuestionContext";

export default function LongSentence() {
	const { state, question, setQuestion, response, setResponse } = useQuestion();
	const setMaxNum = setNestedState(setQuestion, ["maxNum"]);

	const ia = useDefault(setQuestion, {
		answer: "",
		maxNum: 300,
	});
	const ib = useDefault(setResponse, "");

	if (!ia || !ib) return null;

	switch (state) {
		case CardStates.RESPONSE: // Should be RESPONSE
			return (
				<div className="long-sentence">
					<div className="response">
						<TextField
							placeholder="답변을 입력하세요"
							size="xl"
							setText={setResponse}
							text={response}
							maxLength={question.maxNum}
							multiline
						/>
						<Hider hide={state !== CardStates.RESPONSE}>
							<div className="max-len-indicator">
								{/* <p className="indicator">현재 / 최대</p> 
                  이 부분은 추후 추가가 될 수 있기에 임시로 주석처리 진행*/}
								{response.length === question.maxNum ? (
									<p className="red">
										{response.length + " / " + question.maxNum}
									</p>
								) : (
									<p>{response.length + " / " + question.maxNum}</p>
								)}
							</div>
						</Hider>
					</div>
				</div>
			);

		case CardStates.EDITTING:
		default:
			return (
				<div className="long-sentence">
					<TextField placeholder="장문형 텍스트" size="xl" disabled />
					<Hider hide={state !== CardStates.EDITTING}>
						<IntegerField
							number={question.maxNum}
							setNumber={setMaxNum}
							label="최대 글자수"
						/>
					</Hider>
				</div>
			);
	}
}
