import React from "react";
import { CardStates } from "../../../constants";
import addDefault from "../../../../../../utils/addDefault";

export default function LongSentence({
  question,
  state,
  setQuestion,
  response,
  setResponse,
}) {
  if (addDefault(question, setQuestion, { answer: "" })) return null;

  const { answer } = question;

  const handleChange = () => {
    return;
  };

  if (state === CardStates.RESPONSE) {
    return (
      <div>
        <input type="text" placeholder="장문형 텍스트" disabled={true} />
      </div>
    );
  }
  return (
    <div>
      <input
        type="text"
        placeholder="답변을 입력하세요"
        onChange={handleChange}
      />
    </div>
  );
}
