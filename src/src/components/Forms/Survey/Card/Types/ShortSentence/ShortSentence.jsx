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

  const onChange = (text) => {
    const answer = text;
    if (answer.length <= question.maxLen) {
      setCurLen(answer.length);
    }
    setAnswer(answer);
  };

  switch (state) {
    case CardStates.RESPONSE: // Should be RESPONSE
      return (
        <div className="short-sentence">
          <div className="response">
            <TextField
              placeholder="답변을 입력하세요"
              size="lg"
              setText={onChange}
              text={question.answer}
              maxlength={question.maxLen}
            />
            <Hider hide={state !== CardStates.EDITTING}>
              <div className="max-len-indicator">
                {/* <p className="indicator">현재 / 최대</p> 
                  이 부분은 추후 추가가 될 수 있기에 임시로 주석처리 진행*/}
                {curLen === question.maxLen ? (
                  <p className="red">{curLen + " / " + question.maxLen}</p>
                ) : (
                  <p>{curLen + " / " + question.maxLen}</p>
                )}
              </div>
            </Hider>
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
