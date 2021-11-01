import React, { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMessage } from "../../contexts/MessageContext";
import API from "../../utils/apis";

// Components
import Header from "../Main/Header";

// SCSS
import "./MyPage.scss";
import Loading from "../Loading/Loading";
import addBtn from "../../assets/icons/add-btn-white.svg";
import etcBtn from "../../assets/icons/etc-btn.svg";
import nextBtn from "../../assets/icons/next-btn.svg";
import Error from "../Error/Error";

const HOST = `${window.location.protocol}//${window.location.host}`;

export default function MyPage() {
  const { publish } = useMessage();
  const [timestmap, setTimestmap] = useState(null);
  // ToDo 함수 이름을 바꾸던가 함수 반환값을 바꾸던가
  const [surveys, error] = API.useUser(timestmap);
  const contents = [];
  const [isScolled, setIsScolled] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const onClick = (i) => {
    setSelectedId(i);
  };

  const onWheel = (e) => {
    const currentScroll = e.deltaY;
    if (currentScroll > 0) {
      setIsScolled(true);
    } else {
      setIsScolled(false);
    }
  };

  if (surveys === null) return <Loading></Loading>;
  if (error) return <Error type="cannot-get-user-info" />;

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
    const status = await API.postCopySurvey(link);
    if (status[2] === 200) {
      publish("📄 설문 사본 생성이 되었습니다 ✅");
    }
    setTimestmap(Date.now());
  };

  const deleteSurvey = async (link) => {
    // eslint-disable-next-line
    const result = window.confirm("정말 삭제하시겠습니까?");
    if (result) {
      const status = await API.deleteSurvey(link);
      if (status === 200) {
        publish("설문을 삭제하였습니다 🗑", "warning");
      }
      setTimestmap(Date.now());
    }
    setSelectedId(null);
  };

  if (surveys.length === 0) {
    contents.push(
      <div className="no-survey">
        아직 작성된 폼이 없습니다.
        <br />
      </div>,
    );
  }

  let isMobile = false;
  if (document.getElementById("root").offsetWidth < 767) {
    isMobile = true;
  }

  surveys.forEach((survey, i) => {
    const createdDate = new Date(survey.createdAt);
    const updatedDate = new Date(survey.updatedAt);
    contents.push(
      // TODO: 컴포넌트화하기
      <div className={i === selectedId ? "survey selected" : "survey"} key={i}>
        <div className="main">
          {survey.title}
          <div className="bottom-bar">
            <button onClick={() => onClick(i)} className="etc-btn">
              <img src={etcBtn} alt="etc button" />
            </button>
          </div>
        </div>
        <div className="options">
          <div className="option-buttons">
            <div className="option-default">
              <button className="option-btn">
                설문 제어하기
                <img src={nextBtn} alt="go to survey control" />
              </button>
              <Link className="option-btn" to={`/forms/survey/result/${survey.id}`}>
                설문 결과보기
              </Link>
              <button className="option-btn" onClick={() => duplicateSurvey(survey.id)}>
                설문 사본 만들기
              </button>
              <button className="option-btn" onClick={() => deleteSurvey(survey.id)}>
                설문 삭제하기
              </button>
            </div>
            <div className="partition" />
            <div className="option-advanced">
              <button className="option-btn">
                공유하기
                <img src={nextBtn} alt="go to survey control" />
              </button>
              <button className="option-btn">
                연동하기
                <img src={nextBtn} alt="go to survey control" />
              </button>
            </div>
          </div>
        </div>
      </div>,
    );
  });

  contents.push(
    <Link className="survey make-survey" to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
      <img src={addBtn} alt="" />
      <h3>설문 만들기</h3>
    </Link>,
  );

  return (
    <div className="my-page" onWheel={onWheel}>
      <Header isScolled={isScolled} />
      <div className="side-bar">
        <div className="section">설문 모아보기</div>
        <div className="section">프로필 설정</div>
      </div>
      <div className="surveys">
        <div className="surveys-inner-box">{contents.reverse()}</div>
      </div>
    </div>
  );
}
