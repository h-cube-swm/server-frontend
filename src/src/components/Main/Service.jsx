import React, { useState } from "react";
import { QuestionProvider } from "../../contexts/QuestionContext";
import Card from "../Forms/Survey/Card/Card";
import { CardStates } from "../Forms/Survey/constants";
import getQuestion from "../Forms/Survey/getQuestion";
import QuestionCommon from "../Forms/Survey/QuestionCommon/QuestionCommon";
import ChoiceView from "../Forms/Survey/Result/ViewTypes/ChoiceView/ChoiceView";
import useDefault from "../../hooks/useDefault";
import { CardTypes } from "../Forms/Survey/constants";

/* Assets */
import "./Service.scss";

const [_, _question] = getQuestion(0);
const defaultAnswers = [
  { 0: true },
  { 0: true },
  { 1: true },
  { 1: true },
  { 2: true },
];
_question.type = CardTypes.MULTIPLE_CHOICE;

function Service() {
  const [question, setQuestion] = useState(_question);
  const [response, setResponse] = useState({});
  const isInit = useDefault(setQuestion, {
    choices: ["마음껏", "테스트", "해보세요"],
  });

  if (!isInit) return null;
  return (
    <div className="service">
      <div className="section">
        <div className="text two">
          <h1>간단하게,</h1>
          <h1>직관적으로,</h1>
          <h1>멋지게,</h1>
          <h1>만들고</h1>
        </div>
        <div className="box one">
          <QuestionProvider
            question={question}
            setQuestion={setQuestion}
            state={CardStates.EDITTING}>
            <QuestionCommon />
          </QuestionProvider>
        </div>
        <div className="text three">
          <h1>편하게,</h1>
          <h1>쉽게,</h1>
          <h1>빠르게,</h1>
          <h1>응답하고</h1>
        </div>
        <div className="box four">
          <QuestionProvider
            question={question}
            state={CardStates.RESPONSE}
            response={response}
            setResponse={setResponse}>
            <QuestionCommon />
          </QuestionProvider>
        </div>
        <div className="text six">
          <h1>더 폼 나게</h1>
          <h1>결과를 확인합니다.</h1>
        </div>
        <div className="box five">
          <ChoiceView
            question={question}
            answers={[response].concat(defaultAnswers)}
          />
        </div>
      </div>
      <div className="phrase">
        <h1>이렇게나 묻고 답하기 좋은 폼이</h1>
        <h1>여기, 있습니다.</h1>
      </div>
    </div>
  );
}

export default Service;
