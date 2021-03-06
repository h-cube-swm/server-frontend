import React from "react";
import { Link } from "react-router-dom";

import { utils, writeFile } from "xlsx";
import { CardTypes } from "constants.js";

import Table from "components/Table/Table";
import TextField from "components/TextField/TextField";

import API from "utils/apis";
import { answerToString, reshapeAnswerTo2DArray } from "utils/responseTools";

import Error from "pages/Error/Error";
import Loading from "pages/Loading/Loading";

import { useMessage } from "contexts/MessageContext";

import logo from "assets/images/logo.png";

import ViewFrame from "./ViewFrame/ViewFrame";
import Selection from "./Selection/Selection";
import ChoiceView from "./ViewTypes/ChoiceView/ChoiceView";
import SentenceView from "./ViewTypes/SentenceView/SentenceView";
import PreferenceView from "./ViewTypes/PreferenceView/PreferenceView";

import "./Result.scss";

const VIEW_DICT = {
  [CardTypes.SINGLE_CHOICE]: ChoiceView,
  [CardTypes.MULTIPLE_CHOICE]: ChoiceView,
  [CardTypes.SHORT_SENTENCE]: SentenceView,
  [CardTypes.LONG_SENTENCE]: SentenceView,
  [CardTypes.PREFERENCE]: PreferenceView,
  [CardTypes.EMPTY]: null,
};

function ChartView({ columns, rows }) {
  const charts = columns.map((question, i) => {
    const { type } = question;
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
  const stringRows = rows.map((row) => row.map((cell) => (cell ? answerToString(cell) : "-")));
  return <Table columns={columns} rows={stringRows} />;
}

export default function Result({ match, location }) {
  // Parse result id and view mode from url
  const resultId = match.params.link;
  const viewMode = location.hash.replace("#", "");

  const { publish } = useMessage();

  // Load response data
  const [result, err] = API.useResponses(resultId);
  if (err && result.status === 400) return <Error type="wrong-result-id" />;
  if (err) return <Error type="cannot-get-result" />;
  if (!result) return <Loading />;

  // Check view mode
  const isTable = viewMode === "table";
  const isWinner = viewMode === "winner";
  const isChart = !isTable && !isWinner;

  // Parse response data
  const { survey, responses: answers } = result;
  const [columns, rows] = reshapeAnswerTo2DArray(survey, answers);

  // Get content from viewMode
  let content = null;
  if (isWinner) content = <Selection columns={columns} rows={rows} />;
  if (isChart) content = <ChartView columns={columns} rows={rows} />;
  if (isTable) content = <TableView columns={columns.map((x) => x.title)} rows={rows} />;

  // Export to xlsx file
  const exportToXlsx = async () => {
    const cells = rows.map((row) => row.map((cell) => (cell ? answerToString(cell, true) : "-")));
    const xlsxColumn = columns.map(({ title }) => title);
    const workSheetData = [xlsxColumn, ...cells];
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(workSheetData);
    utils.book_append_sheet(wb, ws, "Survey Result");
    await writeFile(wb, survey.title + ".xlsx");
  };

  // Export to image
  const exportToImg = () => {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length === 0) {
      publish("png ????????? ????????? ???????????? ???????????? ????");
    } else {
      for (let i = 0; i < canvases.length; i++) {
        const cnv = canvases[i];
        const link = document.createElement("a");
        link.download = "Chart " + (i + 1) + ".png";
        link.href = cnv.toDataURL();
        link.click();
      }
    }
  };

  const noAnswers = <h1 className="no-answers">?????? ????????? ????????? ????????????.</h1>;

  return (
    <div className="result">
      <div className="survey-header">
        <div className="logo">
          <Link to="/" target="_blank">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="info">
          <TextField text={survey ? survey.title : ""} size="title" multiline />
        </div>
        <h3>
          ??? ?????? ??? <strong>{answers.length}</strong>
        </h3>
      </div>
      <div className="content">{answers.length === 0 ? noAnswers : content}</div>
      <div className="btn-box">
        <div className="export-button">
          {isChart && (
            <button className="btn rg png" onClick={exportToImg}>
              .png
              <br />
              <strong>????????????</strong>
            </button>
          )}
          <button className="btn rg xlsx" onClick={exportToXlsx}>
            .xlsx
            <br />
            <strong>????????????</strong>
          </button>
        </div>
        <div className="partition"></div>
        <Link to={`#${isTable ? "chart" : "table"}`} className="btn rg change">
          {isTable ? "?????? ??????" : "??? ??????"}
        </Link>
        <Link className="btn rg get-winner-btn" to={`#${isWinner ? "chart" : "winner"}`}>
          {isWinner ? "????????????" : "????????? ??????"}
        </Link>
      </div>
    </div>
  );
}
