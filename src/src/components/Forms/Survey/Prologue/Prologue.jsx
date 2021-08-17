import React, { useState } from "react";
import { Link } from "react-router-dom";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import "./Prologue.scss";
import logo from "../../../../assets/images/logo.png";
import arrow from "../../../../assets/icons/upward-arrow.svg";

export default function Prologue({ survey, setSurvey, children }) {
  const [isFolded, setIsFolded] = useState(true);
  const classes = ["prologue-box"];
  if (isFolded) classes.push("folded");
  else classes.push("extended");

  const className = classes.join(" ");
  return (
    <div className={className}>
      <div className="survey-header">
        <div className="logo">
          <Link to="/" target="_blank">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="info">
          <div className="title-box">
            <TextField
              text={survey.title}
              setText={setNestedState(setSurvey, ["title"])}
              placeholder="더 폼 나는 제목"
              size="title"
              onFocus={() => setIsFolded(false)}
            />
          </div>
          <div className="description-box">
            <TextField
              text={survey.description}
              setText={setNestedState(setSurvey, ["description"])}
              placeholder="더 폼 나는 설명"
              multiline
              onFocus={() => setIsFolded(false)}
            />
          </div>
        </div>
        <div className="children-box">{children}</div>
      </div>
      <div className="fold-button-box">
        <button onClick={() => setIsFolded(true)}>
          <img src={arrow} alt="arrow to fold" />
        </button>
      </div>
    </div>
  );
}
