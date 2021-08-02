import React from "react";
import { CardStates, CardTypes } from "../constants";
import setNestedState from "../../../../utils/setNestedState";
import { useQuestion } from "../../../../contexts/QuestionContext";

// Components
import ToggleSwitch from "../../../ToggleSwitch/ToggleSwitch";
import TextField from "../../../TextField/TextField";
import Hider from "../../../Hider/Hider";

// Question types
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

// Scss
import "./QuestionCommon.scss";

function getQuestionDetail(type) {
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

  const QuestionDetail = getQuestionDetail(question.type);
  const isEditting = state !== CardStates.EDITTING;

  return (
    <div className="question-common">
      <div className="question-common-box">
        <TextField
          placeholder="더 폼 나는 질문"
          text={question.title}
          setText={setNestedState(setQuestion, ["title"])}
          disabled={isEditting}
          size="title"
          multiline
        />
        <Hider hide={isEditting}>
          <div className="required-toggle-box">
            <ToggleSwitch
              isRequired={question.isRequired}
              setIsRequired={setNestedState(setQuestion, ["isRequired"])}
              label="필수응답"
            />
          </div>
        </Hider>
      </div>
      <div className="question-detail-box">
        <QuestionDetail />
      </div>
    </div>
  );
}
