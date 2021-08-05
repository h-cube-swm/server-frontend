import React from "react";
import "./ShortSentence.scss";
import { CardStates } from "../../constants";
import setNestedState from "../../../../../utils/setNestedState";

// Hooks
import useDefault from "../../../../../hooks/useDefault";
import { useQuestion } from "../../../../../contexts/QuestionContext";

// Components
import TextField from "../../../../TextField/TextField";
import IntegerField from "../../../../IntegerField/IntegerField";

function Sentence({ isLong }) {
  const { state, question, setQuestion, response, setResponse } = useQuestion();

  const ia = useDefault(setQuestion, {
    answer: "",
    maxLenLong: 300,
    maxLenShort: 32,
  });
  const ib = useDefault(setResponse, "");

  if (!ia || !ib) return null;

  const maxLen = isLong ? question.maxLenLong : question.maxLenShort;
  const setMaxLen = setNestedState(setQuestion, [
    isLong ? "maxLenLong" : "maxLenShort",
  ]);

  let extra = null;

  if (state === CardStates.EDITTING) {
    extra = (
      <IntegerField number={maxLen} setNumber={setMaxLen} label="최대 글자수" />
    );
  } else if (response) {
    extra = (
      <div className="max-len-indicator">
        <p className={response.length === maxLen ? "red" : ""}>
          {response.length + " / " + maxLen}
        </p>
      </div>
    );
  }

  return (
    <div className="sentence-question">
      <TextField
        placeholder={isLong ? "장문형 텍스트" : "단답형 텍스트"}
        size={isLong ? "xl" : "lg"}
        setText={setResponse}
        text={response}
        maxLength={maxLen}
        multiline={isLong}
      />
      {extra}
    </div>
  );
}

export function ShortSentence() {
  return <Sentence isLong={false} />;
}

export function LongSentence() {
  return <Sentence isLong={true} />;
}
