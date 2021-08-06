import React from "react";
import useDefault from "../../../../../hooks/useDefault";
import setNestedState from "../../../../../utils/setNestedState";
import Hider from "../../../../Hider/Hider";
import TextField from "../../../../TextField/TextField";
import CheckField from "../../../../CheckField/CheckField";
import { CardStates } from "../../constants";

import delBtn from "../../../../../assets/icons/del-btn.svg";
import addBtn from "../../../../../assets/icons/add-btn.svg";
import "./Choice.scss";
import { useQuestion } from "../../../../../contexts/QuestionContext";

function Choice({
  text,
  setText,

  checked,
  setChecked,

  onDelete,
  multipleSelect,
}) {
  return (
    <div className="choice-box">
      <div className="check-box">
        <CheckField
          className="check-box"
          checked={checked}
          setChecked={setChecked}
          radio={!multipleSelect}
        />
      </div>
      <div className="text-box">
        <TextField
          text={text}
          setText={setText}
          placeholder="더 폼 나는 선택지"
          size="rg"
        />
      </div>
      <div className="delete-button-box">
        <Hider hide={!(setText && onDelete)}>
          <button className="del-btn" onClick={onDelete}>
            <img src={delBtn} alt="delete button" />
          </button>
        </Hider>
      </div>
    </div>
  );
}

function Choices({ multipleSelect }) {
  const { state, question, setQuestion, response, setResponse } = useQuestion();

  const questionInitialized = useDefault(question, setQuestion, {
    choices: [""],
  });
  const responseInitialized = useDefault(response, setResponse, {});
  if (!questionInitialized || !responseInitialized) return null;
  const { choices } = question;
  const editable = state === CardStates.EDITTING;

  if (state === CardStates.GHOST && !choices) return null;

  const addChoice = () => {
    setNestedState(setQuestion, ["choices"])((choices) => [...choices, ""]);
  };

  const removeChoice = (i) => {
    setNestedState(setQuestion, ["choices"])((choices) => {
      const newChoices = [...choices];
      newChoices.splice(i, 1);
      return newChoices;
    });
  };

  const onSelect = (i) => (checked) => {
    if (editable) return;
    if (multipleSelect) {
      setNestedState(setResponse, [i])(checked);
    } else {
      setResponse({ [i]: checked });
    }
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
            onDelete={() => removeChoice(i)}
            checked={typeof response === "object" && response[i]}
            setChecked={onSelect(i)}
            multipleSelect={multipleSelect}
          />
        );
      })}
      <div>
        <Hider hide={!editable}>
          <button className="add-btn" onClick={addChoice}>
            <div className="button-box">
              <img src={addBtn} alt="delete button" />
              <span>더 폼 나는 선택지 추가하기</span>
            </div>
          </button>
        </Hider>
      </div>
    </div>
  );
}

export function SingleChoices(props) {
  return <Choices {...props} multipleSelect={false} />;
}

export function MultipleChoices(props) {
  return <Choices {...props} multipleSelect={true} />;
}
