import React from "react";
import { CardTypes, CardStates, CardStyle } from "../constants";
import useTimeout from "../../../../hooks/useTimeout";

/* Assets */
import "../Card/Card.scss";
import hanleImage from "../../../../assets/icons/handle.svg";
import delBtn from "../../../../assets/icons/del-btn.svg";

/* Components */
import Default from "./Types/Default/Default";
import ToggleSwitch from "./ToggleSwitch";
import {
  MultipleChoices,
  SingleChoices,
} from "./Types/MultipleChoice/MultipleChoice";
import Preference from "./Types/Preference/Preference";
import ShortSentence from "./Types/ShortSentence/ShortSentence";
import LongSentence from "./Types/LongSentence/LongSentence";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import Hider from "../../../Hider/Hider";
import { useQuestion } from "../../../../contexts/QuestionContext";

function getInnerComponent(type) {
  switch (type) {
    case CardTypes.SINGLE_CHOICE:
      return SingleChoices;
    case CardTypes.MULTIPLE_CHOICE:
      return MultipleChoices;
    case CardTypes.PREFERENCE:
      return Preference;
    case CardTypes.SHORT_SENTENCE:
      return ShortSentence;
    case CardTypes.LONG_SENTENCE:
      return LongSentence;
    default:
      return Default;
  }
}

function CommonComponent() {
  const { state, question, setQuestion } = useQuestion();

  const InnerComponent = getInnerComponent(question.type);
  const isEditting = state !== CardStates.EDITTING;

  return (
    <>
      <div className="card-header">
        <TextField
          placeholder="더 폼 나는 질문"
          text={question.title}
          setText={setNestedState(setQuestion, ["title"])}
          disabled={isEditting}
          size="title"
          multiline
        />
        <Hider hide={isEditting}>
          <div className={`basic-element`}>
            <ToggleSwitch
              isRequired={question.isRequired}
              setIsRequired={setNestedState(setQuestion, ["isRequired"])}
              label="필수응답"
            />
          </div>
        </Hider>
      </div>
      <div className="inner-box">
        <InnerComponent />
      </div>
    </>
  );
}

export default function Card({
  // Logic-associated parameters
  onDelete,

  // UI-associated parameters
  onGrab,
  slowAppear,
}) {
  const isInit = useTimeout(slowAppear ? 400 : 0);
  const { state, question } = useQuestion();

  if (!question) return null;
  let classes = ["survey-card"];
  if (isInit) classes.push("hidden");

  switch (state) {
    case CardStates.EDITTING:
      classes.push("highlight");
      break;

    case CardStates.ORDERING:
      classes.push("hidden");
      break;

    case CardStates.PREVIEW:
      classes.push("preview");
      classes.push("hide-handle");
      break;

    case CardStates.RESPONSE:
      classes.push("response");
      classes.push("hide-handle");
      break;

    case CardStates.GHOST:
      classes.push("ghost");
      classes.push("highlight");

    default:
      break;
  }

  const _onGrab = (event) => {
    event.preventDefault();
    if (state !== CardStates.EDITTING) return;
    onGrab();
  };

  const className = classes.join(" ");
  return (
    <div
      className={className}
      style={{
        height: state === CardStates.RESPONSE ? null : CardStyle.HEIGHT,
      }}>
      <CommonComponent></CommonComponent>
      <button
        className={"delete" + (onDelete ? "" : " disabled")}
        onClick={onDelete}>
        <img src={delBtn} alt="Delete button"></img>
      </button>
      <div className="handle" onMouseDown={_onGrab}>
        <img src={hanleImage} alt="Handle"></img>
      </div>
    </div>
  );
}
