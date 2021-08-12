import React, { useEffect, useRef } from "react";
import { CardStates, CardTypes } from "../constants";
import setNestedState from "../../../../utils/setNestedState";

// Hooks
import { useQuestion } from "../../../../contexts/QuestionContext";
import useScrollBlock from "../../../../hooks/useScrollBlock";

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
  const typeDict = {
    [CardTypes.SINGLE_CHOICE]: SingleChoices,
    [CardTypes.MULTIPLE_CHOICE]: MultipleChoices,
    [CardTypes.PREFERENCE]: Preference,
    [CardTypes.SHORT_SENTENCE]: ShortSentence,
    [CardTypes.LONG_SENTENCE]: LongSentence,
  };
  if (typeDict[type]) return typeDict[type];
  return Default;
}

export default function QuestionCommon() {
  const scrollRef = useRef(0);

  const { state, question, setQuestion } = useQuestion();
  const blockTitle = useScrollBlock();
  const { ref, ...blockDetail } = useScrollBlock();

  const QuestionDetail = getQuestionDetail(question.type);
  const isEditting = state !== CardStates.EDITTING;

  useEffect(() => {
    if (scrollRef.current < ref.current.scrollHeight) {
      ref.current.scroll({
        top: 999999,
        left: 0,
        behavior: "smooth",
      });
    }
    scrollRef.current = ref.current.scrollHeight;
  });

  return (
    <div className="question-common">
      <div className="question-common-box">
        <div className="question-title-box" {...blockTitle}>
          <TextField
            placeholder="더 폼 나는 질문"
            text={question.title}
            setText={setNestedState(setQuestion, ["title"])}
            size="title"
          />
        </div>
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
      <div className="question-detail-box" ref={ref} {...blockDetail}>
        <div className="question-detail-box-inner">
          <QuestionDetail />
        </div>
      </div>
    </div>
  );
}
