import React from "react";
import addBtn from "../../../../../assets/icons/add-btn.svg";
import Positioner from "../../../../Positioner/Positioner";
import "./QuestionAddButton.scss";

export function QuestionAddButton({ y, onClick }) {
  return (
    <Positioner y={y}>
      <div className="question-add-box">
        <button onClick={onClick}>
          <img src={addBtn} alt="add button" />
        </button>
      </div>
    </Positioner>
  );
}
