import React from "react";
import Service from "../../../Main/Service";
import { Link } from "react-router-dom";

/* Styles */
import "./ResponseEnding.scss";
import logo from "../../../../assets/images/logo.png";
import firework from "../../../../assets/icons/firework.png";
import Firework from "./Firework/Firework";

export default function ResponseEnding() {
  return (
    <div className="response-ending">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="celebrate-sentence">
        <img src={firework} alt="celebrating firework" />
        <h1>
          축하합니다. <br />
          설문이 제출되었습니다.
        </h1>
        <img className="right" src={firework} alt="celebrating firework" />
      </div>
      <Firework />
      <Link className="btn xl" to="/forms/survey">
        설문조사 하러가기
      </Link>
    </div>
  );
}
