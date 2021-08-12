import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { API } from "../../../../utils/apis";
import Loading from "../../../Loading/Loading";
import ChoiceView from "./ViewTypes/ChoiceView/ChoiceView";
import SentenceView from "./ViewTypes/SentenceView/SentenceView";
import PreferenceView from "./ViewTypes/PreferenceView/PreferenceView";
import TextField from "../../../TextField/TextField";
import GetWinner from "./GetWinner/GetWinner";
import { CardTypes } from "../constants";
import DataGrid from "react-data-grid";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { font } from "./malgun-normal";

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
      if (key !== "index") answerList[answerDict[key]].answers.push(value);
    });
  });
  return answerList;
}

export default function Result({ match, location }) {
  const resultId = match.params.link;
  const viewMode = location.hash.replace("#", "");
  const isTable = viewMode === "table";
  const [isOpen, setIsOpen] = useState(false);

  const changeOpen = () => {
    setIsOpen(!isOpen);
  };

  const [result, err] = API.useResponses(resultId);
  if (err && result.status === 400)
    return <Redirect to="/error/wrongResultId" />;
  if (err) return <Redirect to="/error/unexpected/cannot-get-result" />;
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

  const rows = answers.map(({ submit_time: timestamp, answer }) => {
    let row = { ...answer };
    Object.keys(row).forEach((key) => {
      if (key !== "index") row[key] = valueToRow(key, row[key]);
    });
    row.timestamp = timestamp;
    return row;
  });

  const exportToXlsx = async () => {
    const xlsxColumn = columns.map(({ name }) => name);
    const xlsxRows = rows.map((obj) => {
      let xlsxRow = Object.values(obj);
      xlsxRow.unshift(xlsxRow.pop());
      return xlsxRow;
    });
    xlsxRows.unshift(xlsxColumn);
    const workSheetData = xlsxRows;
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(workSheetData);
    utils.book_append_sheet(wb, ws, "Sheet 1");
    await writeFile(wb, "filename.xlsx");
  };

  const exportToPdf = async () => {
    const pdfColumn = [columns.map(({ name }) => name)];
    const pdfRows = rows.map((obj) => {
      let pdfRow = Object.values(obj);
      pdfRow.unshift(pdfRow.pop());
      return pdfRow;
    });
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
    });
    doc.addFileToVFS("MyFont.ttf", font);
    doc.addFont("MyFont.ttf", "MyFont", "normal");
    doc.setFont("MyFont");

    autoTable(doc, {
      head: pdfColumn,
      body: pdfRows,
      horizontalPageBreak: true,
      styles: {
        cellPadding: 1.5,
        font: "MyFont",
        fontStyle: "normal",
        fontSize: 8,
        cellWidth: "wrap",
      },
      tableWidth: "wrap",
    });
    await doc.save("filename.pdf");
  };

  if (isOpen) return <GetWinner changeOpen={changeOpen} answers={answers} />;

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
        <button className="btn rg" onClick={changeOpen}>
          응답자
          <br />
          추첨
        </button>
        <h3>
          총 응답 수 <strong>{answers.length}</strong>
        </h3>
      </div>
      {isTable ? (
        <DataGrid
          className="data-grid"
          key="grid"
          columns={columns}
          rows={rows}
          defaultColumnOptions={{
            resizable: true,
          }}
        />
      ) : (
        <div className="charts">{charts}</div>
      )}
      <div className="btn-box">
        <div className="export-button">
          <button className="btn rg xlsx" onClick={exportToXlsx}>
            .xlsx
            <br />
            <strong>다운로드</strong>
          </button>
          <button className="btn rg pdf" onClick={exportToPdf}>
            pdf
            <br />
            <strong>다운로드</strong>
          </button>
        </div>
        <div className="partition"></div>
        <Link to={`#${viewModeNext}`} className="btn rg change">
          {isTable ? "차트 보기" : "표 보기"}
        </Link>
      </div>
    </div>
  );
}
