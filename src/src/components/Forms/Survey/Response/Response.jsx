import React, { useState } from "react";

import { CardStates } from "../constants";
import setNestedState from "../../../../utils/setNestedState";
import "./Response.scss";
import { API } from "../../../../utils/apis";

// HOCs
import withSurvey from "../../../../hocs/withSurvey";

// Components
import { QuestionProvider } from "../../../../contexts/QuestionContext";
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

  const question = index > 0 && questions[index - 1];
  const response = index > 0 && responses[question.id];
  const setIndex = setNestedState(setResponses, ["index"]);

  if (!survey) return <Loading />;
  if (redirect) return <Redirect to={redirect} />;

  const getMove = (index) => () => setIndex(index);
  const onSubmit = async () => {
    const body = { answer: responses };
    const [data, err] = await API.postResponse(surveyId, body);
    if (err) setRedirect("/error/unexpected/cannot-submit-data");
    else setRedirect("/forms/survey/response/ending");
  };

  const cover = (
    <div className="cover-box">
      <h1 className="title">{survey.title}</h1>
      <hr></hr>
      <div className="description">{survey.description}</div>
    </div>
  );
  const pages = [cover, ...questions];

  let buttons = [];

  const isAnswered =
    index === 0 || !question.isRequired || checkEntered(response);
  if (index > 0) {
    buttons.push(
      <button key="previous" className="btn rg" onClick={getMove(index - 1)}>
        이전으로
      </button>
    );
  }
  if (index < pages.length - 1) {
    buttons.push(
      <button
        key="next"
        className={"btn rg " + (isAnswered ? "" : "disabled")}
        onClick={isAnswered ? getMove(index + 1) : () => {}}>
        다음으로
      </button>
    );
  }
  if (index === pages.length - 1) {
    buttons.push(
      <button
        key="finished"
        className={"btn rg " + (isAnswered ? "" : "disabled")}
        onClick={isAnswered ? onSubmit : () => {}}>
        완료
      </button>
    );
  }

  return (
    <div className="response">
      <div className="survey-header">
        <span className="logo">
          <Link to="/" target="_blank">
            <span> Powered by</span>
            <em> the Form</em>
          </Link>
        </span>
      </div>
      <div className="contents-box">
        {pages.map((page, i) => {
          // Build class names
          const classes = ["question-box"];
          if (i < index) classes.push("left");
          if (i > index) classes.push("right");
          const className = classes.join(" ");

          if (i == 0) return <div className={className}>{page}</div>;

          // Get state
          const state = i === index ? CardStates.RESPONSE : CardStates.PREVIEW;

          const { id } = page;
          return (
            <QuestionProvider
              state={state}
              question={page}
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
