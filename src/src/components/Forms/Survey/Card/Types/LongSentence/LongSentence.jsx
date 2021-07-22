import React from "react";
import { CardStates } from "../../../constants";
import addDefault from "../../../../../../utils/addDefault";
import "./LongSentence.scss";

export default function LongSentence({
  question,
  state,
  setQuestion,
  response,
  setResponse,
}) {
  if (addDefault(question, setQuestion, { answer: "" })) return null;

  const handleChange = (e) => {
    const answer = e.target.value;
    setQuestion((question) => ({ ...question, answer }));
  };

  if (state === CardStates.EDITTING) {
    return (
      <div className="long-sentence">
        <input type="text" placeholder="장문형 텍스트" disabled={true} />
      </div>
    );
  }
  return (
    <div className="long-sentence">
      <input
        type="text"
        placeholder="답변을 입력하세요"
        onChange={handleChange}
        value={question.answer}
        name="response"
      />
      <p>{question.answer}</p>
    </div>
  );
}
