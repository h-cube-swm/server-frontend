import React from "react";
import useDefault from "../../../../../../utils/useDefault";
import setNestedState from "../../../../../../utils/setNestedState";
import Hider from "../../../../../Hider/Hider";
import TextField from "../../../../../TextField/TextField";
import CheckField from "../../../../CheckField/CheckField";
import { CardStates } from "../../../constants";

import delBtn from "../../../../../../assets/icons/del-btn.svg";
import addBtn from "../../../../../../assets/icons/add-btn.svg";
import "./MultipleChoice.scss";

function Choice({ text, setText, checked, setChecked, onDelete, editable }) {
  return (
    <div className="choice-box">
      <CheckField
        className="check-box"
        checked={checked}
        setChecked={setChecked}
      />
      <TextField
        text={text}
        setText={setText}
        disabled={!editable}
        className={editable ? "text-box" : "text-box disabled"}
      />
      <Hider hide={!(editable && onDelete)}>
        <button className="del-btn" onClick={onDelete}>
          <img src={delBtn} alt="delete button" />
        </button>
      </Hider>
    </div>
  );
}

export default function MultipleChoice({
  question,
  setQuestion,
  response,
  setResponse,
  state,
}) {
  const initialized = useDefault(question, setQuestion, {
    choices: ["아이유 이쁘다"],
  });
  if (!initialized) return null;

  if (!question.choices) return null;

  const { choices } = question;
  const editable = state === CardStates.EDITTING;

  const addChoice = () => {
    setNestedState(setQuestion, ["choices"])((choices) => [...choices, "인정"]);
  };

  const removeChoice = (i) => {
    setNestedState(setQuestion, ["choices"])((choices) => {
      const newChoices = [...choices];
      newChoices.splice(i, 1);
      return newChoices;
    });
  };

  return (
    <div className="multiple-choice">
      {choices.map((choice, i) => {
        const setText = setNestedState(setQuestion, ["choices", i]);
        return (
          <Choice
            key={i}
            text={choice}
            setText={setText}
            editable={editable}
            onDelete={() => removeChoice(i)}
          />
        );
      })}
      <Hider hide={!editable}>
        <button className="add-btn" onClick={addChoice}>
          <img src={addBtn} alt="delete button" />
          <p>선택지 추가하기</p>
        </button>
      </Hider>
    </div>
  );
}
