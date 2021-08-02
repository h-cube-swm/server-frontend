import React from "react";
import { CardStates, CardTypes } from "../constants";
import ToggleSwitch from "../../../ToggleSwitch/ToggleSwitch";
import setNestedState from "../../../../utils/setNestedState";
import TextField from "../../../TextField/TextField";
import Hider from "../../../Hider/Hider";
import { useQuestion } from "../../../../contexts/QuestionContext";
/* Components */
import Default from "../QuestionTypes/Default/Default";
import {
  MultipleChoices,
  SingleChoices,
} from "../QuestionTypes/MultipleChoice/MultipleChoice";
import Preference from "../QuestionTypes/Preference/Preference";
import {
  LongSentence,
  ShortSentence,
} from "../QuestionTypes/ShortSentence/ShortSentence";

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

export default function QuestionCommon() {
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
          <div className="basic-element">
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
