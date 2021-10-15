import React, { useRef } from "react";

import { CardStates, CardTypes } from "../../../../constants";
import setNestedState from "../../../../utils/setNestedState";

// import { useThrottleWithTimeout } from "../../../../hooks/useThrottle";
// import { useState, useEffect } from "react"
// 질문 자동 추천 관련 import

// Hooks
import { useQuestion } from "../../../../contexts/QuestionContext";

// Components
import ToggleSwitch from "../../../ToggleSwitch/ToggleSwitch";
import Hider from "../../../Hider/Hider";

// Question types
import Default from "../QuestionTypes/Default/Default";
import { MultipleChoices, SingleChoices } from "../QuestionTypes/Choice/Choice";
import Preference from "../QuestionTypes/Preference/Preference";
import { LongSentence, ShortSentence } from "../QuestionTypes/Sentence/Sentence";
import Empty from "../QuestionTypes/Empty/Empty";

// Scss
import "./QuestionCommon.scss";
import delBtn from "../../../../assets/icons/del-btn1.svg";
import ExpandableInput from "../../../ExpandableInput/ExpandableInput";

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
  const { state, question, setQuestion, isLast } = useQuestion();
  const ref = useRef(null);
  const questionImg = question.img;
  const setQuestionImg = setNestedState(setQuestion, ["img"]);

  // const [suggestionList, setSuggestionList] = useState([""]);
  // const [isTyping, setIsTyping] = useState(false);
  // const suggestQuestion = useThrottleWithTimeout(async () => {
  //   try {
  //     const [data] = await API.postSuggestion(question.title);
  //     const temp = [];
  //     if (data) {
  //       for (let i = 0; i < data.length; i++) {
  //         temp.push(JSON.parse(data[i][1]).title);
  //       }
  //       setSuggestionList(temp);
  //     }
  //   } catch {
  //     // Ignore error
  //   }
  // }, 500);

  // useEffect(() => {
  //   suggestQuestion();
  // }, [question.title]);

  // const onFocus = () => {
  //   setIsTyping(true);
  // };

  // const outFocus = () => {
  //   setTimeout(() => {
  //     setIsTyping(false);
  //   }, 100);
  // };

  // function onSuggestion(suggestion) {
  //   const newQuestion = question;
  //   newQuestion.title = suggestion;
  //   setQuestion(newQuestion);
  //   setIsTyping(false);
  // }

  const QuestionDetail = getQuestionDetail(question.type);
  const isResponse = state !== CardStates.EDITTING;
  const isEditing = state === CardStates.EDITTING;
  const isEmpty = question.type === CardTypes.EMPTY;

  const onDelete = () => {
    setQuestionImg(null);
  };

  return (
    <div className="question-common" ref={ref}>
      <div className="question-detail-box">
        <div className="question-title-box">
          {question.isRequired && (
            <span className="requirement-tag">
              <p>필수</p>
            </span>
          )}
          <div className={!isEmpty ? "basic" : "basic empty"}>
            <div className="question">
              <ExpandableInput
                placeholder={!isLast ? "더 폼 나는 질문" : "종료 메시지를 작성해주세요."}
                text={question.title}
                setText={setNestedState(setQuestion, ["title"])}
                type="title"
                // onFocus={onFocus}
              />
            </div>
            {(isEditing || question.description) && (
              <>
                <div className="description">
                  <ExpandableInput
                    placeholder="더 폼 나는 설명 (선택)"
                    text={question.description}
                    setText={setNestedState(setQuestion, ["description"])}
                    type="description"
                  />
                </div>
              </>
            )}
          </div>
          {questionImg && (
            <div className="img-card">
              <img className="question-img" src={questionImg} alt="" />
              {isEditing && (
                <button className="del-btn" onClick={onDelete} tabIndex="-1">
                  <img src={delBtn} alt="delete button" />
                </button>
              )}
            </div>
          )}

          {/* <Hider
            hide={!isTyping || !question.title || (question.title && question.title.length <= 3)}>
            <div className="suggestions">
              {suggestionList.map((suggestion, i) => {
                if (i <= 3)
                  return (
                    <div key={i} className="suggestion" onClick={() => onSuggestion(suggestion)}>
                      {suggestion}
                    </div>
                  );
                return false;
              })}
            </div>
          </Hider> */}
        </div>
        <QuestionDetail />
      </div>
      <div className="question-common-box">
        <div className="control-box">
          <Hider hide={isResponse || isEmpty}>
            <ToggleSwitch
              isRequired={question.isRequired}
              setIsRequired={setNestedState(setQuestion, ["isRequired"])}
              selectedLabel="필수응답"
              unselectedLabel="선택응답"
            />
          </Hider>
        </div>
      </div>
    </div>
  );
}
