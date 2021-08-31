import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useMessage } from "../../contexts/MessageContext";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./MyPage.scss";
import API from "../../utils/apis";
import Loading from "../Loading/Loading";

import linkBtn from "../../assets/icons/link-btn.svg";
import embedBtn from "../../assets/icons/embed-btn.svg";
import resultBtn from "../../assets/icons/result-btn.svg";

const HOST = `${window.location.protocol}//${window.location.host}`;

export default function MyPage() {
  const { publish } = useMessage();
  // ToDo 함수 이름을 바꾸던가 함수 반환값을 바꾸던가
  const [surveys, error] = API.useUser();
  if (surveys === null) return <Loading></Loading>;
  if (error) return <Redirect to="/error/unexpected/cannot-get-user-info"></Redirect>;

  const duplicateLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = `${HOST}/forms/survey/response/${link}`;
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

  const contents = [];
  if (surveys.length === 0) {
    contents.push(
      <div className="no-survey">
        아직 작성된 폼이 없습니다.
        <br />
      </div>,
    );
  }
  surveys.forEach((survey, i) => {
    contents.push(
      <div className="survey">
        <Link className={"status " + survey.status} to={`/forms/survey/edit/${survey.id}`}>
          {survey.status === "published" ? <p key={i}>완성</p> : <p key={i}>편집하기</p>}
        </Link>
        <div className="title">
          <h3>{survey.title}</h3>
        </div>
        <Link className="link" to={`/forms/survey/result/${survey.id}`}>
          <img src={resultBtn} alt="open result page" />
        </Link>
        <button className="link" onClick={() => duplicateLink(survey.deployId)}>
          <img src={linkBtn} alt="dublicate deploy link button" />
        </button>
        <button
          className="link"
          onClick={() =>
            duplicateEmbedLink(
              `<iframe src="${HOST}/forms/survey/response/${survey.deployId}?embed=true"/>`,
            )
          }>
          <img src={embedBtn} alt="dublicate embed code button" />
        </button>
      </div>,
    );
  });

  let isMobile = false;
  if (document.getElementById("root").offsetWidth < 767) {
    isMobile = true;
  }

  return (
    <div className="my-page">
      <FloatingLogo />
      <Link
        className="btn long make-survey"
        to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
        설문조사
        <br />
        만들기
      </Link>
      <div className="info">
        <h1>
          안녕하세요.
          <br />더 폼 나는 <strong>동녘</strong>님
        </h1>
      </div>
      <div className="partition" />
      <div className="surveys">
        <h2>
          <strong>동녘</strong>님의 폼
        </h2>
        {contents}
      </div>
    </div>
  );
}
