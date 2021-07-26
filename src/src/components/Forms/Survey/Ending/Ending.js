import React from "react";
import { Link } from "react-router-dom";
import withSurveyEnding from "../../../../hocs/withSurveyEnding";

import "./Ending.scss";
import logo from "../../../../assets/images/logo.png";

const Ending = ({ title, description, surveyLink, resultLink }) => {
  return (
    <div className="ending-page">
      <h1 className="celebrate-sentence">
        축하합니다. 설문을 완성했습니다.
        <br />
        이제 배포만 남았습니다.
      </h1>
      <div className="survey-sum">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <h1>{title}</h1>
        <h2>{description}</h2>
        <ul>
          <li>
            <h3>배포링크</h3>
            <p>{"https://the-form.io/forms/survey/response/" + surveyLink}</p>
          </li>
          <li>
            <h3>결과링크</h3>
            <p>{"https://the-form.io/forms/survey/result/" + resultLink}</p>
          </li>
        </ul>
      </div>
      <Link className="link-btn-lg" to="/">
        홈으로
      </Link>
    </div>
  );
};

export default withSurveyEnding(Ending);
