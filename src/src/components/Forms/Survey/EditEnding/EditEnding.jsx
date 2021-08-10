import React, { useState } from "react";
import { Link } from "react-router-dom";
import withSurveyEnding from "../../../../hocs/withSurveyEnding";

import "./EditEnding.scss";
import firework from "../../../../assets/icons/firework.png";
import logo from "../../../../assets/images/logo.png";
import Loading from "../../../Loading/Loading";
import Firework from "../ResponseEnding/Firework/Firework";
import TextField from "../../../TextField/TextField";

const Ending = ({ ending }) => {
  const [email, setEmail] = useState("");

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
              <br />
              이메일을 적어주시면
              <br />
              <strong>배포</strong>와 <strong>결과확인</strong> 링크를
              보내드립니다.
            </h1>
            <div className="email">
              <TextField
                placeholder="abcde@the-form.io"
                size="title"
                setText={setEmail}
                text={email}
              />
              <Link className="btn rg" to="/forms/survey">
                보내기
              </Link>
            </div>
            <p>
              * 이메일을 보내지 않거나, 링크를 저장해두지 않는 경우 <br />
              해당 설문에 접근할 수 없습니다.
            </p>
          </div>
          <Firework />
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
                  {"https://the-form.io/forms/survey/response/" +
                    hash(surveyLink)}
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
