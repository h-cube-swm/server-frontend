import { Link } from "react-router-dom";
import React, { useState } from "react";
import { QuestionProvider } from "../../contexts/QuestionContext";
import getQuestion from "../Forms/Survey/getQuestion";
import QuestionCommon from "../Forms/Survey/QuestionCommon/QuestionCommon";
import ChoiceView from "../Forms/Survey/Result/ViewTypes/ChoiceView/ChoiceView";
import { CardStates, CardTypes } from "../../constants";

/* Assets */
import "./Service.scss";
import circle1 from "../../assets/icons/circles/1.svg";
import circle2 from "../../assets/icons/circles/2.svg";
import circle3 from "../../assets/icons/circles/3.svg";
import circle4 from "../../assets/icons/circles/4.svg";
import circle5 from "../../assets/icons/circles/5.svg";
import circle6 from "../../assets/icons/circles/6.svg";
import branchingPage from "../../assets/images/branching-page.svg";
import editingPage from "../../assets/images/edit-page.svg";
import autoSuggestionPage from "../../assets/images/auto-suggestion-page.svg";
import sharingPage from "../../assets/images/sharing-page.svg";

const initQuestion = getQuestion(0)[1];
const defaultAnswers = [{ 0: true }, { 0: true }, { 1: true }, { 1: true }, { 2: true }];
initQuestion.type = CardTypes.MULTIPLE_CHOICE;
initQuestion.choices = ["마음껏", "테스트", "해보세요"];

function Service() {
  const [question, setQuestion] = useState(initQuestion);
  const [response, setResponse] = useState({});

  return (
    <div className="service">
      <div className="phrase">
        <h1>이렇게나 묻고 답하기 좋은 폼이</h1>
        <h1>여기, 있습니다.</h1>
      </div>
      <div className="user-set">
        <div className="box one">
          <img src={circle1} alt="circle" />
          <h1>학생도</h1>
          <p>자료조사하고, 동아리 신청서를 받거나, 친구들의 의견을 구해요.</p>
        </div>
        <div className="box two">
          <img src={circle2} alt="circle" />
          <h1>마케터도</h1>
          <p>시장을 분석하고, 다양한 자료분석 도구를 통해 날카로운 인사이트를 얻어봐요.</p>
        </div>
        <div className="box three">
          <img src={circle3} alt="circle" />
          <h1>인사팀도</h1>
          <p>지원서를 만들고 더 멋진 직원과 마주할 기회를 늘려보세요.</p>
        </div>
        <div className="box four">
          <img src={circle4} alt="circle" />
          <h1>제작자도</h1>
          <p>사람들에게 자신이 만든 물건을 멋지게 팔 수 있는 주문서를 만들 수 있어요.</p>
        </div>
        <div className="box five">
          <img src={circle5} alt="circle" />
          <h1>기획자도</h1>
          <p>기획한 행사나 제품에 대해 피드백을 구하고 더 좋은 다음을 만들어 보세요.</p>
        </div>
        <div className="box six">
          <img src={circle6} alt="circle" />
          <h1>어디서든</h1>
          <p>마음껏 폼나게 만들어 보세요.</p>
        </div>
      </div>
      <div className="key-function">
        <div className="page zero">
          <h1>
            안녕하세요.
            <br />더 폼 나는 설문조사
            <br />더 폼 입니다.
          </h1>
          <img src={editingPage} alt="editing page" />
        </div>
        <div className="page one">
          <div className="description">
            <h1>1. 직관적으로 빠르게 만드세요.</h1>
            <p>
              어느 플랫폼에서도 보지 못한 직관적이고 빠른 방식을 제공합니다.
              <br />
              여길 누르면 될 것 같은데? 이걸 이렇게 이으면 될 것 같은데?
              <br />
              하면 대체로 맞습니다.
            </p>
          </div>
          <img src={branchingPage} alt="branching page" />
        </div>
        <div className="page two">
          <div className="description">
            <h1>2. 막막해하지 않아도 됩니다. 쉽게 만드세요.</h1>
            <p>
              폼을 만들 때, 우리는 어떤 질문이 맞는 질문인지 참 햇갈립니다.
              <br />
              그럴 때 저희에게 조금만 힌트를 주세요.
              <br />
              그럼 저희가 완성해드리겠습니다.
              <br />
              <em>* 해당 기능은 추후 제공될 예정입니다.</em>
            </p>
          </div>
          <img src={autoSuggestionPage} alt="auto suggestion page" />
        </div>
        <div className="page three">
          <div className="description">
            <h1>3. 널리 이롭게 퍼뜨리세요.</h1>
            <p>
              당연히 제공되는 링크 공유와 임베드코드.
              <br />
              버튼 한 번이면 바로 당신의 손에 폼이 들려있습니다.
              <br />
              뿐만 아니라 다양한 API나 분석툴과도 연계해드립니다.
              <br />
              <em>* API 연동은 추후 제공될 예정입니다.</em>
            </p>
          </div>
          <img src={sharingPage} alt="sharing page" />
        </div>
      </div>
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

      <Link className="btn long make-survey-btn" to="/forms/survey">
        설문조사 만들기
      </Link>
    </div>
  );
}

export default Service;
