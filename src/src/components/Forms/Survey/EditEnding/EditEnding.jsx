import React, { useState } from "react";
import { Link } from "react-router-dom";
import withSurveyEnding from "../../../../hocs/withSurveyEnding";
import API from "../../../../utils/apis";
import { useMessage } from "../../../../contexts/MessageContext";

import "./EditEnding.scss";
import firework from "../../../../assets/icons/firework.png";
import logo from "../../../../assets/images/logo.png";
import duplicate from "../../../../assets/icons/duplicate.svg";
import Firework from "../ResponseEnding/Firework/Firework";
import TextField from "../../../TextField/TextField";
import useOnly from "../../../../hooks/useOnly";

const HOST = `${window.location.protocol}//${window.location.host}`;

const Ending = ({ ending }) => {
  const { surveyId, title, description, surveyLink, resultLink } = ending;

  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState("default");

  const { publish } = useMessage();

  const handleEmailSend = async () => {
    if (emailState === "loading") return;
    setEmailState("loading");
    try {
      const [json] = await API.putEmail(surveyId, email);
      const { status } = json;
      if (status === 200) {
        setEmailState("success");
      }
    } catch (e) {
      setEmailState("error");
    }
  };

  const handleEmailInput = (text) => {
    setEmail(text);
    if (emailState !== "default") {
      setEmailState("default");
    }
  };

  const duplicateLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = link;
    linkarea.focus();
    linkarea.select();
    document.execCommand("copy");
    document.body.removeChild(linkarea);
    publish("링크가 복사되었습니다 ✅");
  };

  useOnly(() => {
    publish(
      "주의❗️ 메일을 보내지 않거나, 링크를 저장해두지 않을 경우 해당 설문에 대한 접근이 불가능합니다.",
      "warning",
    );
  });

  const buttonClasses = ["btn", "rg", "submit-btn"];
  let buttonText = "";

  switch (emailState) {
    case "default":
      buttonText = "보내기";
      break;
    case "loading":
      buttonText = "보내는 중";
      break;
    case "success":
      buttonText = "성공";
      buttonClasses.push("success");
      break;
    case "error":
      buttonText = "오류";
      buttonClasses.push("error");
      break;
    default:
      throw new Error("Unexpected button state");
  }

  return (
    <div className="edit-ending">
      <div className="logo">
        <Link to="/" target="_blank">
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
              <h1>설문 제목</h1>
              <h2>{title}</h2>
            </div>
            <div className="email box t`hree">
              <h1>
                이메일을 적어주시면
                <br />
                <strong>배포</strong>와 <strong>결과확인</strong> 링크를 보내드립니다.
              </h1>
              <div className="email-input">
                <div className="email-input-box">
                  <TextField
                    placeholder="abcde@the-form.io"
                    size="lg"
                    setText={handleEmailInput}
                    text={email}
                  />
                </div>
                <button
                  onClick={handleEmailSend}
                  className={buttonClasses.join(" ")}
                  to="/forms/survey"
                  disabled={emailState !== "default"}>
                  {buttonText}
                </button>
              </div>
              <p>
                * 이메일을 보내지 않거나, 링크를 저장해두지 않는 경우 해당 설문에 접근할 수
                없습니다.
              </p>
            </div>
            <div className="box four">
              <h1>설문 설명</h1>
              <h3>{description}</h3>
            </div>
            <div className="box five">
              <div className="description">
                <div className="explain">
                  <h1>
                    아래 링크를 통해
                    <br />
                    <strong>배포</strong>하세요.
                  </h1>
                  <button
                    onClick={() => duplicateLink(`${HOST}/forms/survey/response/${surveyLink}`)}>
                    <img src={duplicate} alt="duplicate button" />
                  </button>
                </div>

                <h3>{`${HOST}/forms/survey/response/${surveyLink}`}</h3>
              </div>
            </div>
            <div className="box six">
              <div className="description">
                <div className="explain">
                  <h1>
                    아래 링크를 통해
                    <br />
                    <strong>결과</strong>를 확인하세요.
                  </h1>
                  <button
                    onClick={() => duplicateLink(`${HOST}/forms/survey/result/${resultLink}`)}>
                    <img src={duplicate} alt="duplicate button" />
                  </button>
                </div>

                <h3>{`${HOST}/forms/survey/result/${resultLink}`}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSurveyEnding(Ending);
