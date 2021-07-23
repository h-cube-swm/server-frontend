import React, { useState } from "react";
import withSurvey from "../../../../hocs/withSurvey";
import setNestedState from "../../../../utils/setNestedState";
import Card from "../Card/Card";
import { CardStates } from "../constants";
import "./Response.scss";

function Response({ survey, submit }) {
	const [response, setResponse] = useState({});
	console.log(response);

	let contents = null;
	if (survey) {
		const { questions } = survey;
		contents = (
			<div className="question-box">
				{questions.map((question) => {
					const { id } = question;
					return (
						<Card
							key={id}
							question={question}
							state={CardStates.RESPONSE}
							slowAppear={false}
							response={response[id]}
							setResponse={setNestedState(setResponse, [id])}
						/>
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
