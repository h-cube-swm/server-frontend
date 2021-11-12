import React from "react";
import { Link } from "react-router-dom";

import { useGlobalState } from "contexts/GlobalContext";
import { useMessage } from "contexts/MessageContext";
import pencil from "assets/images/pencil.png";
import books from "assets/images/books.png";
import wand from "assets/images/wand.png";
import FloatingLogo from "components/FloatingLogo/FloatingLogo";
import duplicate from "assets/icons/duplicate.svg";

/* Styles */
import "./ResponseEnding.scss";
import firework from "assets/icons/firework.png";
import Firework from "./Firework/Firework";

const HOST = `${window.location.protocol}//${window.location.host}`;

export default function ResponseEnding({ location }) {
  const { isEmbed } = useGlobalState();
  const hash = location.hash.replace("#", "");
  const drawResultLink = `${HOST}/forms/survey/draw/${hash}`;
  const { publish } = useMessage();

  const duplicateLink = (link) => {
    const linkarea = document.createElement("textarea");
    document.body.appendChild(linkarea);
    linkarea.value = link;
    linkarea.focus();
    linkarea.select();
    document.execCommand("copy");
    document.body.removeChild(linkarea);
    publish("📎 링크가 복사되었습니다 ✅");
  };

  return (
    <div className="response-ending">
      <FloatingLogo />
      <div className={"contents-box " + (isEmbed ? "embed" : "")}>
        <div className="celebrate-box">
          <div className="celebrate-sentence">
            <img src={firework} alt="celebrating firework" />
            <h1>
              축하합니다. <br />
              설문이 제출되었습니다.
            </h1>
          </div>
          <Firework />
          {!isEmbed && (
            <Link className="btn lg make-survey-btn" to="/">
              더폼 홈으로
            </Link>
          )}
        </div>
        {!isEmbed && (
          <div className="service-box">
            <div className="section">
              <div className="box one">
                <div className="description">
                  {hash ? (
                    <>
                      <div className="explain">
                        <h1>
                          아래 링크를 통해
                          <br />
                          <strong>추첨 결과</strong>를 확인하세요.
                        </h1>
                        <div className="button-box">
                          <button onClick={() => duplicateLink(`${drawResultLink}`)}>
                            <img src={duplicate} alt="duplicate button" />
                            <p>복사</p>
                          </button>
                        </div>
                      </div>
                      <h3>{`${drawResultLink}`}</h3>
                    </>
                  ) : (
                    <>
                      <h1>편하게,</h1>
                      <h1>쉽게,</h1>
                      <h1>빠르게,</h1>
                      <h1>응답하고</h1>
                    </>
                  )}
                </div>
                {!hash && <img className="pencil" src={pencil} alt="pencil" />}
              </div>
              <div className="box four">
                <img src={wand} alt="wand" />
                <div className="description">
                  <h1>간단하게,</h1>
                  <h1>직관적으로,</h1>
                  <h1>멋지게,</h1>
                  <h1>만들고</h1>
                </div>
              </div>
              <div className="box five">
                <div className="description">
                  <h1>더 폼 나게</h1>
                  <h1>결과를 확인합니다.</h1>
                </div>
                <img src={books} alt="books" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
