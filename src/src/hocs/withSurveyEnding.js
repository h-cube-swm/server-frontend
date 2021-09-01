import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import API from "../utils/apis";

const withSurveyEnding = (Component) => (props) => {
  const [ending, setEnding] = useState(null);
  const [error, setError] = useState(null);

  const surveyId = props.match.params.link;

  useEffect(() => {
    const getEndData = async () => {
      try {
        const [json] = await API.endSurvey(surveyId);
        const { result } = json;
        setEnding(result);
      } catch (e) {
        setError(e);
      }
    };
    getEndData();
  }, [surveyId]);

  if (error) return <Redirect to="/error/unexpected/cannot-end-survey" />;
  if (!ending) return <Loading />;

  return <Component {...props} ending={ending} />;
};

export default withSurveyEnding;
