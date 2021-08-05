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
import DataGrid from "react-data-grid";

/* Assets */
import "./Result.scss";
import logo from "../../../../assets/images/logo.png";
import ViewFrame from "./ViewFrame/ViewFrame";

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

export default function Result({ match, location }) {
  const resultId = match.params.link;
  const viewMode = location.hash.replace("#", "");
  const isTable = viewMode === "table";

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

    return (
      <ViewFrame>
        <View key={key} question={question} answers={answers}></View>
      </ViewFrame>
    );
  });

  let viewModeNext = isTable ? "chart" : "table";

  let questionDict = {};
  questions.forEach((question) => {
    questionDict[question.id] = question;
  });

  const valueToRow = (key, value) => {
    const question = questionDict[key];
    const { type } = question;

    if (
      type === CardTypes.SINGLE_CHOICE ||
      type === CardTypes.MULTIPLE_CHOICE
    ) {
      return Object.entries(value)
        .filter(([_, value]) => value)
        .map(([key]) => question.choices[key])
        .join(", ");
    }
    return value;
  };

  const columns = [{ key: "timestamp", name: "응답 시각" }];
  questions.forEach((question) => {
    columns.push({ key: question.id, name: question.title });
  });

  const rows = answers.map(({ answer, submit_time: timestamp }) => {
    let row = { ...answer };
    Object.keys(row).forEach((key) => (row[key] = valueToRow(key, row[key])));
    row.timestamp = timestamp;
    return row;
  });

  return (
    <div className="result">
      <div className="survey-header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="info">
          <TextField text={survey ? survey.title : ""} size="title" multiline />
          <TextField
            text={survey ? survey.description : ""}
            size="xl"
            multiline
          />
        </div>

        <h3>
          총 응답 수 <strong>{answers.length}</strong>
        </h3>
      </div>

      {isTable ? (
        <DataGrid
          columns={columns}
          rows={rows}
          defaultColumnOptions={{
            resizable: true,
          }}
        />
      ) : (
        <div className="charts">{charts}</div>
      )}

      <Link to={`#${viewModeNext}`}>전환</Link>
      <button>.xlsx 다운로드</button>
      <button>csv 다운로드</button>
    </div>
  );
}
