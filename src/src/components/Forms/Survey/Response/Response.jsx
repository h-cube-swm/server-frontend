import React, { useState } from "react";
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import withSurvey from "../../../../hocs/withSurvey";
import setNestedState from "../../../../utils/setNestedState";
import Card from "../Card/Card";
import { CardStates } from "../constants";
import "./Response.scss";
import { postApi } from "../../../../utils/parser";

function Response({ survey, submit, surveyId }) {
	const [response, setResponse] = useState({});
  const [data, setData] = useState({});
  const [error, setError] = useState(false);

  const onClick = () => {
    const body = { answer: response };
    const result = postApi(`/surveys/${surveyId}/responses`, body);
    result ? setData(result) : setError(true);
    if (!error) {
      setError(false);
      console.log(data);
      return;
    }
    setError(false);
    console.log("error 발생");
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
							<Card slowAppear={false} />
						</QuestionProvider>
					);
				})}
			</div>
		);
	} else {
		<div className="loading-screen">Now Loading...</div>;
	}
	return <div className="response-page">{contents}</div>;
}

export default withSurvey(Response);
