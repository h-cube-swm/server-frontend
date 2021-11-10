import React from "react";

function queryToString(query) {
  if (!query) return "";
  const queryList = Object.entries(query).filter(([key]) => !key.startsWith("_"));
  if (queryList.length === 0) return "";
  const filteredQuery = Object.fromEntries(queryList);
  return JSON.stringify(filteredQuery);
}

export function answerToString(answer) {
  if (answer instanceof Object) {
    return Object.entries(answer)
      .filter((value) => value[1])
      .map((x) => +x[0] + 1 + "")
      .join(", ");
  }
  return answer + "";
}

export function reshapeAnswerTo2DArray(survey, answers) {
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
    const queryString = queryToString(answer.query);
    newAnswer.push(queryString);
    answerList.push(newAnswer);
  });

  return [
    [{ title: "응답 시각", type: "timestamp" }].concat(questions).concat([
      {
        title: <span>쿼리 파라미터</span>,
        type: "query",
      },
    ]),
    answerList,
  ];
}
