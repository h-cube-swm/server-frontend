import React, { useState } from "react";
import useDefault from "../../../../../../hooks/useDefault";
import { CardStates } from "../../../constants";
import "./ShortSentence.scss";
import TextField from "../../../../../TextField/TextField";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import IntegerField from "../../../../../IntegerField/IntegerField";
import { useQuestion } from "../../../../../../contexts/QuestionContext";

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

  switch (state) {
    case CardStates.RESPONSE:
      return (
        <div className="sentence-question">
          <div className="respoclnse">
            <TextField
              placeholder="답변을 입력하세요"
              size={isLong ? "xl" : "lg"}
              setText={setResponse}
              text={response}
              maxLength={maxLen}
              multiline={isLong}
            />
            <Hider hide={state !== CardStates.RESPONSE}>
              <div className="max-len-indicator">
                {response.length === maxLen ? (
                  <p className="red">{response.length + " / " + maxLen}</p>
                ) : (
                  <p>{response.length + " / " + maxLen}</p>
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
          <TextField
            placeholder={isLong ? "장문형 텍스트" : "단답형 텍스트"}
            size={isLong ? "xl" : "lg"}
            disabled
          />
          <Hider hide={state !== CardStates.EDITTING}>
            <IntegerField
              number={maxLen}
              setNumber={setMaxLen}
              label="최대 글자수"
            />
          </Hider>
        </div>
      );
  }
}

export function ShortSentence() {
  return <Sentence isLong={false} />;
}

export function LongSentence() {
  return <Sentence isLong={true} />;
}
