import React from "react";
import { useQuestion } from "../../../../contexts/QuestionContext";
import Hider from "../../../Hider/Hider";
import useScrollBlock from "../../../../hooks/useScrollBlock";
import { CardStates } from "../../../../constants";

/* Assets */
import "./Card.scss";
import imgHandle from "../../../../assets/icons/handle.svg";

function Card({ onDelete, onGrab, children }) {
  const { state, isLast, scrollRef } = useQuestion();
  const { ref, ...others } = useScrollBlock();

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

  // const handleOnDelete = (event) => {
  //   event.preventDefault();
  //   if (onDelete) onDelete();
  // };

  const className = classes.join(" ");
  return (
    <div className={className}>
      <div
        className="content-box"
        ref={(dom) => {
          ref.current = dom;
          scrollRef.current = dom;
        }}
        {...others}>
        {children}
      </div>
      <Hider hide={isLast}>
        <div className="handle" onMouseDown={handleOnGrab}>
          <img src={imgHandle} alt="handle"></img>
        </div>
      </Hider>
    </div>
  );
}

export default Card;
