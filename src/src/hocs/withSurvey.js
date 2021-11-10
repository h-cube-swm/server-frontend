import React, { useState } from "react";
import Loading from "../components/Loading/Loading";
import API from "../utils/apis";
import { tryUnhash } from "../utils/hasher";
import Error from "../components/Error/Error";

const withSurvey = (Component) => (props) => {
  const [timestamp, setTimestamp] = useState(Date.now());
  let surveyId = props.match.params.link;
  surveyId = tryUnhash(surveyId);

  // Load survey data from server
  const [survey, err] = API.useSurvey(surveyId, "edit", timestamp);
  if (err) return <Error type="cannot-load-survey" />;
  if (!survey) return <Loading />;
  const newProps = { ...props, survey, setTimestamp };
  return <Component {...newProps} />;
};

export default withSurvey;
