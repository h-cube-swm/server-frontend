import React, { useState } from "react";
import useDefault from "../../../../../../utils/useDefault";
import { CardStates } from "../../../constants";
import "./ShortSentence.scss";
import plusBtn from "../../../../../../assets/icons/add-btn.svg";
import minusBtn from "../../../../../../assets/icons/minus-btn.svg";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";

export default function ShortSentence({
	question,
	state,
	setQuestion,
	setResponse,
}) {
	const [curLen, setCurLen] = useState(0);
	const initialized = useDefault(question, setQuestion, {
		answer: "",
		maxLen: 32,
	});
	if (!initialized) return null;

	const update = (e) => {
		const answer = e.target.value;
		if (e.target.value.length <= question.maxLen) {
			setCurLen(e.target.value.length);
		}
		setQuestion((question) => ({ ...question, answer }));
	};

	const maxLenChange = (e) => {
		let text = e.target.value + "";
		if (!/^[0-9]{0,3}$/.test(text)) return false;
		const maxLen = +text;
		setQuestion((question) => ({ ...question, maxLen }));
	};

	const plus = () => {
		if (question.maxLen >= 999) return;
		const maxLen = question.maxLen + 1;
		setQuestion((question) => ({ ...question, maxLen }));
	};

	const minus = () => {
		if (question.maxLen <= 0) return;
		const maxLen = question.maxLen - 1;
		setQuestion((question) => ({ ...question, maxLen }));
	};

	if (state === CardStates.EDITTING) {
		return (
			<div className="short-sentence">
				<div className="short-sentence-box">
					<TextField placeholder="단답형 텍스트" disabled />
					<Hider hide={state !== CardStates.EDITTING}>
						<div className="max-len-controller">
							<div className="text-set">
								<p>최대 글자수</p>
								<input
									type="text"
									placeholder={question.maxLen}
									value={question.maxLen}
									onChange={maxLenChange}
									onFocus={({ target }) => {
										target.setSelectionRange(0, target.value.length);
									}}
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
			</div>
		);
	}

	return (
		<div className="short-sentence">
			<div className="short-sentence-box">
				<div className="response">
					<input
						type="text"
						placeholder="답변을 입력해주세요."
						onChange={update}
						value={question.answer}
						maxLength={question.maxLen}
					/>
					<Hider hide={state !== CardStates.EDITTING}>
						<div className="max-len-indicator">
							<p className="indicator">현재 / 최대</p>
							<p>{curLen + " / " + question.maxLen}</p>
						</div>
					</Hider>
				</div>
			</div>
		</div>
	);
}
