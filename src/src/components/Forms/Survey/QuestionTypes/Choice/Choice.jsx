import React, { useEffect, useRef } from "react";
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
import useScrollBlock from "../../../../../hooks/useScrollBlock";

function Choice({
  text,
  setText,

  checked,
  setChecked,

  onDelete,
  multipleSelect,
}) {
  const { state } = useQuestion();
  const isEditing = state === CardStates.EDITTING;

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
        <Hider hide={!isEditing}>
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
  const scrollRef = useRef(0);
  const { ref, ...scrollBlock } = useScrollBlock();
  useEffect(() => {
    if (!scrollRef.current) return;
    if (scrollRef.current < ref.current.scrollHeight) {
      ref.current.scroll({
        top: 999999,
        left: 0,
        behavior: "smooth",
      });
    }
    scrollRef.current = ref.current.scrollHeight;
  });

  if (!questionInitialized || !responseInitialized) return null;
  const { choices } = question;
  const isEditting = state === CardStates.EDITTING;
  const isResponse = state === CardStates.RESPONSE;

  if (state === CardStates.GHOST && !choices) return null;

  const addChoice = () => {
    if (!isEditting) return;
    setNestedState(setQuestion, ["choices"])((choices) => [...choices, ""]);
  };

  const removeChoice = (i) => {
    if (!isEditting) return;
    setNestedState(setQuestion, ["choices"])((choices) => {
      const newChoices = [...choices];
      newChoices.splice(i, 1);
      return newChoices;
    });
  };

  const onSelect = (i) => (checked) => {
    if (!isResponse) return;
    if (multipleSelect) {
      setNestedState(setResponse, [i])(checked);
    } else {
      setResponse({ [i]: checked });
    }
  };

  return (
    <div className="multiple-choice" ref={ref} {...scrollBlock}>
      <div className="multiple-choice-inner">
        {choices.map((choice, i) => {
          const setText = setNestedState(setQuestion, ["choices", i]);
          return (
            <Choice
              key={i}
              text={choice}
              setText={isEditting && setText}
              onDelete={() => removeChoice(i)}
              checked={typeof response === "object" && response[i]}
              setChecked={onSelect(i)}
              multipleSelect={multipleSelect}
            />
          );
        })}
        <div>
          <Hider hide={!isEditting}>
            <button className="add-btn" onClick={addChoice}>
              <div className="button-box">
                <img src={addBtn} alt="delete button" />
                <span>더 폼 나는 선택지 추가하기</span>
              </div>
            </button>
          </Hider>
        </div>
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
