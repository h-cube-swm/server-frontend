import React, { useState } from "react";

// Components
import { Link, Redirect } from "react-router-dom";
import Title from "../../../Title/Title";
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import QuestionCommon from "../QuestionCommon/QuestionCommon";
import Loading from "../../../Loading/Loading";
import FadeBox from "../../../FadeBox/FadeBox";

import { CardStates, CardTypes } from "../../../../constants";
import setNestedState from "../../../../utils/setNestedState";
import "./Response.scss";
import API from "../../../../utils/apis";

// HOCs
import withSurveyForResponse from "../../../../hocs/withSurveyForResponse";
import { useGlobalState } from "../../../../contexts/GlobalContext";

import logo from "../../../../assets/images/logo-banner.GIF";
import Linkify from "../../../Linkify/Linkify";
import L from "../../../../utils/logger";

function isNumber(variable) {
  if (variable === undefined) return false;
  if (typeof variable === "boolean") return false;
  if (variable === null) return false;
  if (Number.isNaN(+variable)) return false;
  return true;
}

/**
 * Get index-based branching map (from question-id based branching map).
 *
 * Brancing map is initially dictionary of {question-choice tuple : next question}.
 * In this case, question is described by question id instead of question index because of reordering.
 * However, in response mode, question cannot be reordered.
 * Therefore, using index instead of question id is much easier approach.
 *
 * @param {Object} survey
 * @returns
 */
function getIndexBranchingMap(survey) {
  const { questions, branching } = survey;
  const idToIndex = Object.fromEntries(questions.map(({ id }, index) => [id, index]));
  const branchingMap = {};
  Object.entries(branching).forEach(([key, dest]) => {
    if (!dest) return;
    if (!(dest in idToIndex)) return;
    const [questionId, choiceIndex] = key.split(" ");
    const questionIndex = idToIndex[questionId];
    if (!isNumber(questionIndex)) return;
    if (!(questionIndex in branchingMap)) branchingMap[questionIndex] = {};
    branchingMap[questionIndex][choiceIndex] = +idToIndex[dest];
  });

  return branchingMap;
}

/**
 * Check if given response is properly responsed.
 * Used when isRequired option is enabled.
 * @param {Object} response
 * @returns
 */
function isResponsed(response) {
  if (response === null) return false;
  if (typeof response === "undefined") return false;
  if (typeof response === "object") return Object.values(response).filter((x) => x).length > 0;
  if (typeof response === "string") return response.length > 0;

  return true;
}

/**
 * ResponseContainer only does control including API call, and does not perform rendering.
 * @param {*} surveyInfo
 * @returns
 */
function ResponseContainer({ survey }) {
  const KEY_NEXT = "_next";

  const [responses, setResponses] = useState({ history: [] });
  const [redirect, setRedirect] = useState(null);
  const { params: query } = useGlobalState();
  const next = query[KEY_NEXT];
  L.useL(`ResponseStart:${survey.deployId}`);

  if (!survey) return <Loading />;
  if (redirect) return <Redirect to={redirect} />;

  const onSubmit = async () => {
    const body = { responses: { ...responses, query } };
    const err = await API.postResponse(survey.deployId, body)[1];
    if (err) {
      setRedirect("/error/unexpected/cannot-submit-data");
      return;
    }

    L.l(`ResponseEnd:${survey.deployId}`);
    if (next === "event") {
      window.parent?.postMessage("surveyEnd", "*");
    } else if (next) {
      window.location.href = next;
    } else setRedirect("/forms/survey/response/ending");
  };

  return (
    <>
      <Title>더폼 - {survey.title}</Title>
      <Response
        survey={survey}
        responses={responses}
        setResponses={setResponses}
        onSubmit={onSubmit}></Response>
    </>
  );
}

/**
 * Response only performs rendering.
 * @param {*} responseInfo
 * @returns
 */
export function Response({
  survey,
  responses,
  setResponses,
  onSubmit: handleSubmit,
  tabIndex,
  isPreview,
}) {
  // States
  const { isEmbed } = useGlobalState();
  const setHistory = setNestedState(setResponses, ["history"]);

  // Derivated states
  const { questions, themeColor } = survey;
  const { history } = responses;
  const isCover = history.length === 0;
  const currentIndex = !isCover && history[history.length - 1];
  const question = !isCover && questions[currentIndex];
  const response = question && responses[question.id];
  const indexBranchingMap = getIndexBranchingMap(survey);
  const isPassable = isCover || !question.isRequired || isResponsed(response);

  /**
   *
   * @returns {function} `next()`
   */
  const getNext = () => {
    // If not passable, just return, blocking moving
    if (!isPassable) return;

    // If it is cover screen, just go to first question
    const push = (x) => {
      if (history[history.length - 1] === x) return;
      setHistory((history) => [...history, x]);
    };

    if (isCover) {
      push(0);
      return;
    }

    // First, filter case [Answered, Has branch, Single]
    if (isResponsed(response)) {
      if (question.type === CardTypes.SINGLE_CHOICE) {
        // Because it is responsed, it is guaranteed to have an selected choice
        const selectedChoiceTuple = Object.entries(response).filter((tuple) => tuple[1])[0];
        const selectedChoice = selectedChoiceTuple[0];
        if (
          currentIndex in indexBranchingMap &&
          selectedChoice in indexBranchingMap[currentIndex]
        ) {
          // Go to selectedchoice's branch only if choice has its own branch
          push(indexBranchingMap[currentIndex][selectedChoice]);
          return;
        }
      }
    }

    if (indexBranchingMap[currentIndex]) {
      if (indexBranchingMap[currentIndex][-1]) {
        // Go to default branch
        push(indexBranchingMap[currentIndex][-1]);
        return;
      }

      if (indexBranchingMap[currentIndex][-1] === 0) {
        // It would be falsy if checked in upper, exception
        push(0);
        return;
      }
    }

    // Go to next question
    push(currentIndex + 1);
  };

  /**
   *
   * @returns {function} `previous()`
   */
  const getPrevious = () =>
    setHistory((history) => {
      const newHistory = [...history];
      newHistory.pop();
      return newHistory;
    });

  const buttons = [];

  if (history.length > 0) {
    // Which is identical to !isCover, but for clearity.
    buttons.push(
      <button
        key="previous"
        style={{ backgroundColor: themeColor }}
        className="btn sm"
        onClick={getPrevious}
        tabIndex={tabIndex}>
        이전
      </button>,
    );
  }

  if (!isCover) {
    buttons.push(
      <p key="indicator" className="indicator">{`${currentIndex + 1} / ${questions.length}`}</p>,
    );
  }

  if (isCover) {
    buttons.push(
      <button
        key="start"
        style={{ backgroundColor: themeColor }}
        className="btn rg"
        onClick={getNext}
        tabIndex={tabIndex}>
        시작
      </button>,
    );
  } else if (currentIndex < questions.length - 1) {
    buttons.push(
      <button
        key="next"
        style={{ backgroundColor: isPassable ? themeColor : "#b0b0b0" }}
        className={"btn sm " + (isPassable ? "" : "disabled")}
        onClick={getNext}
        tabIndex={tabIndex}>
        다음
      </button>,
    );
  } else if (currentIndex === questions.length - 1) {
    buttons.push(
      <button
        key="finished"
        style={{ backgroundColor: isPassable ? themeColor : "#b0b0b0" }}
        className={"btn sm " + (isPassable ? "" : "disabled")}
        onClick={isPassable ? handleSubmit : () => {}}
        tabIndex={tabIndex}>
        완료
      </button>,
    );
  }

  return (
    <div className="response">
      <div className={isEmbed || isPreview ? "survey-header embed" : "survey-header"}>
        <span className="logo">
          <Link to="/" target="_blank" tabIndex={tabIndex}>
            <span> Powered by</span>
            <img src={logo} alt="logo" />
          </Link>
        </span>
      </div>
      <div className="contents-box">
        <div className={"question-box " + (!isCover && "left")}>
          <div className="question-box-inner">
            <div className="cover-box">
              <h1 className="title">
                <Linkify>{survey.title}</Linkify>
              </h1>
              {survey.description && (
                <>
                  <div className="description">
                    <Linkify>{survey.description}</Linkify>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {questions.map((question, i) => {
          // Build class names
          const classes = ["question-box"];
          if (i < currentIndex) classes.push("left");
          if (isCover || i > currentIndex) classes.push("right");
          const className = classes.join(" ");

          // Get state
          const isSelected = i === currentIndex;
          const state = isSelected ? CardStates.RESPONSE : CardStates.PREVIEW;

          const { id } = question;
          return (
            <QuestionProvider
              state={state}
              surveyId={survey.id}
              question={question}
              key={id}
              response={responses[id]}
              setResponse={setNestedState(setResponses, [id])}
              tabIndex={isSelected ? "1" : "-1"}
              themeColor={survey.themeColor}>
              <div className={className}>
                <div className="question-box-inner">
                  <QuestionCommon />
                </div>
              </div>
            </QuestionProvider>
          );
        })}
        <FadeBox height={3} />
      </div>
      <div className="button-box">
        <div className="button-box-inner">{buttons}</div>
      </div>
    </div>
  );
}

export default withSurveyForResponse(ResponseContainer);
