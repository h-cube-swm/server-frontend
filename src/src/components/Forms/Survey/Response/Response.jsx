import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import withSurvey from "../../../../hocs/withSurvey";
import setNestedState from "../../../../utils/setNestedState";
import Card from "../Card/Card";
import TextField from "../../../TextField/TextField";
import { CardStates } from "../constants";
import "./Response.scss";
import logo from "../../../../assets/images/logo.png";
import { API } from "../../../../utils/apis";
import QuestionCommon from "../QuestionCommon/QuestionCommon";

function Response({ survey, submit, surveyId }) {
  const [response, setResponse] = useState({});

  const onClick = async () => {
    const body = { answer: response };
    const [result, err] = await API.postResponse(surveyId, body);
    console.log(result, err);
  };

  let contents = null;
  if (survey) {
    const { questions } = survey;
    contents = (
      <div className="question-box">
        {questions.map((question) => {
          const { id } = question;
          return (
            <QuestionProvider
              state={CardStates.RESPONSE}
              question={question}
              key={id}
              response={response[id]}
              setResponse={setNestedState(setResponse, [id])}>
              <Card slowAppear={false}>
                <QuestionCommon></QuestionCommon>
              </Card>
            </QuestionProvider>
          );
        })}
      </div>
    );
  } else {
    <div className="loading-screen">Now Loading...</div>;
  }
  return (
    <div className="response">
      <div className="survey-header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <TextField text={survey ? survey.title : ""} size="title" multiline />
        <TextField
          text={survey ? survey.description : ""}
          size="xl"
          multiline
        />
      </div>
      <div className="contents-box">{contents}</div>
      <div className="button-box">
        <button href="#" className="link-btn-lg" onClick={onClick}>
          완료
        </button>
      </div>
    </div>
  );
}

export default withSurvey(Response);
