// React elements
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Utils
import API from "utils/apis";
import setNestedState from "utils/setNestedState";

// Contexts
import { useModal } from "contexts/ModalContext";
import { useMessage } from "contexts/MessageContext";
import { useQuestion } from "contexts/QuestionContext";
import { useGlobalState } from "contexts/GlobalContext";

// Components
import Hider from "components/Hider/Hider";
import Empty from "components/QuestionTypes/Empty/Empty";
import Tooltip from "components/Tooltip/Tooltip";
import Default from "components/QuestionTypes/Default/Default";
import Preference from "components/QuestionTypes/Preference/Preference";
import ToggleSwitch from "components/ToggleSwitch/ToggleSwitch";
import { MultipleChoices, SingleChoices } from "components/QuestionTypes/Choice/Choice";
import { LongSentence, ShortSentence } from "components/QuestionTypes/Sentence/Sentence";

// Assets
import delBtn from "assets/icons/del-btn1.svg";
import imgAddBtn from "assets/icons/img-btn.svg";
import deleteButton from "assets/icons/del-btn.svg";
import duplicateButton from "assets/icons/duplicate-btn.svg";
import ExpandableInput from "components/ExpandableInput/ExpandableInput";

// Others
import { CardStates, CardTypes, DOMAIN } from "constants.js";
import "./QuestionCommon.scss";
import { useThrottle } from "hooks/useThrottle";

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

function SuggestionDropdown({ visible, query, onSelect, n = 3 }) {
  const [suggestionList, setSuggestionList] = useState([]);
  const ref = useRef(null);

  useThrottle(async () => {
    try {
      const [data] = await API.getSuggestion(query);
      setSuggestionList(data.map((x) => x[1]));
    } catch {
      // Ignore error
    }
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current) return;
      let node = e.target;
      let isOutside = true;
      while (node) {
        if (node === ref.current) {
          isOutside = false;
          break;
        }
        node = node.parentNode;
      }
      if (isOutside) onSelect(null);
    };
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  });

  if (!visible || suggestionList.length === 0) return null;

  return (
    <div className="suggestions" ref={ref}>
      {suggestionList.map((suggestion, i) => {
        if (i >= n) return null;
        return (
          <div key={i} className="suggestion" onClick={() => onSelect(suggestion)}>
            {suggestion.title}
          </div>
        );
      })}
    </div>
  );
}

export default function QuestionCommon({ handleOnDelete, handleOnDuplicate }) {
  const { state, surveyId, question, setQuestion, isLast } = useQuestion();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const questionImg = question.img;
  const setQuestionImg = setNestedState(setQuestion, ["img"]);
  const { publish } = useMessage();
  const { load } = useModal();
  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${location}`;
  const { token } = useGlobalState();
  const isRoot = location === "https://the-form.io/" || location === "https://dev.the-form.io/";
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleFocus = (e) => {
    e.stopPropagation();
    setShowSuggestion(true);
  };

  const handleSuggestionSelection = (suggestion) => {
    setShowSuggestion(false);
    if (!suggestion) return;
    setQuestion((question) => ({ ...question, ...suggestion }));
  };

  const QuestionDetail = getQuestionDetail(question.type);
  const isResponse = state !== CardStates.EDITING;
  const isEditing = state === CardStates.EDITING;
  const isEmpty = question.type === CardTypes.EMPTY;

  const getImage = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!token) {
      load({
        children: (
          <>
            <h2 style={{ fontWeight: "700" }}>🗝 유저만 사용할 수 있는 기능입니다🗝</h2>
            <p style={{ fontWeight: "500", marginTop: "2rem", marginBottom: "2rem" }}>
              1초만에 로그인하고 더 폼 나게 설문을 만들어보세요 👏
            </p>
          </>
        ),
        href,
      });
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
        load({
          children: (
            <>
              <h2 style={{ fontWeight: "700", marginTop: "2rem" }}>
                🗝 유저만 사용할 수 있는 기능입니다🗝
              </h2>
              <p style={{ fontWeight: "500", marginTop: "2rem" }}>
                1초만에 로그인하고 더 폼 나게 설문을 만들어보세요 👏
              </p>
            </>
          ),
          href,
        });
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

  return (
    <div className="question-common" ref={ref}>
      <div className="question-detail-box">
        <div className="question-title-box">
          {question.isRequired && (
            <span className="requirement-tag">
              <p>필수</p>
            </span>
          )}
          <SuggestionDropdown
            query={question.title}
            visible={showSuggestion}
            onSelect={handleSuggestionSelection}
          />
          <div className={!isEmpty ? "basic" : "basic empty"}>
            <div className="question">
              <ExpandableInput
                onClick={handleFocus}
                placeholder={!isLast ? "더 폼 나는 질문" : "종료 메시지를 작성해주세요."}
                text={question.title}
                setText={setNestedState(setQuestion, ["title"])}
                type="title"
                center={isEmpty}
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
                    center={isEmpty}
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
        </div>
        <QuestionDetail />
      </div>
      <div className="question-common-box">
        <div className="control-box">
          <Hider hide={isResponse || isLast || isRoot}>
            <Hider hide={isEmpty}>
              <ToggleSwitch
                isRequired={question.isRequired}
                setIsRequired={setNestedState(setQuestion, ["isRequired"])}
                selectedLabel="필수응답"
                unselectedLabel="선택응답"
              />
            </Hider>
            <div className="btn-box">
              {!isRoot && (
                <div className="img-btn-box">
                  <label className="img-btn">
                    <Tooltip text="이미지는 최대 5MB까지 업로드 가능합니다." size="lg" pos="bottom">
                      <img src={imgAddBtn} alt="image add button"></img>
                    </Tooltip>
                    <input type="file" accept="image/*" onChange={getImage}></input>
                  </label>
                  {isLoading && <p className="loading-indicator">업로드중</p>}
                </div>
              )}
              <Tooltip text="이 질문을 복사합니다." size="lg" pos="bottom">
                <button
                  className={"common-btn dup " + (isEditing ? "" : "hidden")}
                  tabIndex={isEditing ? null : "-1"}
                  onClick={handleOnDuplicate}>
                  <img src={duplicateButton} alt="duplicate button" />
                </button>
              </Tooltip>
              <Tooltip text="이 질문을 삭제합니다." size="lg" pos="bottom">
                <button
                  className={"common-btn del " + (isEditing ? "" : "hidden")}
                  tabIndex={isEditing ? null : "-1"}
                  onClick={handleOnDelete}>
                  <img src={deleteButton} alt="delete button" />
                </button>
              </Tooltip>
            </div>
          </Hider>
        </div>
      </div>
    </div>
  );
}
