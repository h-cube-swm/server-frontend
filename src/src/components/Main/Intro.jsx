/* React elements */
import { React, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DOMAIN } from "../../constants";
import { useGlobalState } from "../../contexts/GlobalContext";

/* Styles */
import "./Intro.scss";
import Chaos from "../Chaos/Chaos";
import { useMessage } from "../../contexts/MessageContext";

function Intro() {
  const { token } = useGlobalState();
  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${location}`;

  let isMobile = false;
  if (document.getElementById("root").offsetWidth < 767) {
    isMobile = true;
  }

  return (
    <div className="intro">
      <div className="outer-box">
        <div className="message">
          <h1>
            모든 폼을 대신하는
            <br />더 폼 나는 설문조사
            <br />
            <strong>
              더폼<p className="beta-tag">beta</p>
            </strong>
          </h1>
          <div className="button-box">
            {!token && (
              <div className="make-btn">
                <Link
                  className="btn long once"
                  to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
                  한 번 만들어보기
                </Link>
                <p className="description">
                  체험해보기, 대신 마지막에 나올
                  <br />
                  링크는 잘 갖고있기로해요 🤙
                </p>
              </div>
            )}

            <div className="make-btn">
              {token ? (
                <>
                  <Link
                    className="btn long login"
                    to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
                    더 폼 나게 만들기
                  </Link>
                  <p className="description">멋진 폼을 만들러 가 볼까요? 🥳</p>
                </>
              ) : (
                <>
                  <a className="btn long login" href={href}>
                    더 폼 나게 만들기
                  </a>
                  <p className="description">
                    1초 만에 로그인하고
                    <br />내 설문을 안전하게 저장해요 🤩
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="messages">
        <div className="box one">더폼 써봤어?</div>
        <div className="box two">👀</div>
        <div className="box three">🤭</div>
        <div className="box four">WOW</div>
        <div className="box five">편리해</div>
        <div className="box six">MZ세대라면 더 폼 나게</div>
        <div className="box seven">쉬워</div>
        <div className="box eight">모두의 목소리</div>
        <div className="box nine">누구라도</div>
        <div className="box eleven">😎</div>
      </div>
    </div>
  );
}

export default Intro;
