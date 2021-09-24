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
        {(isEditting || question.minDes) && (
          <div className="indicator">
            <p>1</p>
            <TextField
              placeholder="최소 설명 추가 (선택)"
              size="rg"
              text={question.minDes}
              setText={setMinDes}
            />
          </div>
        )}
        {(isEditting || question.maxDes) && (
          <div className="indicator">
            <p>{trueCount}</p>
            <TextField
              placeholder="최대 설명 추가 (선택)"
              size="rg"
              text={question.maxDes}
              setText={setMaxDes}
            />
          </div>
        )}
      </div>
      <div className="preference-elements">{preferences}</div>
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
