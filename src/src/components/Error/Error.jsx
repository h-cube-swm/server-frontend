import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Chaos from "../Chaos/Chaos";
import "./Error.scss";

export default function Error({ match }) {
  const type = match.params.type;

  let contents = null;
  switch (type) {
    case "published": // published 된 설문을 edit으로 들어갈 때
      contents = (
        <div className="contents">
          <h1>이미 배포된 설문입니다.</h1>
        </div>
      );
      break;
    case "404": // 404
      contents = (
        <div className="contents">
          <h1>404</h1>;
        </div>
      );
      break;
    case "wrongResultId":
      contents = (
        <div className="contents">
          <h1>설문 결과 링크를 잘못 복사한 것 같습니다.</h1>
          <p>혹시 빠트린 글자가 없는지 확인해보세요.</p>
        </div>
      );
      break;
    case "unexpected":
      contents = (
        <div className="contents">
          <h1>예상치 못한 에러가 발생하였습니다. </h1>
          <p>
            하단 <strong>채널톡</strong>을 통해 문의주시면 감사드리겠습니다.
          </p>
        </div>
      );
      break;

    default:
      contents = (
        <div className="contents">
          <h1>
            <span className="hidden">존재하지 않는</span> 경로입니다.
          </h1>
        </div>
      );
      break;
  }

  return (
    <div className="error">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      {contents}
    </div>
  );
}
