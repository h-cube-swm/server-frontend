import React from "react";
import { Redirect } from "react-router-dom";
import { API } from "../../../../utils/apis";
import Loading from "../../../Loading/Loading";
import ChoiceView from "./ViewTypes/ChoiceView/ChoiceView";
import SentenceView from "./ViewTypes/SentenceView/SentenceView";
import PreferenceView from "./ViewTypes/PreferenceView/PreferenceView";

export default function Result({ match }) {
  const resultId = match.params.link;

  const [result, err] = API.useResponses(resultId);

  if (err && err.status === 400) return <Redirect to="/error/wrongResultId" />;
  if (err) return <Redirect to="/error/unexpected" />;
  if (!result) return <Loading />;

  const { survey, answers } = result;
  const { questions } = survey;

  let answerObj = {};
  questions.forEach((question) => (answerObj[question.id] = []));
  answers.forEach(({ answer }) => {
    Object.entries(answer).map(([key, value]) => {
      answerObj[key].push(value);
    });
  });

  let contents = [];

  questions.map((question) => {
    const type = question.type;
    switch (type) {
      //   case "single-choice":
      //   case "multiple-choice":
      //     contents.push(
      //       <ChoiceView key={question.id} answers={answerObj[question.id]} />
      //     );
      //     break;
      //   case "short-sentence":
      //   case "long-sentence":
      //     contents.push(
      //       <SentenceView key={question.id} answers={answerObj[question.id]} />
      //     );
      // break;
      case "preference":
        contents.push(
          <PreferenceView key={question.id} answers={answerObj[question.id]} />
        );
        break;
      default:
        break;
    }
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
