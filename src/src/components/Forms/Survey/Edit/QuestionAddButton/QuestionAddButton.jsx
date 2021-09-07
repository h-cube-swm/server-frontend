import React from "react";
import addBtn from "../../../../../assets/icons/add-btn.svg";
import Positioner from "../../../../Positioner/Positioner";
import Hider from "../../../../Hider/Hider";
import "./QuestionAddButton.scss";

export default function QuestionAddButton({ y, onClick, isLast }) {
  return (
    <Positioner y={y}>
      <Hider hide={isLast}>
        <div className="question-add-box">
          <button onClick={onClick}>
            <img src={addBtn} alt="add button" />
          </button>
        </div>
      </Hider>
    </Positioner>
  );
}
