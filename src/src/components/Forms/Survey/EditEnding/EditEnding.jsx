import React from "react";
import { Link } from "react-router-dom";
import withSurveyEnding from "../../../../hocs/withSurveyEnding";

import "./EditEnding.scss";
import firework from "../../../../assets/icons/firework.png";
import logo from "../../../../assets/images/logo.png";
import Loading from "../../../Loading/Loading";
import Firework from "../ResponseEnding/Firework/Firework";

const Ending = ({ ending }) => {
  if (!ending) {
    return <Loading />;
  }

  const { title, description, surveyLink, resultLink } = ending;

  return (
    <div className="edit-ending">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="contents-box">
        <div className="celebrate-box">
          <div className="celebrate-sentence">
            <img src={firework} alt="celebrating firework" />
            <h1>
              축하합니다. <br />
              설문을 완성했습니다. <br />
              이제 배포만 남았습니다!
            </h1>
          </div>
          <Firework />
          <Link className="btn lg" to="/forms/survey">
            홈으로
          </Link>
        </div>
        <div className="service-box">
          <div className="section">
            <div className="box one">
              <div className="description">
                <h1>설문 제목</h1>
                <h2>{title}</h2>
              </div>
            </div>
            <div className="box four">
              <div className="description">
                <h1>설문 설명</h1>
                <h3>{description}</h3>
              </div>
            </div>
            <div className="box five">
              <div className="description">
                <h1>
                  아래 링크를 통해
                  <br />
                  사람들에게 <strong>배포</strong>하세요.
                </h1>
                <h3>
                  {"https://the-form.io/forms/survey/response/" + surveyLink}
                </h3>
              </div>
            </div>
            <div className="box six">
              <div className="description">
                <h1>
                  아래 링크를 통해
                  <br />
                  <strong>결과</strong>를 확인하세요.
                </h1>
                <h3>
                  {"https://the-form.io/forms/survey/result/" + resultLink}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSurveyEnding(Ending);
