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
import { MultipleChoices, SingleChoices } from "../QuestionTypes/Choice/Choice";
import Preference from "../QuestionTypes/Preference/Preference";
import {
  LongSentence,
  ShortSentence,
} from "../QuestionTypes/Sentence/Sentence";

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
          size="title"
          multiline
        />
        <div className="required-toggle-box">
          <Hider hide={isEditting}>
            <ToggleSwitch
              isRequired={question.isRequired}
              setIsRequired={setNestedState(setQuestion, ["isRequired"])}
              selectedLabel="필수응답"
              unselectedLabel="선택응답"
            />
          </Hider>
        </div>
      </div>
      <div className="question-detail-box">
        <QuestionDetail />
      </div>
    </div>
  );
}
