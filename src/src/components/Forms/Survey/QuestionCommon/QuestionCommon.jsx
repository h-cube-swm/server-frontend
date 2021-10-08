import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CardStates, CardTypes, DOMAIN } from "../../../../constants";
import setNestedState from "../../../../utils/setNestedState";

import API from "../../../../utils/apis";
// import { useThrottleWithTimeout } from "../../../../hooks/useThrottle";
// import { useState, useEffect } from "react"
// 질문 자동 추천 관련 import

// Hooks
import { useQuestion } from "../../../../contexts/QuestionContext";
import useScrollBlock from "../../../../hooks/useScrollBlock";

// Components
import ToggleSwitch from "../../../ToggleSwitch/ToggleSwitch";
import TextField from "../../../TextField/TextField";
import Hider from "../../../Hider/Hider";
import Tooltip from "../../../Tooltip/Tooltip";

// Question types
import Default from "../QuestionTypes/Default/Default";
import { MultipleChoices, SingleChoices } from "../QuestionTypes/Choice/Choice";
import Preference from "../QuestionTypes/Preference/Preference";
import { LongSentence, ShortSentence } from "../QuestionTypes/Sentence/Sentence";
import Empty from "../QuestionTypes/Empty/Empty";

// Scss
import "./QuestionCommon.scss";
import imgAddBtn from "../../../../assets/icons/img-btn.svg";
import delBtn from "../../../../assets/icons/del-btn1.svg";
import { useMessage } from "../../../../contexts/MessageContext";
import { useGlobalState } from "../../../../contexts/GlobalContext";

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
  const { state, surveyId, question, setQuestion, isLast } = useQuestion();
  const { ref, ...scrollBlock } = useScrollBlock();
  const setQuestionImg = setNestedState(setQuestion, ["img"]);
  const [isLoading, setIsLoading] = useState(false);
  const questionImg = question.img;
  const { publish } = useMessage();
  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${location}`;
  const isRoot = location === "https://the-form.io/" || location === "https://dev.the-form.io/";
  const { token } = useGlobalState();

  function scrollToBottom() {
    if (ref.current)
      ref.current.scrollTo({
        top: 999999999,
        behavior: "smooth",
      });
  }

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

  const getImage = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!token) {
      publish(
        "🗝 유저만 사용할 수 있는 기능입니다. 1초 만에 로그인하고 더 폼 나게 만들어보세요 🎉",
        "warning",
        <a href={href}>로그인</a>,
      );
      setIsLoading(false);
      return;
    }
    const img = e.target.files[0];
    if (!img) {
      setIsLoading(false);
      return;
    }
    if (img.size > 5242880) {
      publish("🤭 사진 용량이 너무 큽니다. 5MB 이하로 용량을 줄여주세요 ✂️", "warning");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("sid", surveyId);
    formData.append("qid", question.id);
    formData.append("file", img);
    try {
      const data = await API.postImg(formData);
      if (data[2] === 400) {
        publish(
          "🗝 유저만 사용할 수 있는 기능입니다. 로그인하고 더 폼 나게 만들어보세요 🎉",
          "warning",
          <a href={href}>로그인</a>,
        );
        setIsLoading(false);
        return;
      }
      setQuestionImg(`${data[0].result}?=${Date.now()}`);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const onDelete = () => {
    setQuestionImg(null);
  };

  const QuestionDetail = getQuestionDetail(question.type);
  const isResponse = state !== CardStates.EDITTING;
  const isEditing = state === CardStates.EDITTING;
  const isEmpty = question.type === CardTypes.EMPTY;

  return (
    <div className="question-common" ref={ref} {...scrollBlock}>
      <div className="question-common-box">
        <div className="control-box">
          <Hider hide={isResponse || isEmpty}>
            {!isRoot && (
              <div className="img-btn-box">
                <label className="img-btn">
                  <Tooltip text="이미지는 최대 5MB까지 업로드 가능합니다." size="lg">
                    <img src={imgAddBtn} alt="image add button"></img>
                  </Tooltip>
                  <input type="file" accept="image/*" onChange={getImage}></input>
                </label>
                {isLoading && <p className="loading-indicator">업로드중</p>}
              </div>
            )}
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
        <div className="question-title-box">
          {question.isRequired && (
            <span className="requirement-tag">
              <p>필수</p>
            </span>
          )}
          <div className={!isEmpty ? "basic" : "basic empty"}>
            <div className="question">
              <TextField
                placeholder={!isLast ? "더 폼 나는 질문" : "종료 메시지를 작성해주세요."}
                text={question.title}
                setText={setNestedState(setQuestion, ["title"])}
                size="title"
                // onFocus={onFocus}
              />
            </div>
            {(isEditing || question.description) && (
              <>
                <div className="description">
                  <TextField
                    placeholder="더 폼 나는 설명 (선택)"
                    text={question.description}
                    setText={setNestedState(setQuestion, ["description"])}
                    size="rg"
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
        <QuestionDetail scrollToBottom={scrollToBottom} />
      </div>
    </div>
  );
}
