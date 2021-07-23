import React from "react";
import { CardStates } from "../../../constants";
import useDefault from "../../../../../../hooks/useDefault";
import Hider from "../../../../../Hider/Hider";
import setNestedState from "../../../../../../utils/setNestedState";
import "./Preference.scss";
import TextField from "../../../../../TextField/TextField";

export default function Preference({
  question,
  setQuestion,
  response,
  setResponse,
  state,
}) {
  const setMaxPref = setNestedState(setQuestion, ["maxPref"]);
  const setMinDes = setNestedState(setQuestion, ["setMinDes"]);
  const setMaxDes = setNestedState(setQuestion, ["setMaxDes"]);
  const ia = useDefault(setQuestion, {
    answer: "",
    maxPref: 5,
    setMinDes: "",
    setMaxDes: "",
  });
  const ib = useDefault(setResponse, "");

  let trueMaxPref = question.maxPref;

  const preferences = [];
  const handleOnChange = (e) => {
    const maxPref = e.target.value + "";
    if (!/^[0-9]*$/.test(maxPref)) return false;
    setMaxPref(maxPref);
  };

  const handleOnClick = (e) => {
    const answer = e.target.getAttribute("value");
    setResponse(answer);
    console.log("response는", response, typeof response);
  };

  const handleOnBlur = () => {
    setMaxPref(trueMaxPref);
  };

  if (!ia || !ib) return null;

  switch (state) {
    case CardStates.RESPONSE:
      for (let i = 1; i <= question.maxPref; i++) {
        if (i + "" === response) {
          preferences.push(
            <div
              className="preference-box cursor selected"
              onClick={handleOnClick}
              value={i}
            >
              {i}
            </div>
          );
        } else {
          preferences.push(
            <div
              className="preference-box cursor"
              onClick={handleOnClick}
              value={i}
            >
              {i}
            </div>
          );
        }
      }
      return (
        <div className="preference">
          <div className="preference-elements">{preferences}</div>
          <div className="description">
            <TextField text={question.setMinDes} size="sm" />
            <TextField text={question.setMaxDes} size="sm" />
          </div>
        </div>
      );

    case CardStates.EDITTING:
    default:
      if (trueMaxPref < 5) trueMaxPref = 5;
      else if (trueMaxPref > 10) trueMaxPref = 10;

      for (let i = 1; i < trueMaxPref; i++) {
        preferences.push(
          <div key={i} className="preference-box">
            {i}
          </div>
        );
      }
      preferences.push(
        <input
          key="last"
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
      );

      return (
        <div className="preference">
          <div className="preference-elements">{preferences}</div>
          <div className="description">
            <TextField
              placeholder="설명 추가하기"
              size="sm"
              setText={setMinDes}
            />
            <TextField
              placeholder="설명 추가하기"
              size="sm"
              setText={setMaxDes}
            />
          </div>
        </div>
      );
  }
}
