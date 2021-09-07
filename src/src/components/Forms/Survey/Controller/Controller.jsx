import React from "react";
import { CardTypes } from "../../../../constants";

import "./Controller.scss";
import singleChoice from "../../../../assets/icons/single-choice.svg";
import multipleChoice from "../../../../assets/icons/multiple-choice.svg";
import preference from "../../../../assets/icons/preference.svg";
import shortSentence from "../../../../assets/icons/short-sentence.svg";
import longSentence from "../../../../assets/icons/long-sentence.svg";
import empty from "../../../../assets/icons/empty.svg";

const BUTTONS = [
  [singleChoice, CardTypes.SINGLE_CHOICE, "단일선택"],
  [multipleChoice, CardTypes.MULTIPLE_CHOICE, "다중선택"],
  [preference, CardTypes.PREFERENCE, "선호도"],
  [shortSentence, CardTypes.SHORT_SENTENCE, "단답형"],
  [longSentence, CardTypes.LONG_SENTENCE, "장문형"],
  [empty, CardTypes.EMPTY, "빈 질문"],
];

export default function Controller({ type: selectedType, setType }) {
  return (
    <div className="controller">
      <div className="controller-inner">
        <div className="element-box">
          {BUTTONS.map(([image, type, description]) => {
            const className = type === selectedType ? "selected" : "";
            return (
              <button
                key={type}
                className={"element-btn " + className}
                onClick={() => setType(type)}>
                <img src={image} alt={type} />
                <p className="element-detail">{description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
