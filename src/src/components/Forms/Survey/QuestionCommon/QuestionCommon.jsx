import React from "react";
import { CardStates, CardTypes } from "../../../../constants";
import setNestedState from "../../../../utils/setNestedState";

// Hooks
import { useQuestion } from "../../../../contexts/QuestionContext";

// Components
import ToggleSwitch from "../../../ToggleSwitch/ToggleSwitch";
import TextField from "../../../TextField/TextField";
import Hider from "../../../Hider/Hider";

// Question types
import Default from "../QuestionTypes/Default/Default";
import { MultipleChoices, SingleChoices } from "../QuestionTypes/Choice/Choice";
import Preference from "../QuestionTypes/Preference/Preference";
import { LongSentence, ShortSentence } from "../QuestionTypes/Sentence/Sentence";
import Empty from "../QuestionTypes/Empty/Empty";

// Scss
import "./QuestionCommon.scss";
import useScrollBlock from "../../../../hooks/useScrollBlock";

function getQuestionDetail(type) {
  const typeDict = {
    [CardTypes.SINGLE_CHOICE]: SingleChoices,
    [CardTypes.MULTIPLE_CHOICE]: MultipleChoices,
    [CardTypes.PREFERENCE]: Preference,
    [CardTypes.SHORT_SENTENCE]: ShortSentence,
    [CardTypes.LONG_SENTENCE]: LongSentence,
    [CardTypes.EMPTY]: Empty,
  };
  if (typeDict[type]) return typeDict[type];
  return Default;
}

export default function QuestionCommon() {
  const { state, question, setQuestion } = useQuestion();
  const scrollBlock = useScrollBlock();

  const QuestionDetail = getQuestionDetail(question.type);
  const isResponse = state !== CardStates.EDITTING;

  return (
    <div className="question-common" {...scrollBlock}>
      <div className="question-common-box">
        <div className="question-title-box">
          {question.isRequired && (
            <span className="requirement-tag">
              <p>필수</p>
            </span>
          )}
          <TextField
            placeholder="더 폼 나는 질문"
            text={question.title}
            setText={setNestedState(setQuestion, ["title"])}
            size="title"
          />
        </div>
        <div className="required-toggle-box">
          <Hider hide={isResponse || question.type === CardTypes.EMPTY}>
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
