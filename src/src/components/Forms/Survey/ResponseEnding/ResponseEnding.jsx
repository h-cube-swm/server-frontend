import React from "react";
import Service from "../../../Main/Service";
import { Link } from "react-router-dom";

/* Styles */
import "./ResponseEnding.scss";
import logo from "../../../../assets/images/logo.png";

export default function ResponseEnding() {
  return (
    <div className="response-ending">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="celebrate-sentence">
        <h1>축하합니다. 설문이 제출되었습니다.</h1>
      </div>
      <Link className="btn xl" to="/forms/survey">
        설문조사 하러가기
      </Link>
    </div>
  );
}
