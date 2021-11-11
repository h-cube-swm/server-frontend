import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../../utils/apis";
import { useMessage } from "../../../../contexts/MessageContext";
import { useGlobalState } from "../../../../contexts/GlobalContext";

import "./SurveyDetails.scss";
import logo from "../../../../assets/images/logo.png";
import embedBtn from "../../../../assets/icons/embed.svg";
import duplicate from "../../../../assets/icons/duplicate.svg";
import TextField from "../../../TextField/TextField";
import useOnly from "../../../../hooks/useOnly";
import withSurvey from "../../../../hocs/withSurvey";
import { answerToString, reshapeAnswerTo2DArray } from "../../../../utils/responseTools";
import Table from "../../../Table/Table";
import { SurveyStatus } from "../../../../constants";
import { useModal } from "../../../../contexts/ModalContext";

const HOST = `${window.location.protocol}//${window.location.host}`;

const SurveyDetails = ({ survey, setTimestamp }) => {
  const { id: surveyId, status: surveyStatus, title, description, deployId } = survey;
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState("default");
  const [isDrawOpen, setIsDrawOpen] = useState(false);
  const { token } = useGlobalState();
  const [drawResult, drawError] = API.useDraw(surveyId);
  const { publish } = useMessage();
  const { load } = useModal();

  const handleEmailSend = async () => {
    if (emailState === "loading") return;
    setEmailState("loading");
    const response = await API.putEmail(surveyId, email);
    const error = response[1];
    const status = response[2];

    if (status === 200) {
      setEmailState("success");
    }
    if (status === 400) {
      setEmailState("error");
    }
    if (error) {
      setEmailState("error");
    }
  };

  const handleEmailInput = (text) => {
    setEmail(text);
    if (emailState !== "default") {
      setEmailState("default");
    }
  };

  const onDraw = () => {
    if (surveyStatus !== SurveyStatus.FINISHED) {
      publish("주의❗️ 먼저 설문을 종료해야 추첨을 진행할 수 있습니다.", "warning");
      return;
    }
    setIsDrawOpen(!isDrawOpen);
  };

  const duplicateLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = link;
    linkarea.focus();
    linkarea.select();
    document.execCommand("copy");
    document.body.removeChild(linkarea);
    publish("📎 링크가 복사되었습니다 ✅");
  };

  const duplicateEmbedLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = link;
    linkarea.focus();
    linkarea.select();
    document.execCommand("copy");
    document.body.removeChild(linkarea);
    publish("🖥 임베드 코드가 복사되었습니다 ✅");
  };

  const onSubmit = async (link, status) => {
    const result = await API.putSurveyStatus(link, status);
    if (result[2] === 200) {
      publish("📄 설문이 종료 되었습니다 ✅");
    }
    setTimestamp(Date.now());
  };

  const finishSurvey = (link, status) => {
    // eslint-disable-next-line
    load({
      children: (
        <>
          <h2 style={{ fontWeight: "700", marginTop: "2rem" }}>
            주의❗️ 정말 설문을 종료하시겠습니까?
          </h2>
          <p style={{ fontWeight: "500", marginTop: "2rem", marginBottom: "2rem" }}>
            설문을 종료하면 더이상 응답을 받을 수 없습니다.
            <br />
            <br />
            신중하게 결정해주세요 🤔
          </p>
        </>
      ),
      onSubmit: () => onSubmit(link, status),
      type: "warning",
      submitMessage: "종료",
    });
  };

  if (!token)
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

  let drawContent = (
    <div className="draw-content">
      <div className="draw-loading">
        <div className="loading-dot one" />
        <div className="loading-dot two" />
        <div className="loading-dot three" />
      </div>
    </div>
  );
  if (drawError) {
    if (drawError.response.status === 400) {
      drawContent = (
        <div className="draw-content">
          <div className="draw-message">현재 응답인원이 부족하여 추첨을 진행할 수 없습니다.</div>
        </div>
      );
    } else {
      drawContent = (
        <div className="draw-content">
          <div className="error-message">추첨 진행 중 오류 발생 : {drawError.message}</div>
        </div>
      );
    }
  } else if (drawResult) {
    const [columns, rows] = reshapeAnswerTo2DArray(survey, drawResult.selectedResponses);
    const stringCols = columns.map((x) => x.title);
    const stringRows = rows.map((row) => row.map((cell) => (cell ? answerToString(cell) : "-")));

    drawContent = (
      <div className="draw-content">
        <Table columns={stringCols} rows={stringRows} />
      </div>
    );
  }
  return (
    <div className="survey-details">
      <div className="logo">
        <Link to="/" target="_blank">
          <img src={logo} alt="logo" />
        </Link>
        <h1>설문 세부설정</h1>
      </div>
      <div className="contents-box">
        <div className="section">
          <div className="box one">
            <h1>설문 제목</h1>
            <h2>{title}</h2>
          </div>
          <div className="box two">
            <div className="embed-title">
              <h1>홈페이지에 직접 삽입해보세요.</h1>
              <button
                onClick={() =>
                  duplicateEmbedLink(
                    `<iframe src="${HOST}/forms/survey/response/${deployId}?embed=true"></iframe>`,
                  )
                }>
                <div className="image-border">
                  <img src={embedBtn} alt="" />
                  <p>복사</p>
                </div>
              </button>
            </div>
            <h3>{`<iframe src="${HOST}/forms/survey/response/${deployId}?embed=true"></iframe>`}</h3>
          </div>
          <div className="email box three">
            <h1>
              이메일을 적어주시면
              <br />
              <strong>공유</strong>와 <strong>결과</strong> 링크를 보내드립니다.
            </h1>
            <div className="email-input">
              <div className="email-input-box">
                <TextField
                  placeholder="이메일을 입력하세요"
                  size="lg"
                  setText={handleEmailInput}
                  text={email}
                />
                <hr className="email-underline"></hr>
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
              * 이메일을 보내지 않거나, 링크를 저장해두지 않는 경우 해당 설문에 접근할 수 없습니다.
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
                  <strong>공유</strong>하세요.
                </h1>
                <div className="button-box">
                  <button
                    onClick={() => duplicateLink(`${HOST}/forms/survey/response/${deployId}`)}>
                    <img src={duplicate} alt="duplicate button" />
                    <p>복사</p>
                  </button>
                </div>
              </div>
              <h3>{`${HOST}/forms/survey/response/${deployId}`}</h3>
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
                <div className="button-box">
                  <button onClick={() => duplicateLink(`${HOST}/forms/survey/result/${surveyId}`)}>
                    <img src={duplicate} alt="duplicate button" />
                    <p>복사</p>
                  </button>
                </div>
              </div>
              <h3>{`${HOST}/forms/survey/result/${surveyId}`}</h3>
            </div>
          </div>
          {surveyStatus !== SurveyStatus.FINISHED && (
            <button
              className="box seven"
              onClick={() => finishSurvey(surveyId, SurveyStatus.FINISHED)}>
              <h1>종료하기</h1>
            </button>
          )}
          {survey.draw.isEnabled && (
            <button className={isDrawOpen ? "box eight open" : "box eight"} onClick={onDraw}>
              {isDrawOpen ? (
                <div className="draw">
                  <h1>추첨 결과</h1>
                  <div>{drawContent}</div>
                  <p className="source">
                    해당 설문은{" "}
                    <i>
                      <a href="https://unboxing.monster/" target="_blank" rel="noopener noreferrer">
                        Unboxing Monster
                      </a>
                    </i>
                    의 블록체인 기술을 통해 공정성이 보장된 설문입니다.
                  </p>
                </div>
              ) : (
                <h1>추첨하기</h1>
              )}
            </button>
          )}

          <div className="box nine">
            <Link className="option-btn" to={`/forms/survey/result/${surveyId}`}>
              결과보기
            </Link>
          </div>
          <div className="box ten">
            <Link to="/mypage">마이페이지</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSurvey(SurveyDetails);
