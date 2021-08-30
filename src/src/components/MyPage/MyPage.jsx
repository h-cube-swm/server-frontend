import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useMessage } from "../../contexts/MessageContext";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./MyPage.scss";
import API from "../../utils/apis";
import Loading from "../Loading/Loading";

export default function MyPage() {
  const { publish } = useMessage();
  // ToDo 함수 이름을 바꾸던가 함수 반환값을 바꾸던가
  const [surveys, error] = API.useUser();
  if (surveys === null) return <Loading></Loading>;
  if (error) return <Redirect to="/error/unexpected/cannot-get-user-info"></Redirect>;

  const duplicateLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = `https://the-form.io/forms/survey/response/${link}`;
    linkarea.focus();
    linkarea.select();
    document.execCommand("copy");
    document.body.removeChild(linkarea);
    publish("📎 링크가 복사되었습니다 ✅");
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
  surveys.forEach((survey) => {
    contents.push(
      <div className="survey">
        <div className="title">
          <h3>{survey.title}</h3>
        </div>
        <Link className="result" to={`/forms/survey/result/${survey.id}`}>
          결과보기
        </Link>
        <button className="link" onClick={() => duplicateLink(survey.deployId)}>
          응답링크
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
