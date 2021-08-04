import React, { useState } from "react";
import { QuestionProvider } from "../../contexts/QuestionContext";
import Card from "../Forms/Survey/Card/Card";
import { CardStates } from "../Forms/Survey/constants";
import getQuestion from "../Forms/Survey/getQuestion";
import QuestionCommon from "../Forms/Survey/QuestionCommon/QuestionCommon";
import "./Service.scss";
import ChoiceView from "../Forms/Survey/Result/ViewTypes/ChoiceView/ChoiceView";
import useDefault from "../../hooks/useDefault";

const [_, _question] = getQuestion(0);
const defaultAnswers = [
  { 0: true },
  { 0: true },
  { 1: true },
  { 1: true },
  { 2: true },
];

function Service() {
  const [question, setQuestion] = useState(_question);
  const [response, setResponse] = useState({});
  const isInit = useDefault(setQuestion, {
    choices: ["마음껏", "테스트", "해보세요"],
  });

  console.log(isInit, question);
  if (!isInit) return null;
  return (
    <div className="service">
      <div className="section one">
        <QuestionProvider
          question={question}
          setQuestion={setQuestion}
          state={CardStates.EDITTING}>
          <QuestionCommon />
        </QuestionProvider>
      </div>
      <div className="section two">
        <QuestionProvider
          question={question}
          state={CardStates.RESPONSE}
          response={response}
          setResponse={setResponse}>
          <QuestionCommon />
        </QuestionProvider>
      </div>
      <div className="section three">
        <ChoiceView
          question={question}
          answers={[response].concat(defaultAnswers)}
        />
      </div>
    </div>
  );
}

export default Service;
