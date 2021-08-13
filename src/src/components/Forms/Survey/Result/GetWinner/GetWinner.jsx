import React, { useState } from "react";
import "./GetWinner.scss";
import IntegerField from "../../../../IntegerField/IntegerField";

function AnswerContentView({ contents, number, type }) {
  const filterNumber = number !== 0 ? number : contents.length;
  if (contents.length) {
    contents = contents.map((content, i) => <p key={i}>{content}</p>);
    switch (type) {
      case "random":
        contents = contents
          .sort(() => {
            return Math.random() - Math.random();
          })
          .slice(0, filterNumber);
        break;
      case "timestamp":
        contents = contents.slice(0, filterNumber);
        break;
      default:
    }
  }
  return contents;
}

export default function GetWinner({ columns: questions, rows: answerList }) {
  const [winnerType, setWinnerType] = useState("");
  const [winnerNumber, setWinnerNumber] = useState(0);
  const [answerContents, setAnswerContents] = useState([]);
  let questionSheet = [];
  let answerSheet = [];

  let questionDict = {};

  const changeWinnerType = (type) => {
    setWinnerType(type);
  };

  const onClick = (e) => {
    setAnswerContents([]);
    const contents = answerSheet[e.target.value];
    setAnswerContents(contents);
  };

  questions
    .map((question, index) => [question, index])
    .filter(
      ([question]) =>
        question.type.indexOf("sentence") >= 0 &&
        (question.title.indexOf("메일") >= 0 ||
          question.title.indexOf("mail") >= 0 ||
          question.title.indexOf("번호") >= 0 ||
          question.title.indexOf("휴대폰") >= 0 ||
          question.title.indexOf("이름") >= 0 ||
          question.title.indexOf("나이") >= 0 ||
          question.title.indexOf("취미") >= 0 ||
          question.title.indexOf("별명") >= 0)
    )
    .forEach((question, i) => {
      let tempAnswerList = [];
      answerList.forEach((answer) => {
        tempAnswerList.push(answer[question[1]]);
      });
      questionDict[question[0].title] = tempAnswerList;
    });

  Object.entries(questionDict).forEach(([question, value], i) => {
    questionSheet.push(
      <button onClick={onClick} key={i} value={i}>
        {question}
      </button>
    );
    answerSheet.push(value);
  });

  return (
    <div className="get-winner">
      <div className="contents">
        {winnerType === "random" && <h3>랜덤 추출</h3>}
        {winnerType === "timestamp" && <h3>시간순 추출</h3>}
      </div>
      <div className="questions">{questionSheet}</div>
      <div className="answers">
        {/* {answerContents.map((content, i) => (
          <p key={i}>{content}</p>
        ))} */}
        <AnswerContentView
          contents={answerContents}
          number={winnerNumber}
          type={winnerType}
        />
      </div>
      <div className="type-button">
        <button
          onClick={() => changeWinnerType("random")}
          className="btn rg random">
          랜덤 추첨
        </button>
        <button
          onClick={() => changeWinnerType("timestamp")}
          className="btn rg timestamp">
          시간순 추첨
        </button>
        <IntegerField
          number={winnerNumber}
          setNumber={setWinnerNumber}
          max={answerList.length}
          label="추첨수"
        />
      </div>
    </div>
  );
}
