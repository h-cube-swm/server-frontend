import React from "react";
import { Link } from "react-router-dom";

/* Styles */
import "./ResponseEnding.scss";
import firework from "../../../../assets/icons/firework.png";
import Firework from "./Firework/Firework";
import pencil from "../../../../assets/images/pencil.png";
import books from "../../../../assets/images/books.png";
import wand from "../../../../assets/images/wand.png";
import FloatingLogo from "../../../FloatingLogo/FloatingLogo";
import { useGlobalState } from "../../../../contexts/GlobalContext";

export default function ResponseEnding() {
  const { isEmbed } = useGlobalState();

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
                  <h1>편하게,</h1>
                  <h1>쉽게,</h1>
                  <h1>빠르게,</h1>
                  <h1>응답하고</h1>
                </div>
                <img src={pencil} alt="pencil" />
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
