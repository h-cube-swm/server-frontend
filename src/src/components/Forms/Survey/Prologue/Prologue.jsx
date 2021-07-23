import React, { useState } from "react";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import "./Prologue.scss";

export default function Prologue({ survey, setSurvey }) {
  const [isFolding, setIsFolding] = useState(false);

  return (
    <div
      className="prologue-box"
      onClick={() => {
        setIsFolding(false);
      }}>
      {!isFolding && (
        <div className="survey-header">
          <TextField
            text={survey.title}
            setText={setNestedState(setSurvey, ["title"])}
            placeholder="더 폼 나는 제목"
            size="title"
          />
          <br />
          <TextField
            text={survey.description}
            setText={setNestedState(setSurvey, ["description"])}
            placeholder="더 폼 나는 설명"
            size="xl"
          />
        </div>
      )}
    </div>
  );
}
