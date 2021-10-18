import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import "./Prologue.scss";
import logo from "../../../../assets/images/logo.png";

export default function Prologue({ survey, setSurvey, children }) {
  const [isFolded, setIsFolded] = useState(true);
  const titleTextArea = useRef(null);

  useEffect(() => {
    if (!survey.title) {
      titleTextArea.current.focus();
    }
  }, []);

  const classes = ["prologue-box"];
  if (isFolded) classes.push("folded");
  else classes.push("extended");

  const className = classes.join(" ");
  return (
    <div className={className}>
      <div className="survey-header">
        {isFolded && (
          <div className="logo">
            <Link to="/" target="_blank">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        )}
        <div className="info">
          <div className={isFolded ? "title-box fold" : "title-box"}>
            <h1 className={!isFolded && !survey.title ? "title-intro" : "title-intro disabled"}>
              당신만을 위한
            </h1>
            <TextField
              tabIndex="1"
              text={survey.title}
              setText={setNestedState(setSurvey, ["title"])}
              placeholder="더 폼 나는 제목을 입력해보세요"
              size="title"
              ref={titleTextArea}
              onFocus={() => setIsFolded(false)}
            />
          </div>
          <div className={!survey.description ? "description-box" : "description-box full"}>
            <h3
              className={
                !isFolded && !survey.description
                  ? "description-intro"
                  : "description-intro disabled"
              }>
              자세한 설명으로 참여를 유도해보세요.
            </h3>
            <TextField
              tabIndex="2"
              text={survey.description}
              setText={setNestedState(setSurvey, ["description"])}
              placeholder="더 폼 나는 설명을 여기에 입력하세요"
              multiline
              onFocus={() => setIsFolded(false)}
            />
          </div>
          {/* <div className="color-box">
            <h3 className={!isFolded ? "color-intro" : "color-intro disabled"}>
              당신만의 색으로 만들어보세요
            </h3>
            <TextField
              tabIndex="2"
              text={survey.themeColor}
              setText={setNestedState(setSurvey, ["themeColor"])}
              placeholder="hex코드를 입력해주세요(#000000)"
              multiline
              onFocus={() => setIsFolded(false)}
            />
          </div> */}
        </div>
        {isFolded && <div className="children-box">{children}</div>}
      </div>
      <div className="fold-button-box">
        <button className="fold-btn" onClick={() => setIsFolded(true)}>
          다음
        </button>
      </div>
    </div>
  );
}
