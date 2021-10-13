import React from "react";
import { CardStates } from "../../../../constants";
import { useQuestion } from "../../../../contexts/QuestionContext";
import Hider from "../../../Hider/Hider";
import useScrollBlock from "../../../../hooks/useScrollBlock";

/* Assets */
import "./Card.scss";
import imgHandle from "../../../../assets/icons/handle.svg";
import deleteButton from "../../../../assets/icons/del-btn.svg";

function Card({ onDelete, onGrab, children }) {
  const { state, isLast } = useQuestion();
  const scrollBlock = useScrollBlock();

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
    <div className={className}>
      <div className="content-box" {...scrollBlock}>
        {children}
      </div>
      <Hider hide={isLast}>
        <button
          className={"delete-btn " + (onDelete ? "" : "hidden")}
          tabIndex={onDelete ? null : "-1"}
          onClick={handleOnDelete}>
          <img src={deleteButton} alt="delete button"></img>
        </button>
        <div className="handle" onMouseDown={handleOnGrab}>
          <img src={imgHandle} alt="handle"></img>
        </div>
      </Hider>
    </div>
  );
}

export default Card;
