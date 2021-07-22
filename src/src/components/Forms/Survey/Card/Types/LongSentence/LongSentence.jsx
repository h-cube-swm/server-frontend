import React, { useState } from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../utils/useDefault";
import "./LongSentence.scss";
import plusBtn from "../../../../../../assets/icons/add-btn.svg";
import minusBtn from "../../../../../../assets/icons/minus-btn.svg";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";

export default function LongSentence({
	question,
	state,
	setQuestion,
	response,
	setResponse,
}) {
	const [curLen, setCurLen] = useState(0);
	const setAnswer = setNestedState(setQuestion, ["answer"]);
	const setMaxNum = setNestedState(setQuestion, ["maxNum"]);

	const initialized = useDefault(question, setQuestion, {
		answer: "",
		maxNum: 300,
	});
	if (!initialized) return null;

	const maxNumChange = (e) => {
		let text = e.target.value + "";
		if (!/^[0-9]{0,3}$/.test(text)) return false;
		const maxNum = +text;
		setMaxNum(maxNum);
	};

	const plus = () => {
		if (question.maxNum >= 999) return;
		const maxNum = question.maxNum + 1;
		setMaxNum(maxNum);
	};

	const minus = () => {
		if (question.maxNum <= 0) return;
		const maxNum = question.maxNum - 1;
		setMaxNum(maxNum);
	};

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
						<div className="max-len-controller">
							<div className="text-set">
								<p>최대 글자수</p>
								<input
									type="text"
									placeholder={question.maxNum}
									value={question.maxNum}
									onChange={maxNumChange}
								/>
							</div>
							<div className="btn-set">
								<button onClick={plus}>
									<img src={plusBtn} alt="add max length button" />
								</button>
								<button onClick={minus}>
									<img src={minusBtn} alt="minus max length button" />
								</button>
							</div>
						</div>
					</Hider>
				</div>
			);
	}
}
