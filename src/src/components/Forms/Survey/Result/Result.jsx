import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { API } from "../../../../utils/apis";
import Loading from "../../../Loading/Loading";
import ChoiceView from "./ViewTypes/ChoiceView/ChoiceView";
import SentenceView from "./ViewTypes/SentenceView/SentenceView";
import PreferenceView from "./ViewTypes/PreferenceView/PreferenceView";
import TextField from "../../../TextField/TextField";
import Tables from "./Tables";
import { CardTypes } from "../constants";

/* Assets */
import "./Result.scss";
import logo from "../../../../assets/images/logo.png";

/**
 * Refactor survey+answers to
 * [
 *   {
 *      question
 *      answers
 *   },
 *   ...
 *  ]
 * @param {Object} survey
 * @param {Array} answers
 * @returns Array
 */

const VIEW_DICT = {
  [CardTypes.SINGLE_CHOICE]: ChoiceView,
  [CardTypes.MULTIPLE_CHOICE]: ChoiceView,
  [CardTypes.SHORT_SENTENCE]: SentenceView,
  [CardTypes.LONG_SENTENCE]: SentenceView,
  [CardTypes.PREFERENCE]: PreferenceView,
};

function reshapeAnswer(survey, answers) {
  const { questions } = survey;
  let answerDict = {};
  const answerList = [];

  questions.forEach((question, i) => {
    answerDict[question.id] = i;
    answerList.push({ question, answers: [] });
  });

  answers.forEach(({ answer }) => {
    Object.entries(answer).forEach(([key, value]) => {
      answerList[answerDict[key]].answers.push(value);
    });
  });

  return answerList;
}

export default function Result({ match }) {
  const [isChart, setIsChart] = useState(true);
  const resultId = match.params.link;

  const [result, err] = API.useResponses(resultId);
  if (err && result.status === 400)
    return <Redirect to="/error/wrongResultId" />;
  if (err) return <Redirect to="/error/unexpected" />;
  if (!result) return <Loading />;

  const { survey, answers } = result;
  const { questions } = survey;
  const answerList = reshapeAnswer(survey, answers);

  let charts = answerList.map(({ question, answers }) => {
    const type = question.type;
    const key = question.id;

    const View = VIEW_DICT[type];
    if (!View) return null;

    return <View key={key} question={question} answers={answers}></View>;
  });

  return (
    <div className="result">
      <div>총 질문 문항수는 {questions.length}</div>
      <div>총 응답수는 {answers.length}</div>
      <div className="charts">{contents}</div>
      <button>다운로드</button>
    </div>
  );
}
