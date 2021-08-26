import React, { useState } from "react";
import { CardStates } from "../../../../../constants";
import useDefault from "../../../../../hooks/useDefault";
import setNestedState from "../../../../../utils/setNestedState";
import "./Preference.scss";
import TextField from "../../../../TextField/TextField";
import { useQuestion } from "../../../../../contexts/QuestionContext";

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
    <div className="prefence-btn">
      <div className={classes.join(" ")} onClick={onClick}>
        {index}
      </div>
      <div className="text-box">
        <TextField
          placeholder={placeholder}
          size="sm"
          setText={setDescription}
          text={description}
        />
      </div>
    </div>
  );
}

function LastButton({ count, onCountChange, onBlur, isError, description, setDescription }) {
  return (
    <div className="prefence-btn" key="last">
      <input
        type="text"
        className="preference-box end"
        value={count}
        onChange={(e) => onCountChange(e.target.value)}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        maxLength="2"
        style={{
          color: isError ? "red" : "black",
        }}
      />
      <div className="text-box">
        <TextField placeholder="설명 추가" size="sm" text={description} setText={setDescription} />
      </div>
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
    console.log(index, prevIndex);
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

  // First component
  preferences.push(
    <PreferenceButton
      key={"first"}
      index={1}
      placeholder={isEditting && "설명 추가"}
      setDescription={setMinDes}
      description={question.minDes}
      onClick={getOnClick(1)}
      selected={response}
      setPrevIndex={setPrevIndex}
      prevIndex={prevIndex}
    />,
  );

  // Middle components
  for (let i = 2; i < trueCount; i++) {
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

  // Last component
  if (isEditting) {
    preferences.push(
      <LastButton
        key="last"
        count={question.count}
        onCountChange={handleOnCountChange}
        onBlur={handleOnBlur}
        isError={question.count !== trueCount}
        description={question.maxDes}
        setDescription={setMaxDes}
      />,
    );
  } else {
    preferences.push(
      <PreferenceButton
        key="last"
        index={question.count}
        description={question.maxDes}
        onClick={getOnClick(question.count)}
        selected={response}
        prevIndex={prevIndex}
      />,
    );
  }

  return (
    <div className="preference">
      <div className="preference-elements">{preferences}</div>
    </div>
  );
}
