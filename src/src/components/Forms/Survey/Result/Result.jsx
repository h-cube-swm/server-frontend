import React from "react";
import { Link, Redirect } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import API from "../../../../utils/apis";
import Loading from "../../../Loading/Loading";
import ChoiceView from "./ViewTypes/ChoiceView/ChoiceView";
import SentenceView from "./ViewTypes/SentenceView/SentenceView";
import PreferenceView from "./ViewTypes/PreferenceView/PreferenceView";
import TextField from "../../../TextField/TextField";
import Selection from "./Selection/Selection";
import { CardTypes } from "../../../../constants";

import Table from "../../../Table/Table";

/* Assets */
import "./Result.scss";
import logo from "../../../../assets/images/logo.png";
import ViewFrame from "./ViewFrame/ViewFrame";
import { useMessage } from "../../../../contexts/MessageContext";
// import Tooltip from "../../../Tooltip/Tooltip";

const VIEW_DICT = {
  [CardTypes.SINGLE_CHOICE]: ChoiceView,
  [CardTypes.MULTIPLE_CHOICE]: ChoiceView,
  [CardTypes.SHORT_SENTENCE]: SentenceView,
  [CardTypes.LONG_SENTENCE]: SentenceView,
  [CardTypes.PREFERENCE]: PreferenceView,
  [CardTypes.EMPTY]: null,
};

function answerToString(answer) {
  if (answer instanceof Object) {
    return Object.entries(answer)
      .filter((value) => value[1])
      .map((x) => +x[0] + 1 + "")
      .join(", ");
  }
  return answer + "";
}

function reshapeAnswerTo2DArray(survey, answers) {
  const { questions } = survey;
  const questionDict = {};
  const answerList = [];

  // Construct questionDict.
  // QuestionDict map question id to question index.
  questions.forEach((question, i) => {
    questionDict[question.id] = i;
  });

  // Answers is just 2D array of answers.
  answers.forEach(({ responses: answer, createdAt: timestamp }) => {
    let newAnswer = Array(questions.length).fill(null);
    Object.entries(answer).forEach(([key, value]) => {
      if (key === "index") return;
      if (key === undefined || key === null) return;
      const questionIndex = questionDict[key];
      if (questionIndex === undefined || questionIndex === null) return;
      newAnswer[questionIndex] = value;
    });
    // ToDo: 적절한 타입으로 파싱하기

    // Insert timestamp
    newAnswer = [new Date(timestamp).toLocaleString()].concat(newAnswer);
    // Insert query params
    newAnswer.push("query" in answer ? JSON.stringify(answer.query) : "");
    answerList.push(newAnswer);
  });

  return [
    [{ title: "응답 시각", type: "timestamp" }].concat(questions).concat([
      {
        title: (
          <span>
            쿼리 파라미터
            {/* <Tooltip text="클릭해서 쿼리 파라매터에 대해 알아보세요!" size="md">
              <a
                href="/help/query-params"
                style={{
                  // Todo : 여기 scss로 빼기
                  borderRadius: "16px",
                  width: "1rem",
                  height: "1rem",
                  marginLeft: "1rem",
                  padding: "0.2rem",
                  backgroundColor: "#aaa",
                }}>
                ?
              </a>
            </Tooltip> */}
          </span>
        ),
        type: "query",
      },
    ]),
    answerList,
  ];
}

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
  if (err && result.status === 400) return <Redirect to="/error/wrongResultId" />;
  if (err) return <Redirect to="/error/unexpected/cannot-get-result" />;
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
    const cells = rows.map((row) => row.map((cell) => answerToString(cell)));
    const xlsxColumn = columns.map(({ title }) => title);
    const workSheetData = [xlsxColumn, ...cells];
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(workSheetData);
    utils.book_append_sheet(wb, ws, "Sheet 1");
    await writeFile(wb, survey.title + ".xlsx");
  };

  // Export to image
  const exportToImg = () => {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length === 0) {
      publish("png 파일로 추출할 데이터가 없습니다 📊");
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

  const noAnswers = <h1 className="no-answers">아직 표시할 응답이 없습니다.</h1>;

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
          총 응답 수 <strong>{answers.length}</strong>
        </h3>
      </div>
      <div className="content">{answers.length === 0 ? noAnswers : content}</div>
      <div className="btn-box">
        <div className="export-button">
          <button className="btn rg png" onClick={exportToImg}>
            .png
            <br />
            <strong>다운로드</strong>
          </button>
          <button className="btn rg xlsx" onClick={exportToXlsx}>
            .xlsx
            <br />
            <strong>다운로드</strong>
          </button>
        </div>
        <div className="partition"></div>
        <Link to={`#${isTable ? "chart" : "table"}`} className="btn rg change">
          {isTable ? "차트 보기" : "표 보기"}
        </Link>
        <Link className="btn rg get-winner-btn" to={`#${isWinner ? "chart" : "winner"}`}>
          {isWinner ? "돌아가기" : "응답자 추첨"}
        </Link>
      </div>
    </div>
  );
}
