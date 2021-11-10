import React from "react";
import addBtn from "../../../../../assets/icons/add-btn.svg";
import Hider from "../../../../Hider/Hider";
import "./QuestionAddButton.scss";

export default function QuestionAddButton({ onClick, isLast, top }) {
  const classes = ["question-add-box"];
  if (top) {
    classes.push("top");
  }
  return (
    <Hider hide={isLast}>
      <div className={classes.join(" ")}>
        <button onClick={onClick} />
      </div>
    </Hider>
  );
}
