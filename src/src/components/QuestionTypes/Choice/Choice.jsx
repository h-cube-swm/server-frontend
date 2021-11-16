import React, { useEffect, useRef, useState } from "react";
import useDefault from "hooks/useDefault";
import setNestedState from "utils/setNestedState";
import Hider from "components/Hider/Hider";
import { CardStates } from "constants.js";

import delBtn from "assets/icons/del-btn1.svg";
import { useQuestion } from "contexts/QuestionContext";
import ExpandableInput from "components/ExpandableInput/ExpandableInput";
import "./Choice.scss";

function Choice({
  text,
  setText,

  checked,
  setChecked,

  onDelete,
  choiceRef,
}) {
  const { state, themeColor } = useQuestion();
  const isEditing = state === CardStates.EDITING;

  function shadeHexColor(color, percent) {
    let colorTemp = color;
    if (!color) colorTemp = "#2b44ff";
    const num = colorTemp.slice(1);
    const f = parseInt(num, 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16; // eslint-disable-line no-bitwise
    const G = (f >> 8) & 0x00ff; // eslint-disable-line no-bitwise
    const B = f & 0x0000ff; // eslint-disable-line no-bitwise
    return (
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  }

  const bgColor = checked
    ? `${shadeHexColor(themeColor, 0.4)}`
    : `${shadeHexColor(themeColor, 0.85)}`;

  return (
    <div className="choice-box">
      <div
        className="text-box"
        onClick={setChecked && (() => setChecked(!checked))}
        style={{
          cursor: setChecked ? "pointer" : null,
          backgroundColor: bgColor,
          transitionDuration: "300ms",
          border: `1.5px solid ${themeColor}`,
        }}>
        <ExpandableInput
          ref={choiceRef}
          text={text}
          setText={setText}
          placeholder="선택지를 입력해주세요."
          type="choice"
          themeColor={`${shadeHexColor(themeColor, -0.35)}`}
        />
      </div>
      <div className="delete-button-box">
        <Hider hide={!isEditing}>
          <button className="del-btn" onClick={onDelete} tabIndex="-1">
            <img src={delBtn} alt="delete button" />
          </button>
        </Hider>
      </div>
    </div>
  );
}

function Choices({ multipleSelect }) {
  const { state, question, setQuestion, response, setResponse, scrollToBottom, themeColor } =
    useQuestion();
  const questionInitialized = useDefault(question, setQuestion, {
    choices: [""],
  });
  const responseInitialized = useDefault(response, setResponse, {});
  const choicesRef = useRef(null);
  const [shouldRefocus, setShouldRefocus] = useState(false);

  useEffect(() => {
    if (shouldRefocus) {
      choicesRef.current?.focus();
      scrollToBottom();
      setShouldRefocus(false);
    }
  }, [choicesRef.current, shouldRefocus]);

  if (!questionInitialized || !responseInitialized) return null;
  const { choices } = question;
  const isEditting = state === CardStates.EDITING;
  const isResponse = state === CardStates.RESPONSE;

  if (state === CardStates.GHOST && !choices) return null;

  const addChoice = () => {
    if (!isEditting) return;
    setNestedState(setQuestion, ["choices"])((choices) => [...choices, ""]);
    setShouldRefocus(true);
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
    <div className="multiple-choice">
      <div className="multiple-choice-inner">
        {multipleSelect && (
          <em className="explain" style={{ color: themeColor }}>
            원하는 만큼 선택하세요!
          </em>
        )}
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
              choiceRef={i === choices.length - 1 ? choicesRef : null}
            />
          );
        })}
      </div>
      <div>
        <Hider hide={!isEditting}>
          <button className="add-btn" onClick={addChoice}>
            <div className="button-box">
              <span style={{ color: themeColor }}>선택지 추가하기</span>
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
