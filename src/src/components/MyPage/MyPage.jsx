import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMessage } from "../../contexts/MessageContext";
// import FloatingLogo from "../FloatingLogo/FloatingLogo";
import Header from "../Main/Header";
import "./MyPage.scss";
import API from "../../utils/apis";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

const HOST = `${window.location.protocol}//${window.location.host}`;

export default function MyPage() {
  const { publish } = useMessage();
  const [timestmap, setTimestmap] = useState(null);
  // ToDo 함수 이름을 바꾸던가 함수 반환값을 바꾸던가
  const [surveys, error] = API.useUser(timestmap);
  const contents = [];

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
  };

  const handleMouse = (e) => {
    e
  }

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
      <div key={i} className="survey" onMouseEnter={onMouse} onMouseLeave={outMouse}>
        {survey.status === "published" ? (
          <div className="dot-position">
            <p className="timestamp published">
              {updatedDate.toLocaleString("ko-KR")}
              {"  배포됨"}
            </p>
          </div>
        ) : (
          <div className="dot-position">
            <Tooltip text="아직 설문 작성이 완료되지 않았습니다 🤓" size="lg">
              <div className="dot" />
              <p className="timestamp editing">{createdDate.toLocaleString("ko-KR")}</p>
            </Tooltip>
          </div>
        )}
        <div className="title">
          <h3>{survey.title}</h3>
          <p>{survey.description}</p>
        </div>
        <div className="buttons">
          {survey.status === "published" ? (
            <button className="link published">
              <div key={i} className="tooltip">
                <img src={editBtn} alt="edit survey" />
                <span className="tooltiptext">배포됨</span>
              </div>
            </button>
          ) : (
            <Link
              className="link "
              to={isMobile ? "/forms/survey/mobile" : `/forms/survey/edit/${survey.id}`}>
              <Tooltip text={"편집하기"} size="sm">
                <img src={editBtn} alt="edit survey" />
              </Tooltip>
            </Link>
          )}
          <Link className="link" to={`/forms/survey/result/${survey.id}`}>
            <Tooltip text={"결과보기"} size="sm">
              <img src={resultBtn} alt="open result page" />
            </Tooltip>
          </Link>
          <button className="link" onClick={() => duplicateLink(survey.deployId)}>
            <Tooltip text={"배포링크"} size="sm">
              <img src={linkBtn} alt="dublicate deploy link button" />
            </Tooltip>
          </button>
          <button
            className="link"
            onClick={() =>
              duplicateEmbedLink(
                `<iframe src="${HOST}/forms/survey/response/${survey.deployId}?embed=true"/>`,
              )
            }>
            <Tooltip text={"임베드코드"} size="sm">
              <img src={embedBtn} alt="dublicate embed code button" />
            </Tooltip>
          </button>
          <button className="link temp" onClick={() => duplicateSurvey(survey.id)}>
            <Tooltip text={"사본 만들기"} size="sm">
              <img src={duplicateBtn} alt="dublicate deploy link button" />
            </Tooltip>
          </button>
          <div className="link temp" onClick={() => deleteSurvey(survey.id)}>
            <Tooltip text={"삭제하기"} size="sm">
              <img src={delBtn} alt="delete button" />
            </Tooltip>
          </div>
        </div>
      </div>,
    );
  });

  contents.push(
    <div className="survey">
      <Link
        className="btn long make-survey"
        to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
        <img src={addBtn} alt="" />
        <h3>설문 만들기</h3>
      </Link>
    </div>,
  );

  return (
    <div className="my-page-top">
      <Header />
      <div className="my-page">
        <div className="info">
          <h1>마이페이지</h1>
          <p>제작 중이거나 배포 중인 설문을 관리하는 곳입니다.</p>
          <p>
            배포된 설문을 수정하고 싶으시다면, <em>사본 만들기 기능</em> 을 활용하거나{" "}
            <em>우측 하단 채널톡</em> 을 통해 문의주세요.
          </p>
        </div>
        <div className="surveys">{contents.reverse()}</div>
      </div>
    </div>
  );
}
