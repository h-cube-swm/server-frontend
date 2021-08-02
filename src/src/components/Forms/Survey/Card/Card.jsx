import React from "react";
import { CardStates, CardStyle } from "../constants";
import useTimeout from "../../../../hooks/useTimeout";
import { useQuestion } from "../../../../contexts/QuestionContext";

/* Assets */
import "../Card/Card.scss";
import hanleImage from "../../../../assets/icons/handle.svg";
import delBtn from "../../../../assets/icons/del-btn.svg";

import QuestionCommon from "../QuestionCommon/QuestionCommon";

export default function Card({
  // Logic-associated parameters
  onDelete,

  // UI-associated parameters
  onGrab,
  slowAppear,
}) {
  const isInit = useTimeout(slowAppear ? 400 : 0);
  const { state, question } = useQuestion();

  if (!question) return null;
  let classes = ["survey-card"];
  if (isInit) classes.push("hidden");

  switch (state) {
    case CardStates.EDITTING:
      classes.push("highlight");
      break;

    case CardStates.ORDERING:
      classes.push("hidden");
      break;

    case CardStates.PREVIEW:
      classes.push("preview");
      classes.push("hide-handle");
      break;

    case CardStates.RESPONSE:
      classes.push("response");
      classes.push("hide-handle");
      break;

    case CardStates.GHOST:
      classes.push("ghost");
      classes.push("highlight");

    default:
      break;
  }

  const _onGrab = (event) => {
    event.preventDefault();
    if (state !== CardStates.EDITTING) return;
    onGrab();
  };

  const className = classes.join(" ");
  return (
    <div
      className={className}
      style={{
        height: state === CardStates.RESPONSE ? null : CardStyle.HEIGHT,
      }}>
      <QuestionCommon></QuestionCommon>
      <button
        className={"delete" + (onDelete ? "" : " disabled")}
        onClick={onDelete}>
        <img src={delBtn} alt="Delete button"></img>
      </button>
      <div className="handle" onMouseDown={_onGrab}>
        <img src={hanleImage} alt="Handle"></img>
      </div>
    </div>
  );
}
