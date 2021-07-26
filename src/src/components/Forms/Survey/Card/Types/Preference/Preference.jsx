import React from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../hooks/useDefault";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import "./Preference.scss";
import TextField from "../../../../../TextField/TextField";
import { useQuestion } from "../../../../../../contexts/QuestionContext";

function PreferenceButton({
  index,
  placeholder,
  setText,
  text,
  selected,
  onClick,
}) {
  const classes = ["preference-box"];

  if (onClick) {
    classes.push("cursor");
  }

  if (index === selected) {
    classes.push("selected");
  }

  return (
    <div className="prefence-btn">
      <div className={classes.join(" ")} onClick={onClick}>
        {index}
      </div>
      <TextField
        placeholder={placeholder}
        size="sm"
        setText={setText}
        text={text}
      />
    </div>
  );
}

export default function Preference() {
  const { state, question, setQuestion, response, setResponse } = useQuestion();

  const setMaxPref = setNestedState(setQuestion, ["maxPref"]); // 개수
  const setMinDes = setNestedState(setQuestion, ["minDes"]); // 왼쪽 설명
  const setMaxDes = setNestedState(setQuestion, ["maxDes"]); // 오른쪽 설명
  const ia = useDefault(setQuestion, {
    answer: "",
    maxPref: 5,
    minDes: "",
    maxDes: "",
  });
  const ib = useDefault(setResponse, "");

  let trueMaxPref = question.maxPref;

  const preferences = [];
  const handleOnChange = (e) => {
    const maxPref = e.target.value + "";
    if (!/^[0-9]*$/.test(maxPref)) return false;
    setMaxPref(maxPref);
  };

  const getOnClick = (index) =>
    !isEditting &&
    (() => {
      setResponse(index);
    });

  const handleOnBlur = () => {
    setMaxPref(trueMaxPref);
  };

  if (!ia || !ib) return null;

  const isEditting = state === CardStates.EDITTING;

  if (trueMaxPref < 5) trueMaxPref = 5;
  else if (trueMaxPref > 10) trueMaxPref = 10;

  preferences.push(
    <PreferenceButton
      key={"first"}
      index={1}
      placeholder="설명 추가"
      setText={setMinDes}
      text={question.minDes}
      onClick={getOnClick(1)}
      selected={response}
    />
  );

  for (let i = 2; i < trueMaxPref; i++) {
    preferences.push(
      <PreferenceButton
        key={i}
        index={i}
        onClick={getOnClick(i)}
        selected={response}
      />
    );
  }

  if (isEditting) {
    preferences.push(
      LastButton(question, handleOnChange, handleOnBlur, trueMaxPref, setMaxDes)
    );
  } else {
    preferences.push(
      <PreferenceButton
        key={"last"}
        index={question.maxPref}
        text={question.maxDes}
        onClick={getOnClick(question.maxPref)}
        selected={response}
      />
    );
  }

  return (
    <div className="preference">
      <div className="preference-elements">{preferences}</div>
    </div>
  );
}

function LastButton(
  question,
  handleOnChange,
  handleOnBlur,
  trueMaxPref,
  setMaxDes
) {
  return (
    <div className="prefence-btn" key="last">
      <input
        type="text"
        className="preference-box-end"
        value={question.maxPref}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        maxLength="2"
        style={{
          color: trueMaxPref !== question.maxPref ? "red" : "black",
        }}
      />
      <TextField
        placeholder="설명 추가"
        size="sm"
        setText={setMaxDes}
        text={question.maxDes}
      />
    </div>
  );
}
