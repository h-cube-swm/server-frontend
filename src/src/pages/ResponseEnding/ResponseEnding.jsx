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
    publish("π λ§ν¬κ° λ³΅μ¬λμμ΅λλ€ β");
  };

  return (
    <div className="response-ending">
      <FloatingLogo />
      <div className={"contents-box " + (isEmbed ? "embed" : "")}>
        <div className="celebrate-box">
          <div className="celebrate-sentence">
            <img src={firework} alt="celebrating firework" />
            <h1>
              μΆνν©λλ€. <br />
              μ€λ¬Έμ΄ μ μΆλμμ΅λλ€.
            </h1>
          </div>
          <Firework />
          {!isEmbed && (
            <Link className="btn lg make-survey-btn" to="/">
              λνΌ νμΌλ‘
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
                          μλ λ§ν¬λ₯Ό ν΅ν΄
                          <br />
                          <strong>μΆμ²¨ κ²°κ³Ό</strong>λ₯Ό νμΈνμΈμ.
                        </h1>
                        <div className="button-box">
                          <button onClick={() => duplicateLink(`${drawResultLink}`)}>
                            <img src={duplicate} alt="duplicate button" />
                            <p>λ³΅μ¬</p>
                          </button>
                        </div>
                      </div>
                      <h3>{`${drawResultLink}`}</h3>
                    </>
                  ) : (
                    <>
                      <h1>νΈνκ²,</h1>
                      <h1>μ½κ²,</h1>
                      <h1>λΉ λ₯΄κ²,</h1>
                      <h1>μλ΅νκ³ </h1>
                    </>
                  )}
                </div>
                {!hash && <img className="pencil" src={pencil} alt="pencil" />}
              </div>
              <div className="box four">
                <img src={wand} alt="wand" />
                <div className="description">
                  <h1>κ°λ¨νκ²,</h1>
                  <h1>μ§κ΄μ μΌλ‘,</h1>
                  <h1>λ©μ§κ²,</h1>
                  <h1>λ§λ€κ³ </h1>
                </div>
              </div>
              <div className="box five">
                <div className="description">
                  <h1>λ νΌ λκ²</h1>
                  <h1>κ²°κ³Όλ₯Ό νμΈν©λλ€.</h1>
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
