import React from "react";
import { Link, Redirect } from "react-router-dom";
import { API } from "../../../../utils/apis";
import Loading from "../../../Loading/Loading";
import ChoiceView from "./ViewTypes/ChoiceView/ChoiceView";
import SentenceView from "./ViewTypes/SentenceView/SentenceView";
import PreferenceView from "./ViewTypes/PreferenceView/PreferenceView";
import TextField from "../../../TextField/TextField";
import GetWinner from "./GetWinner/GetWinner";
import { CardTypes } from "../constants";
import { utils, writeFile } from "xlsx";

import Table from "../../../Table/Table";

/* Assets */
import "./Result.scss";
import logo from "../../../../assets/images/logo.png";
import ViewFrame from "./ViewFrame/ViewFrame";

const VIEW_DICT = {
  [CardTypes.SINGLE_CHOICE]: ChoiceView,
  [CardTypes.MULTIPLE_CHOICE]: ChoiceView,
  [CardTypes.SHORT_SENTENCE]: SentenceView,
  [CardTypes.LONG_SENTENCE]: SentenceView,
  [CardTypes.PREFERENCE]: PreferenceView,
};

function answerToString(answer) {
  if (answer instanceof Object) {
    return Object.entries(answer)
      .filter(([_, value]) => value)
      .map((x) => x[0])
      .join(", ");
  }
  return answer + "";
}

function reshapeAnswerTo2DArray(survey, answers) {
  const { questions } = survey;
  let questionDict = {};
  let answerList = [];

  // Construct questionDict.
  // QuestionDict map question id to question index.
  questions.forEach((question, i) => {
    questionDict[question.id] = i;
  });

  // Answers is just 2D array of answers.
  answers.forEach(({ answer }) => {
    const newAnswer = Array(questions.length).fill(null);
    Object.entries(answer).forEach(([key, value]) => {
      if (key === "index") return;
      const questionIndex = questionDict[key];
      newAnswer[questionIndex] = value;
    });
    answerList.push(["asd"].concat(newAnswer));
  });

  return [
    [{ title: "응답 시각", type: "timestamp" }].concat(questions),
    answerList,
  ];
}

function ChartView({ columns, rows }) {
  const charts = columns.map((question, i) => {
    const type = question.type;
    const key = question.id;
    const answers = rows.map((x) => x[i]);

    const View = VIEW_DICT[type];
    if (!View) return null;

    return (
      <ViewFrame key={key}>
        <View question={question} answers={answers}></View>
      </ViewFrame>
    );
  });
  return <div className="charts">{charts}</div>;
}

function TableView({ columns, rows }) {
  rows = rows.map((row) => row.map((cell) => answerToString(cell)));
  return <Table columns={columns} rows={rows} />;
}

export default function Result({ match, location }) {
  // Parse result id and view mode from url
  const resultId = match.params.link;
  const viewMode = location.hash.replace("#", "");

  // Load response data
  const [result, err] = API.useResponses(resultId);
  if (err && result.status === 400)
    return <Redirect to="/error/wrongResultId" />;
  if (err) return <Redirect to="/error/unexpected/cannot-get-result" />;
  if (!result) return <Loading />;

  // Check view mode
  const isTable = viewMode === "table";
  const isWinner = viewMode === "winner";
  const isChart = !isTable && !isWinner;

  // Parse response data
  const { survey, answers } = result;
  const [columns, rows] = reshapeAnswerTo2DArray(survey, answers);

  // Get content from viewMode
  let content = null;
  if (isWinner) content = <GetWinner columns={columns} rows={rows} />;
  if (isChart) content = <ChartView columns={columns} rows={rows} />;
  if (isTable)
    content = <TableView columns={columns.map((x) => x.title)} rows={rows} />;

  // Export to xlsx file
  const exportToXlsx = async () => {
    const xlsxColumn = columns.map(({ title }) => title);
    const workSheetData = [xlsxColumn, ...rows];
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(workSheetData);
    utils.book_append_sheet(wb, ws, "Sheet 1");
    await writeFile(wb, survey.title + ".xlsx");
  };

  // Export to image
  const exportToImg = () => {
    const tags = document.getElementsByTagName("canvas");

    for (let i = 0; i < tags.length; i++) {
      const cnv = tags[i];
      const link = document.createElement("a");
      link.download = columns[i].title + ".png";
      link.href = cnv.toDataURL();
      link.click();
    }
  };

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
        </div>
        <h3>
          총 응답 수 <strong>{answers.length}</strong>
        </h3>
      </div>
      <div className="content">{content}</div>
      <div className="btn-box">
        <div className="export-button">
          <button className="btn rg xlsx" onClick={exportToXlsx}>
            .xlsx
            <br />
            <strong>다운로드</strong>
          </button>
          <button className="btn rg image" onClick={exportToImg}>
            차트
            <br />
            <strong>다운로드</strong>
          </button>
        </div>
        <div className="partition"></div>
        <Link to={`#${isTable ? "chart" : "table"}`} className="btn rg change">
          {isTable ? "차트 보기" : "표 보기"}
        </Link>
        <Link
          className="btn rg get-winner-btn"
          to={`#${isWinner ? "chart" : "winner"}`}>
          {isWinner ? "돌아가기" : "응답자 추첨"}
        </Link>
      </div>
    </div>
  );
}
