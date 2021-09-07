import React from "react";
import { CardStates, CardStyle } from "../../../../constants";
import { useQuestion } from "../../../../contexts/QuestionContext";
import Hider from "../../../Hider/Hider";

/* Assets */
import "./Card.scss";
import imgHandle from "../../../../assets/icons/handle.svg";
import imgDeleteButton from "../../../../assets/icons/del-btn.svg";
// import questionBranchButton from "../../../../assets/icons/branch-btn.svg";

export default function Card({ onDelete, onGrab, children }) {
  const { state, isLast } = useQuestion();

  const classes = ["survey-card"];

  switch (state) {
    case CardStates.EDITTING:
      classes.push("highlight");
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
      break;

    default:
      break;
  }

  const handleOnGrab = (event) => {
    event.preventDefault();
    if (state !== CardStates.EDITTING) return;
    if (onGrab) onGrab();
  };

  const handleOnDelete = (event) => {
    event.preventDefault();
    if (onDelete) onDelete();
  };

  const className = classes.join(" ");
  return (
    <div
      className={className}
      style={{
        height: state === CardStates.RESPONSE ? null : CardStyle.HEIGHT,
        width: CardStyle.WIDTH,
      }}>
      <div className="content-box">{children}</div>
      <Hider hide={isLast}>
        <div className="button-box">
          <button
            className={"delete " + (onDelete ? "" : "hidden")}
            tabIndex={onDelete ? null : "-1"}
            onClick={handleOnDelete}>
            <img src={imgDeleteButton} alt="Delete button"></img>
          </button>
        </div>
        <div className="handle" onMouseDown={handleOnGrab}>
          <img src={imgHandle} alt="Handle"></img>
        </div>
      </Hider>
    </div>
  );
}
