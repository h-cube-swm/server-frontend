import React, { useEffect, useState } from "react";
import { API } from "../utils/apis";

const withSurveyEnding = (Component) => (props) => {
  const [ending, setEnding] = useState(null);
  const [error, setError] = useState(null);

  const surveyId = props.surveyId;

  useEffect(() => {
    const getEndData = async () => {
      try {
        const [json] = await API.endSurvey(surveyId);
        const { result } = json;
        const ending = {
          description: result["description"],
          resultLink: result["result_link"],
          status: result["status"],
          surveyLink: result["survey_link"],
          title: result["title"],
        };
        setEnding(ending);
      } catch (e) {
        setError(e);
      }
    };
    getEndData();
  }, [surveyId]);

  if (error) return <Redirect to="/error/unexpected/cannot-end-survey" />;
  return <Component {...props} ending={ending} />;
};

export default withSurveyEnding;
