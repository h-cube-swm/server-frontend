import React, { useState } from "react";
import "./Controller.scss";
import singleChoice from "../../../../assets/icons/single-choice.svg";
import multipleChoice from "../../../../assets/icons/multiple-choice.svg";
import preference from "../../../../assets/icons/preference.svg";
import shortSentence from "../../../../assets/icons/short-sentence.svg";
import longSentence from "../../../../assets/icons/long-sentence.svg";
import { CardTypes } from "../constants";

const buttons = [
  [singleChoice, CardTypes.SINGLE_CHOICE],
  [multipleChoice, CardTypes.MULTIPLE_CHOICE],
  [preference, CardTypes.PREFERENCE],
  [shortSentence, CardTypes.SHORT_SENTENCE],
  [longSentence, CardTypes.LONG_SENTENCE],
];

export default function Controller({ element, setElement }) {
  return (
    <div>
      <div className="element-box">
        {buttons.map(([image, type]) => {
          const className = type === element ? "selected" : "";
          return (
            <button
              key={type}
              className={"element-btn " + className}
              onClick={() => setElement(type)}
            >
              <img src={image} alt={type} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
