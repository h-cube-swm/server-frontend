import React, { useState } from "react";

import { CardStates } from "../constants";
import setNestedState from "../../../../utils/setNestedState";
import "./Response.scss";
import logo from "../../../../assets/images/logo.png";
import { API } from "../../../../utils/apis";

// HOCs
import withSurvey from "../../../../hocs/withSurvey";

// Components
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import TextField from "../../../TextField/TextField";
import { Link, Redirect } from "react-router-dom";
import QuestionCommon from "../QuestionCommon/QuestionCommon";
import Loading from "../../../Loading/Loading";

function checkEntered(response) {
  if (response === null) return false;
  if (typeof response === "undefined") return false;
  if (typeof response === "object")
    return Object.values(response).filter((x) => x).length > 0;
  if (typeof response === "string") return response.length > 0;

  return true;
}

function Response({ survey, surveyId }) {
  const [responses, setResponses] = useState({ index: 0 });
  const [redirect, setRedirect] = useState(null);
  const { questions } = survey;
  const { index } = responses;
  const question = questions[index];
  const response = responses[question.id];
  const setIndex = setNestedState(setResponses, ["index"]);

  if (!survey) return <Loading />;
  if (redirect) return <Redirect to={redirect} />;

  const getMove = (index) => () => setIndex(index);
  const onSubmit = async () => {
    const body = { answer: responses };
    await API.postResponse(surveyId, body);
    setRedirect("/forms/survey/response/ending");
  };

  let buttons = [];

  const isAnswered = !question.isRequired || checkEntered(response);
  if (index > 0) {
    buttons.push(
      <button key="previous" className="btn" onClick={getMove(index - 1)}>
        이전으로
      </button>
    );
  }
  if (index < questions.length - 1) {
    buttons.push(
      <button
        key="next"
        className={"btn " + (isAnswered ? "" : "disabled")}
        onClick={isAnswered ? getMove(index + 1) : () => {}}>
        다음으로
      </button>
    );
  }
  if (index === questions.length - 1) {
    buttons.push(
      <button
        key="finished"
        className={"btn " + (isAnswered ? "" : "disabled")}
        onClick={isAnswered ? onSubmit : () => {}}>
        완료
      </button>
    );
  }

  return (
    <div className="response">
      <div className="survey-header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="info">
          <TextField text={survey ? survey.title : ""} size="title" multiline />
          <TextField
            text={survey ? survey.description : ""}
            size="xl"
            multiline
          />
        </div>
      </div>
      <div className="contents-box">
        {questions.map((question, i) => {
          const { id } = question;

          const classes = ["question-box"];

          if (i < index) classes.push("left");
          if (i > index) classes.push("right");

          const className = classes.join(" ");

          return (
            <QuestionProvider
              state={CardStates.RESPONSE}
              question={question}
              key={id}
              response={responses[id]}
              setResponse={setNestedState(setResponses, [id])}>
              <div className={className}>
                <div className="question-box-inner">
                  <QuestionCommon />
                </div>
              </div>
            </QuestionProvider>
          );
        })}
      </div>
      <div className="button-box">
        <div className="button-box-inner">{buttons}</div>
      </div>
    </div>
  );
}

export default withSurvey(Response);
