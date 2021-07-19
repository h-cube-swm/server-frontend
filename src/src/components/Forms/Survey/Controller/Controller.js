import React, { useState } from "react";
import "./Controller.scss";
import singleChoice from "../../../../assets/icons/single-choice.svg";
import multipleChoice from "../../../../assets/icons/multiple-choice.svg";
import preference from "../../../../assets/icons/preference.svg";
import shortSentence from "../../../../assets/icons/short-sentence.svg";
import longSentence from "../../../../assets/icons/long-sentence.svg";
import { CardTypes } from "../constants";

const buttons = [
  [singleChoice, CardTypes.SINGLE_CHOICE, "객관식"],
  [multipleChoice, CardTypes.MULTIPLE_CHOICE, "다중선택"],
  [preference, CardTypes.PREFERENCE, "선호도"],
  [shortSentence, CardTypes.SHORT_SENTENCE, "단답형"],
  [longSentence, CardTypes.LONG_SENTENCE, "장문형"],
];

export default function Controller({ element, setElement }) {
  return (
    <div>
      <div className="element-box">
        {buttons.map(([image, type, detail]) => {
          const className = type === element ? "selected" : "";
          return (
            <div className="element-binding">
              <button
                key={type}
                className={"element-btn " + className}
                onClick={() => setElement(type)}
              >
                <img src={image} alt={type} />
              </button>
              <p className={"element-detail " + className}>{detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
