import React from 'react';
import withSurvey from "../../../../hocs/withSurvey";
import Card from "../Card/Card";
import { CardStates } from "../constants";
import './Response.scss';

function Response({ surveyId, survey }) {
  let contents = null;
  if (survey) {
    const { questions } = survey;
    contents = (
      <div className="question-box">
        {questions.map((question, index) => {
          let state = CardStates.RESPONSE;
          return (
            <Card
              question={question}
              state={state}
              slowAppear={false}
            />
          );
        })}
      </div>
    );
  } else {
    <div className="loading-screen">Now Loading...</div>;
  }
  return (
    <div className="response-page">
      {contents}
    </div>
  );
}

export default withSurvey(Response);
