import React from "react";
import API from "utils/apis";
import FloatingLogo from "components/FloatingLogo/FloatingLogo";

import "./DrawCheck.scss";
import unboxingBadge from "assets/images/unboxing-badge.png";

export default function DrawCheck({ match, location }) {
  const hash = location.hash.replace("#", "");
  const [draw, error] = API.useDraw(match.params.link, "response");

  let drawContent = null;
  let isWinner = false;
  const isDrawAvailable = !error && draw;

  if (error) {
    drawContent = (
      <div className="draw-content">
        <p className="not-finished">설문이 아직 종료되지 않았습니다.</p>
        <p className="not-finished">설문이 종료된 후에 다시 방문해주시기 바랍니다.</p>
      </div>
    );
  } else if (!draw) {
    drawContent = (
      <div className="draw-content">
        <div className="draw-loading">
          <div className="loading-dot one" />
          <div className="loading-dot two" />
          <div className="loading-dot three" />
        </div>
      </div>
    );
  } else {
    drawContent = (
      <div className="draw-content">
        <h2 className="draw-result-title">당첨자 고유값</h2>
        {draw.selectedResponses.map((x) => {
          if (x === hash) {
            isWinner = true;
            return (
              <p className="selected" key={x}>
                {x}
              </p>
            );
          }
          return <p key={x}>{x}</p>;
        })}
      </div>
    );
  }

  return (
    <div className="draw-check">
      <FloatingLogo />
      <div className="draw-box">
        <div className="draw-badge-box">
          <img className="badge" src={unboxingBadge} alt="verified survey mark" />
          <p>블록체인 기술을 통해 응답자 추첨의 공정성이 보장받는 설문입니다 🔒</p>
        </div>
        <div className={isWinner ? "draw-inner-box" : "draw-inner-box loose"}>
          {isDrawAvailable &&
            (isWinner ? (
              <p className="draw-result">🤩 당첨되었습니다 🤩</p>
            ) : (
              <p className="draw-result">😭 당첨되지 못했습니다 😭</p>
            ))}
          {drawContent}
        </div>
      </div>
    </div>
  );
}
