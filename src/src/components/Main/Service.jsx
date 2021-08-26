import { Link } from "react-router-dom";
import React, { useState } from "react";
import { QuestionProvider } from "../../contexts/QuestionContext";
import getQuestion from "../Forms/Survey/getQuestion";
import QuestionCommon from "../Forms/Survey/QuestionCommon/QuestionCommon";
import ChoiceView from "../Forms/Survey/Result/ViewTypes/ChoiceView/ChoiceView";
import { CardStates, CardTypes } from "../../constants";

/* Assets */
import "./Service.scss";

const initQuestion = getQuestion(0)[1];
const defaultAnswers = [{ 0: true }, { 0: true }, { 1: true }, { 1: true }, { 2: true }];
initQuestion.type = CardTypes.MULTIPLE_CHOICE;
initQuestion.choices = ["마음껏", "테스트", "해보세요"];

function Service() {
  const [question, setQuestion] = useState(initQuestion);
  const [response, setResponse] = useState({});

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
          <ChoiceView question={question} answers={[response].concat(defaultAnswers)} />
        </div>
      </div>
      <div className="phrase">
        <h1>이렇게나 묻고 답하기 좋은 폼이</h1>
        <h1>여기, 있습니다.</h1>
      </div>
      <Link className="btn long make-survey-btn" to="/forms/survey">
        설문조사 만들기
      </Link>
    </div>
  );
}

export default Service;
