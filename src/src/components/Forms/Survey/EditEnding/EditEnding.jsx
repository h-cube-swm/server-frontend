import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import withSurveyEnding from "../../../../hocs/withSurveyEnding";
import { API } from "../../../../utils/apis";

import "./EditEnding.scss";
import firework from "../../../../assets/icons/firework.png";
import logo from "../../../../assets/images/logo.png";
import Firework from "../ResponseEnding/Firework/Firework";
import TextField from "../../../TextField/TextField";
import { hash } from "../../../../utils/hasher";

const Ending = ({ ending }) => {
  const [email, setEmail] = useState("");
  const defaultBtnClasses = ["btn", "rg", "submit-btn"];
  const [btnClasses, setBtnClasses] = useState(defaultBtnClasses);
  const [isLoading, setIsLoading] = useState(false);
  const { surveyId, title, description, surveyLink, resultLink } = ending;
  const onClick = async () => {
    setIsLoading(true);
    try {
      const [json] = await API.putEmail(surveyId, email);
      const { status } = json;
      if (status === 200) {
        const newBtnClasses = [...btnClasses, "success"];
        setBtnClasses(newBtnClasses);
        setIsLoading(false);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setBtnClasses(defaultBtnClasses);
  }, [email]);

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
            </h1>
          </div>
          <Firework />
          <Link className="btn rg home-btn" to="/">
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
            <div className="email box three">
              <h1>
                이메일을 적어주시면
                <br />
                <strong>배포</strong>와 <strong>결과확인</strong> 링크를
                보내드립니다.
              </h1>
              <div className="email-input">
                <TextField
                  placeholder="abcde@the-form.io"
                  size="lg"
                  setText={setEmail}
                  text={email}
                />
                <button
                  onClick={onClick}
                  className={btnClasses.join(" ")}
                  to="/forms/survey"
                  disabled={btnClasses.includes("success") || isLoading}>
                  {isLoading
                    ? "보내는 중"
                    : btnClasses.includes("success")
                    ? "성공"
                    : "보내기"}
                </button>
              </div>
              <p>
                * 이메일을 보내지 않거나, 링크를 저장해두지 않는 경우 해당
                설문에 접근할 수 없습니다.
              </p>
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
