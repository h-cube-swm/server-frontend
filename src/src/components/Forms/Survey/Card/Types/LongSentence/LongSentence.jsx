import React, { useState } from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../utils/useDefault";
import "./LongSentence.scss";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import IntegerField from "../../../../../IntegerField/IntegerField";

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

  const onChange = (text) => {
    const answer = text;
    if (answer.length <= question.maxNum) {
      setCurLen(answer.length);
    }
    setAnswer(answer);
  };

  switch (state) {
    case CardStates.RESPONSE: // Should be RESPONSE
      return (
        <div className="long-sentence">
          <div className="response">
            <TextField
              placeholder="답변을 입력하세요"
              size="xl"
              setText={onChange}
              text={question.answer}
              maxlength={question.maxNum}
              multiline
            />
            <Hider hide={state !== CardStates.EDITTING}>
              <div className="max-len-indicator">
                {/* <p className="indicator">현재 / 최대</p> 
                  이 부분은 추후 추가가 될 수 있기에 임시로 주석처리 진행*/}
                {curLen === question.maxNum ? (
                  <p className="red">{curLen + " / " + question.maxNum}</p>
                ) : (
                  <p>{curLen + " / " + question.maxNum}</p>
                )}
              </div>
            </Hider>
          </div>
        </div>
      );

    case CardStates.EDITTING:
    default:
      return (
        <div className="long-sentence">
          <TextField placeholder="장문형 텍스트" size="xl" disabled />
          <Hider hide={state !== CardStates.EDITTING}>
            <IntegerField
              number={question.maxNum}
              setNumber={setMaxNum}
              label="최대 글자수"
            />
          </Hider>
        </div>
      );
  }
}
