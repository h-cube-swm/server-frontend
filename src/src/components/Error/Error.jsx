import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Chaos from "../../utils/Chaos";
import "./Error.scss";

export default function Error({ match }) {
  const type = match.params.type;

  let contents = null;
  switch (type) {
    case "published": // published 된 설문을 edit으로 들어갈 때
      contents = <h1>이미 배포된 설문입니다.</h1>;
      break;
    case "404": // 404
      contents = <h1>404</h1>;
      break;
    case "wrongResultId":
      contents = (
        <>
          <h1>설문 결과 링크를 잘못 복사한 것 같습니다.</h1>
          <p>혹시 빠트린 글자가 없는지 확인해보세요.</p>
        </>
      );
      break;
    case "unexpected":
      contents = (
        <>
          <h1>에상하지 못한 에러가 발생하였습니다! </h1>
          <p>연락 부탁!!</p>
        </>
      );

    default:
      contents = <h1>존재하지 않는 경로입니다.</h1>;
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
      <Chaos />
    </div>
  );
}
