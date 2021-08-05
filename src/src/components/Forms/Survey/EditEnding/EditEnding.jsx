import React from "react";
import { Link } from "react-router-dom";
import withSurveyEnding from "../../../../hocs/withSurveyEnding";

import "./EditEnding.scss";
import logo from "../../../../assets/images/logo.png";
import Loading from "../../../Loading/Loading";

const Ending = ({ ending }) => {
  if (!ending) {
    return <Loading />;
  }

  const { title, description, surveyLink, resultLink } = ending;

  return (
    <div className="ending-page">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <h1 className="celebrate-sentence">
        축하합니다. 설문을 완성했습니다.
        <br />
        이제 배포만 남았습니다.
      </h1>
      <div className="survey-sum">
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
      <Link className="btn lg" to="/">
        홈으로
      </Link>
    </div>
  );
};

export default withSurveyEnding(Ending);
