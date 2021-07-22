import React, { useState } from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../utils/addDefault";
import "./LongSentence.scss";
import TextField from "../../../../../TextField/TextField";
import setNestedState from "../../../../../../utils/setNestedState";

export default function LongSentence({
  question,
  state,
  setQuestion,
  response,
  setResponse,
}) {
  const [curLen, setCurLen] = useState(0);

  const initialized = useDefault(question, setQuestion, {
    answer: "",
    maxLen: 300,
  });
  if (!initialized) return null;

  const handleChange = (e) => {
    const answer = e.target.value;
    setQuestion((question) => ({ ...question, answer }));
  };

  if (state === CardStates.RESPONSE) {
    return (
      <div className="long-sentence">
        <TextField placeholder="장문형 텍스트" disabled />
      </div>
    );
  }

  const setText = setNestedState(setQuestion, ["answer"]);
  
  return (
    <div className="long-sentence">
      <TextField
        placeholder="답변을 입력하세요"
        text={question.answer}
        setText={setText}
      />
      <p>{question.answer}</p>
    </div>
  );
}
