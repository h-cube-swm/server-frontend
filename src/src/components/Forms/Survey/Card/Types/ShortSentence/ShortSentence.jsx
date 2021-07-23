import React, { useState } from "react";
import useDefault from "../../../../../../utils/useDefault";
import { CardStates } from "../../../constants";
import "./ShortSentence.scss";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import IntegerField from "../../../../../IntegerField/IntegerField";

export default function ShortSentence({
  question,
  state,
  setQuestion,
  setResponse,
}) {
  const [curLen, setCurLen] = useState(0);
  const setAnswer = setNestedState(setQuestion, ["answer"]);
  const setMaxLen = setNestedState(setQuestion, ["maxLen"]);

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

  switch (state) {
    case CardStates.RESPONSE:
      return (
        <div className="short-sentence">
          <div className="short-sentence-box">
            <div className="response">
              <TextField
                placeholder="답변을 입력해주세요."
                size="lg"
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
