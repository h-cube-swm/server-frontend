import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/apis";

// Components
import Header from "../Main/Header";

// SCSS
import "./MyPage.scss";
import Loading from "../Loading/Loading";
import addBtn from "../../assets/icons/add-btn-white.svg";
import Error from "../Error/Error";
import SurveyCard from "./SurveyCard";

export default function MyPage() {
  const [timestamp, setTimestamp] = useState(null);

  // ToDo 함수 이름을 바꾸던가 함수 반환값을 바꾸던가
  const [surveys, error] = API.useUser(timestamp);
  const contents = [];

  if (surveys === null) return <Loading></Loading>;
  if (error) return <Error type="cannot-get-user-info" />;

  if (surveys.length === 0) {
    contents.push(
      <div className="no-survey" key="no-form-exists">
        아직 작성된 폼이 없습니다.
        <br />
      </div>,
    );
  }

  let isMobile = false;
  if (document.getElementById("root").offsetWidth < 767) {
    isMobile = true;
  }

  surveys.forEach((survey) => {
    contents.push(<SurveyCard key={survey.id} survey={survey} setTimestamp={setTimestamp} />);
  });

  if (!isMobile) {
    contents.push(
      <Link
        key="create-survey"
        className="survey make-survey"
        to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
        <img src={addBtn} alt="" />
        <h3>설문 만들기</h3>
      </Link>,
    );
  }

  return (
    <div className="my-page">
      <Header />
      <div className="my-page-inner">
        <div className="surveys">
          <div className="surveys-inner-box">{contents.reverse()}</div>
        </div>
        <div className="side-bar">
          <div className="section">설문 모아보기</div>
        </div>
      </div>
    </div>
  );
}
