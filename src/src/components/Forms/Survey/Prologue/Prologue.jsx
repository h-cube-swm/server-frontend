import React, { useState, useCallback, useEffect } from "react";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import "./Prologue.scss";

export default function Prologue({ survey, setSurvey }) {
  const [y, setY] = useState(0);
  const [wheelDirection, setWheelDirection] = useState(false); // true는 아래로 false는 위로 스크롤하는 것.

  const handleNavigation = useCallback(
    (e) => {
      const delta = e.deltaY;
      if (y > delta) {
        console.log("up");
        setWheelDirection(false);
      } else if (y < delta) {
        console.log("down");
        setWheelDirection(true);
      }
      setY(delta);
    },
    [wheelDirection]
  );

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("wheel", handleNavigation);
    return () => {
      window.removeEventListener("wheel", handleNavigation);
    };
  }, []);

  return (
    <div className={!wheelDirection ? "prologue-box" : "prologue-box-top"}>
      <div className="survey-header">
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
  );
}
