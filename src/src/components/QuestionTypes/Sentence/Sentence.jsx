import React from "react";
import "./Sentence.scss";
import { CardStates } from "constants.js";
import setNestedState from "utils/setNestedState";

// Hooks
import useDefault from "hooks/useDefault";
import { useQuestion } from "contexts/QuestionContext";

// Components
import TextField from "components/TextField/TextField";
import IntegerField from "components/IntegerField/IntegerField";

function Sentence({ isLong }) {
  const { state, question, setQuestion, response, setResponse, tabIndex } = useQuestion();

  const ia = useDefault(question, setQuestion, {
    answer: "",
    maxLenLong: 300,
    maxLenShort: 32,
  });
  const ib = useDefault(response, setResponse, "");

  if (!ia || !ib) return null;

  const isEditting = state === CardStates.EDITING;
  const maxLen = isLong ? question.maxLenLong : question.maxLenShort;
  const setMaxLen = setNestedState(setQuestion, [isLong ? "maxLenLong" : "maxLenShort"]);
  const setText = (text) => {
    const limitedText = text.substr(0, maxLen);
    setResponse(limitedText);
  };

  let extra = null;
  const classes = ["sentence-question"];
  if (isLong) classes.push("long");
  else classes.push("short");

  if (isEditting) {
    extra = (
      <IntegerField
        number={maxLen}
        setNumber={setMaxLen}
        onClick={(e) => e.target.select()}
        label="최대 글자수"
      />
    );
  } else {
    const len = typeof response !== "string" ? 0 : response.length;
    extra = (
      <div className="max-len-indicator">
        <p className={len === maxLen ? "red" : ""}>{len + " / " + maxLen}</p>
      </div>
    );
  }

  return (
    <div className={classes.join(" ")}>
      <TextField
        placeholder={isLong ? "장문형 텍스트" : "단답형 텍스트"}
        size={isLong ? "free" : "lg"}
        setText={setText}
        text={typeof response !== "string" ? "" : response}
        disabled={isEditting}
        multiline={isLong}
        tabIndex={tabIndex}
      />
      <div className="extra">{extra}</div>
    </div>
  );
}

export function ShortSentence() {
  return <Sentence isLong={false} />;
}

export function LongSentence() {
  return <Sentence isLong={true} />;
}
