import React from "react";
import FloatingLogo from "components/FloatingLogo/FloatingLogo";
import Title from "components/Title/Title";
import "./Error.scss";

export default function Error({ type }) {
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
    case "finished-survey":
      contents = (
        <>
          <h1>이미 종료된 설문입니다.</h1>
        </>
      );
      break;

    case "editing-survey":
      contents = (
        <>
          <h1>수정 중인 설문입니다.</h1>
        </>
      );
      break;

    case "not-found":
      contents = <h1>존재하지 않는 경로입니다.</h1>;
      break;

    default:
      contents = (
        <>
          <h1>예상치 못한 에러가 발생하였습니다. </h1>
          {type === "cannot-get-user-info" ? (
            <p>
              로그아웃 후에 다시 한번 <strong>로그인</strong>해 보시겠어요? :)
            </p>
          ) : (
            <p>
              에러가 지속된다면 하단 <strong>채널톡</strong>을 통해 문의주시면 감사드리겠습니다.
            </p>
          )}
        </>
      );
      break;
  }

  return (
    <>
      <Title>Error</Title>
      <div className="error">
        <FloatingLogo />
        <div className="container">{contents}</div>
        <div className="error-code">Error Code : {type}</div>
      </div>
    </>
  );
}
