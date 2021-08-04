import React from "react";
import { Link } from "react-router-dom";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import "./Prologue.scss";
import logo from "../../../../assets/images/logo.png";

export default function Prologue({ survey, setSurvey }) {
  return (
    <div className="prologue-box">
      <div className="survey-header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="info">
          <TextField
            text={survey.title}
            setText={setNestedState(setSurvey, ["title"])}
            placeholder="더 폼 나는 제목"
            size="title"
            multiline
          />
          <TextField
            text={survey.description}
            setText={setNestedState(setSurvey, ["description"])}
            placeholder="더 폼 나는 설명"
            size="xl"
            multiline
          />
        </div>
      </div>
    </div>
  );
}
