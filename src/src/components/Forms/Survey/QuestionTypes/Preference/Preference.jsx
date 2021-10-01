import React, { useState } from "react";
import { CardStates } from "../../../../../constants";
import useDefault from "../../../../../hooks/useDefault";
import setNestedState from "../../../../../utils/setNestedState";
import "./Preference.scss";
import TextField from "../../../../TextField/TextField";
import { useQuestion } from "../../../../../contexts/QuestionContext";
import Tooltip from "../../../../Tooltip/Tooltip";

function PreferenceButton({
  index,
  placeholder,
  description,
  setDescription,
  selected,
  onClick,
  prevIndex,
}) {
  const classes = ["preference-box"];

  if (onClick) {
    classes.push("cursor");
  }

  if (index === selected && prevIndex !== 0) {
    classes.push("selected");
  }

  return (
    <div className={classes.join(" ")} onClick={onClick}>
      {index}
    </div>
  );
}

export default function Preference() {
  const { state, question, setQuestion, response, setResponse } = useQuestion();

  const setMaxPref = setNestedState(setQuestion, ["count"]); // 개수
  const setMinDes = setNestedState(setQuestion, ["minDes"]); // 왼쪽 설명
  const setMaxDes = setNestedState(setQuestion, ["maxDes"]); // 오른쪽 설명
  const [prevIndex, setPrevIndex] = useState(0);

  const ia = useDefault(question, setQuestion, {
    answer: "",
    count: 5,
    minDes: "",
    maxDes: "",
  });
  const ib = useDefault(response, setResponse, "");

  if (!ia || !ib) return null;

  const isEditting = state === CardStates.EDITTING;

  let trueCount = question.count;
  if (trueCount < 5) trueCount = 5;
  else if (trueCount > 10) trueCount = 10;

  const handleOnCountChange = (value) => {
    const count = value + "";
    if (!/^[0-9]*$/.test(count)) return false;
    setMaxPref(+count);
    return true;
  };

  const handleOnBlur = () => {
    setMaxPref(trueCount);
  };

  const getOnClick = (index) => {
    if (isEditting) return null;
    return () => {
      if (index !== prevIndex) {
        setPrevIndex(index);
        setResponse(index);
      } else {
        setPrevIndex(0);
        setResponse(null);
      }
    };
  };

  const preferences = [];
  const elementsClasses = ["preference-elements"];

  switch (trueCount) {
    case 5:
      elementsClasses.push("five");
      break;
    case 6:
      elementsClasses.push("six");
      break;
    case 7:
      elementsClasses.push("seven");
      break;
    case 8:
      elementsClasses.push("eight");
      break;
    case 9:
      elementsClasses.push("nine");
      break;
    case 10:
      elementsClasses.push("ten");
      break;
    default:
      break;
  }

  // Middle components
  for (let i = 1; i < trueCount + 1; i++) {
    preferences.push(
      <PreferenceButton
        key={i}
        index={i}
        onClick={getOnClick(i)}
        selected={response}
        setPrevIndex={setPrevIndex}
        prevIndex={prevIndex}
      />,
    );
  }

  return (
    <div className="preference">
      <div className="des">
        <div className="indicator">
          <p>1</p>
          <TextField
            placeholder="최소 (선택)"
            size="rg"
            text={isEditting || question.minDes ? question.minDes : "최소"}
            setText={setMinDes}
          />
        </div>
        <div className="indicator">
          <p>{trueCount}</p>
          <TextField
            placeholder="최대 (선택)"
            size="rg"
            text={isEditting || question.maxDes ? question.maxDes : "최대"}
            setText={setMaxDes}
          />
        </div>
      </div>
      <div className={elementsClasses.join(" ")}>{preferences}</div>
      {isEditting && (
        <div className="count">
          <Tooltip
            text="최소 5개, 최대 10개까지 설정할 수 있습니다. 리커트 척도 상 홀수가 좋습니다 👍"
            size="lg"
            pos="left">
            <p>개수</p>
          </Tooltip>
          <input
            type="text"
            value={question.count}
            onChange={(e) => handleOnCountChange(e.target.value)}
            onBlur={handleOnBlur}
            onClick={(e) => e.target.select()}
            maxLength="2"
            style={{
              color: question.count !== trueCount ? "red" : "black",
            }}
          />
        </div>
      )}
    </div>
  );
}
