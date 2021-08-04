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

function Response({ survey, surveyId, match }) {
  const [response, setResponse] = useState({});
  const [contents, setContents] = useState(<></>);

  const onSubmit = async () => {
    const body = { answer: response };
    await API.postResponse(surveyId, body);
    setContents(<Redirect to="/forms/survey/response/ending" />);
  };

  if (!survey) return <Loading />;
  const { questions } = survey;

  return (
    <div className="response">
      {contents}
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
                <QuestionCommon />
              </QuestionProvider>
            );
          })}
        </div>
      </div>
      <div className="button-box">
        <button className="link-btn-lg" onClick={onSubmit}>
          완료
        </button>
      </div>
    </div>
  );
}

export default withSurvey(Response);
