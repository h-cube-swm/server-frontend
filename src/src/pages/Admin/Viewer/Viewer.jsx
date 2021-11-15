import React from "react";
import { CardStates } from "constants.js";
import { QuestionProvider } from "contexts/QuestionContext";
import apis from "utils/apis";
import QuestionCommon from "components/QuestionCommon/QuestionCommon";
import "./Viewer.scss";

export default function Viewer({ match }) {
  const [survey, err] = apis.admin.useSurvey(match.params.id);
  if (err) return <div>Error Occurred</div>;
  if (!survey) return <div>Loading</div>;

  return (
    <div className="admin-survey-viewer">
      <div className="container">
        <h1>{survey.title}</h1>
        <p>{survey.description}</p>
        <div>
          {survey.questions.map((question, i) => {
            return (
              <div className="card" key={i}>
                <QuestionProvider
                  state={CardStates.RESPONSE}
                  surveyId={survey.id}
                  question={question}
                  isLast={false}
                  setResponse={() => {}}
                  themeColor="2b44ff">
                  <QuestionCommon></QuestionCommon>
                </QuestionProvider>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
