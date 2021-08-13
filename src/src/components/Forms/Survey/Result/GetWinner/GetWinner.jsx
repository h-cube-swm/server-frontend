import React, { useState } from "react";
import "./GetWinner.scss";
import IntegerField from "../../../../IntegerField/IntegerField";

function AnswerContentView({ contents, number, type, random }) {
  const filterNumber = number !== 0 ? number : contents.length;

  let contentView = type === "random" ? random : contents;

  contentView = contentView.map((content, i) => <p key={i}>{content}</p>);
  return contentView.slice(0, filterNumber);
}

export default function GetWinner({ columns: questions, rows: answerList }) {
  const [winnerType, setWinnerType] = useState("timestamp");
  const [winnerNumber, setWinnerNumber] = useState(0);
  const [answerContents, setAnswerContents] = useState([]);
  const [randomContents, setRandomContents] = useState([]);

  let questionSheet = [];
  let answerSheet = [];

  let questionDict = {};

  const changeWinnerType = (type) => {
    if (type === "random") {
      const contents = [...answerContents];
      setRandomContents(
        contents.sort(() => {
          return Math.random() - Math.random();
        })
      );
      // contents = contents.sort(() => {
      //   return Math.random() - Math.random();
      // });
    }
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
          question.title.indexOf("별명") >= 0 ||
          question.title.indexOf("닉네임") >= 0)
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
      <div className="controller">
        <div className="header">
          <div className="type">
            {winnerType === "random" && <h3>랜덤 추첨</h3>}
            {winnerType === "timestamp" && <h3>시간순 추첨</h3>}
          </div>
          <div className="type-button">
            <button
              onClick={() => changeWinnerType("timestamp")}
              className="btn rg timestamp">
              시간순 추첨
            </button>
            <button
              onClick={() => changeWinnerType("random")}
              className="btn rg random">
              랜덤 추첨
            </button>
            <IntegerField
              number={winnerNumber}
              setNumber={setWinnerNumber}
              max={answerList.length}
              label="추첨수"
            />
          </div>
        </div>
        <h1>어떤 질문을 기준으로 추첨할지 선택해 주세요.</h1>
        <div className="questions">{questionSheet}</div>
      </div>

      <div className="answers">
        {answerContents.length == 0 ? (
          <p>왼쪽 버튼을 누르면 여기에 결과가 추첨됩니다.</p>
        ) : (
          <AnswerContentView
            contents={answerContents}
            random={randomContents}
            number={winnerNumber}
            type={winnerType}
          />
        )}
      </div>
    </div>
  );
}
