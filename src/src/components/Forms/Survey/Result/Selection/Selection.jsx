import React, { useState } from "react";
import "./Selection.scss";
import IntegerField from "../../../../IntegerField/IntegerField";

/**
 * This function generates random number in (0,1) from the given seed.
 * @param {*} seed
 * @returns Number
 */
function getPseudoRandom(seed) {
  let randomNumber = Math.E;
  for (let i = 0; i < seed.length; i++) {
    randomNumber *= seed.charCodeAt(i);
    randomNumber -= Math.floor(randomNumber);
  }
  return randomNumber;
}

function isColumnCriteria(question) {
  return (
    question.type.indexOf("sentence") >= 0 &&
    (question.title.indexOf("메일") >= 0 ||
      question.title.indexOf("mail") >= 0 ||
      question.title.indexOf("번호") >= 0 ||
      question.title.indexOf("휴대폰") >= 0 ||
      question.title.indexOf("이름") >= 0 ||
      question.title.indexOf("나이") >= 0 ||
      question.title.indexOf("취미") >= 0 ||
      question.title.indexOf("별명") >= 0 ||
      question.title.indexOf("학번") >= 0 ||
      question.title.indexOf("사번") >= 0 ||
      question.title.indexOf("닉네임") >= 0)
  );
}

export default function Selection({ columns, rows }) {
  const [winnerType, setWinnerType] = useState("timestamp");
  const [winnerNumber, setWinnerNumber] = useState(0);
  const [criterion, setCriterion] = useState(null);

  const criteriaButtons = columns
    .map((question, index) => [question, index])
    .filter(([question]) => isColumnCriteria(question))
    .map(([{ title }, index]) => {
      return (
        <button
          className={"btn " + (index === criterion ? "" : "disabled")}
          onClick={() => setCriterion(criterion === index ? null : index)}
          key={index}>
          {title}
        </button>
      );
    });

  let filteredAnswers = [];
  let maxWinnersNumber = 0;
  if (criterion) {
    filteredAnswers = rows
      .filter((x) => x[criterion].length !== 0)
      .map((x, i) => <p key={i}>{x[criterion]}</p>);
    if (winnerType === "random") {
      let seed = JSON.stringify(rows);
      filteredAnswers.sort(() => {
        const random = getPseudoRandom(seed);
        seed = random + "";
        return random - 0.5;
      });
    }
    maxWinnersNumber = filteredAnswers.length;
    filteredAnswers = filteredAnswers.filter((_, i) => i < winnerNumber);
  }

  return (
    <div className="get-winner">
      <div className="controller">
        <h1>추첨 기준과 추첨 인원을 추천해주세요.</h1>
        <div className="header">
          <div className="type-button">
            <button
              onClick={() => setWinnerType("timestamp")}
              className={"btn rg " + (winnerType === "timestamp" ? "" : "disabled")}>
              시간순 추첨
            </button>
            <button
              onClick={() => setWinnerType("random")}
              className={"btn rg " + (winnerType === "random" ? "" : "disabled")}>
              랜덤 추첨
            </button>
            <IntegerField
              placeholder="숫자 입력"
              number={winnerNumber}
              setNumber={criterion && setWinnerNumber}
              max={maxWinnersNumber}
              onClick={(e) => e.target.select()}
              label="추첨수"
            />
          </div>
        </div>
        {criteriaButtons.length ? (
          <h1>어떤 질문을 기준으로 추첨할지 선택해 주세요.</h1>
        ) : (
          <h1 className="no-filter">
            필터링할 질문이 없습니다. <br />
            다음과 같이 개인을 식별할 수 있는 단어가 포함된 질문이 필요합니다.
            <br />
            <br />
            예) 이름, 이메일, 전화번호, 학번 등
          </h1>
        )}
        <div className="criteria">{criteriaButtons}</div>
      </div>

      <div className="answers">
        {filteredAnswers || <p>왼쪽 버튼을 누르면 여기에 결과가 추첨됩니다.</p>}
      </div>
    </div>
  );
}
