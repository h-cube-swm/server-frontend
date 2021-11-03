import React from "react-router-dom";
import Loading from "../components/Loading/Loading";
import API from "../utils/apis";
import { tryUnhash } from "../utils/hasher";
import Error from "../components/Error/Error";
import { SurveyStatus } from "../constants";

const withSurvey = (Component) => (props) => {
  let surveyId = props.match.params.link;
  surveyId = tryUnhash(surveyId);

  // Load survey data from server
  const [survey, err] = API.useSurvey(surveyId, "response");
  if (err) return <Error type="cannot-load-survey-for-response" />;
  if (!survey) return <Loading />;
  if (survey.status === SurveyStatus.FINISHED) return <Error type="finished-survey" />;
  if (survey.status === SurveyStatus.EDITING) return <Error type="editing-survey" />;
  const newProps = { ...props, survey };
  return <Component {...newProps} />;
};

export default withSurvey;
