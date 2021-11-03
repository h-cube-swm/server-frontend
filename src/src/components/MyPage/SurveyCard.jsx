import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMessage } from "../../contexts/MessageContext";
import { SurveyStatus } from "../../constants";
import API from "../../utils/apis";

import "./SurveyCard.scss";
import etcBtn from "../../assets/icons/etc-btn.svg";
import whiteEtcBtn from "../../assets/icons/etc-btn1.svg";
import nextBtn from "../../assets/icons/next-btn.svg";
import prevBtn from "../../assets/icons/prev-btn.svg";

const HOST = `${window.location.protocol}//${window.location.host}`;

export default function SurveyCard({ survey, setTimestamp }) {
  const { publish } = useMessage();
  const [selectedOption, setSelectedOption] = useState(null);
  const createdDate = new Date(survey.createdAt).toLocaleDateString("ko-KR");
  const updatedDate = new Date(survey.updatedAt).toLocaleDateString("ko-KR");
  const surveyId = survey.id;
  const surveyStatus = survey.status;
  let mention = `${updatedDate} 생성됨`;

  const Options = {
    DEFAULT: "default",
    SHARING: "sharing",
    EXPANDING: "expanding",
  };

  const onPrev = () => {
    if (selectedOption === Options.DEFAULT) {
      setSelectedOption(null);
      return;
    }
    setSelectedOption(Options.DEFAULT);
  };

  const duplicateLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = `${HOST}/forms/survey/response/${link}`;
    linkarea.focus();
    linkarea.select();
    document.execCommand("copy");
    document.body.removeChild(linkarea);
    publish("📎 배포 링크가 복사되었습니다 ✅");
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

  const duplicateSurvey = async (link) => {
    const result = await API.postCopySurvey(link);
    if (result[2] === 200) {
      publish("📄 설문 사본 생성이 되었습니다 ✅");
    }
    setTimestamp(Date.now());
    setSelectedOption(null);
  };

  const finishSurvey = async (link, status) => {
    const alert = window.confirm("정말 종료하시겠습니까?");
    if (alert) {
      const result = await API.putSurveyStatus(link, status);
      if (result[2] === 200) {
        publish("📄 설문이 종료 되었습니다 ✅");
        setTimestamp(Date.now());
        setSelectedOption(null);
      }
    }
  };

  const deleteSurvey = async (link) => {
    const alert = window.confirm("정말 삭제하시겠습니까?");
    if (alert) {
      const result = await API.deleteSurvey(link);
      if (result === 200) {
        publish("설문을 삭제하였습니다 🗑", "warning");
      }
      setTimestamp(Date.now());
      setSelectedOption(null);
    }
  };

  if (surveyStatus === SurveyStatus.FINISHED) {
    mention = `${updatedDate} 종료됨`;
  } else if (surveyStatus === SurveyStatus.PUBLISHED) {
    mention = `${updatedDate} 배포됨`;
  }

  return (
    <div className={surveyStatus !== SurveyStatus.FINISHED ? "survey" : "survey finished"}>
      <div className="main">
        <Link
          className="survey-title"
          to={
            surveyStatus !== SurveyStatus.FINISHED
              ? `/forms/survey/edit/${surveyId}`
              : `/forms/survey/result/${surveyId}`
          }>
          {survey.title}
        </Link>

        <div className="bottom-bar">
          <h3>{mention}</h3>
          <button onClick={() => setSelectedOption(Options.DEFAULT)} className="etc-btn">
            {surveyStatus !== SurveyStatus.FINISHED ? (
              <img src={etcBtn} alt="etc button" />
            ) : (
              <img src={whiteEtcBtn} alt="etc button" />
            )}
          </button>
        </div>
      </div>
      <div className={selectedOption === Options.DEFAULT ? "options selected" : "options"}>
        <div className="option-buttons">
          <div className="option-default">
            <button className="prev-btn" onClick={onPrev}>
              <img src={prevBtn} alt="previous step" />
            </button>
            <Link className="option-btn" to={`/forms/survey/result/${surveyId}`}>
              결과보기
            </Link>
            <button className="option-btn" onClick={() => duplicateSurvey(surveyId)}>
              사본 만들기
            </button>
            {surveyStatus !== SurveyStatus.FINISHED && (
              <button
                className="option-btn"
                onClick={() => finishSurvey(surveyId, SurveyStatus.FINISHED)}>
                종료하기
              </button>
            )}
            <button className="option-btn delete" onClick={() => deleteSurvey(surveyId)}>
              삭제하기
            </button>
          </div>
          <div className="partition" />
          <div className="option-advanced">
            <button className="option-btn" onClick={() => setSelectedOption(Options.SHARING)}>
              공유하기
              <img src={nextBtn} alt="go to survey control" />
            </button>
            <button className="option-btn" onClick={() => setSelectedOption(Options.EXPANDING)}>
              연동하기
              <img src={nextBtn} alt="go to survey control" />
            </button>
          </div>
        </div>
      </div>
      <div className={selectedOption === Options.SHARING ? "options selected" : "options"}>
        <div className="option-buttons">
          <button className="prev-btn" onClick={onPrev}>
            <img src={prevBtn} alt="previous step" />
          </button>
          <button className="option-btn" onClick={() => duplicateLink(surveyId)}>
            링크 복사하기
          </button>
          <button className="option-btn" onClick={() => duplicateEmbedLink(surveyId)}>
            임베드코드 복사하기
          </button>
        </div>
      </div>
      <div className={selectedOption === Options.EXPANDING ? "options selected" : "options"}>
        <div className="option-buttons">
          <button className="prev-btn" onClick={onPrev}>
            <img src={prevBtn} alt="previous step" />
          </button>
          <button className="option-btn">API 연동</button>
        </div>
      </div>
    </div>
  );
}
