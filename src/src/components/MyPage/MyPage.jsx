import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMessage } from "../../contexts/MessageContext";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./MyPage.scss";
import API from "../../utils/apis";
import Loading from "../Loading/Loading";
import Tooltip from "../Tooltip/Tooltip";

import linkBtn from "../../assets/icons/link-btn.svg";
import embedBtn from "../../assets/icons/embed-btn.svg";
import resultBtn from "../../assets/icons/result-btn.svg";
import delBtn from "../../assets/icons/del-btn-big.svg";
import addBtn from "../../assets/icons/add-btn.svg";
import editBtn from "../../assets/icons/edit-btn.svg";

const HOST = `${window.location.protocol}//${window.location.host}`;

export default function MyPage() {
  const { publish } = useMessage();
  const [timestmap, setTimestmap] = useState(null);
  // ToDo 함수 이름을 바꾸던가 함수 반환값을 바꾸던가
  const [surveys, error] = API.useUser(timestmap);
  const contents = [];

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

  const onMouse = (e) => {
    e.currentTarget.className = "survey appear";
  };

  const outMouse = (e) => {
    e.currentTarget.className = "survey";
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
    contents.push(
      <div key={i} className="survey" onMouseEnter={onMouse} onMouseLeave={outMouse}>
        {survey.status !== "published" && (
          <div className="dot-position">
            <Tooltip text="아직 설문 작성이 완료되지 않았습니다 🤓" size="md">
              <div className="dot" />
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
          <div className="link" onClick={() => deleteSurvey(survey.id)}>
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
    <div className="my-page">
      <FloatingLogo />

      <div className="info">
        <h1>마이페이지</h1>
      </div>
      <div className="surveys">{contents.reverse()}</div>
    </div>
  );
}
