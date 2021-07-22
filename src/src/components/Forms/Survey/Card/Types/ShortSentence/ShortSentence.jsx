import React, { useState } from "react";
import useDefault from "../../../../../../utils/useDefault";
import { CardStates } from "../../../constants";
import "./ShortSentence.scss";
import plusBtn from "../../../../../../assets/icons/add-btn.svg";
import minusBtn from "../../../../../../assets/icons/minus-btn.svg";
import TextField from "../../../../../TextField/TextField";

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
    setQuestion((question) => ({ ...question, answer }));
  };

  const plus = () => {
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
        <TextField placeholder="단답형 텍스트" disabled />
        <div className="max-len-controller">
          <div className="text-set">
            <p>최대 글자수</p>
            <strong>{question.maxLen}</strong>
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
      </div>
    );
  }

  return (
    <div className="short-sentence">
      <input
        type="text"
        placeholder="답변을 입력해주세요."
        onChange={update}
        value={question.answer}
      />
    </div>
  );
}
