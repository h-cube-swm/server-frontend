import React, { useEffect, useState } from 'react';
import { API } from "../utils/apis";

const withSurveyEnding = Component => props => {

  const [ending, setEnding] = useState(null);

  const surveyId = props.match.params.link;

  useEffect(() => {
    const getEndData = async () => {
      try {
        const [json] = await API.endSurvey(surveyId);
        const { result } = json;
        const ending = {
          description: result['description'],
          resultLink: result['result_link'],
          status: result['status'],
          surveyLink: result['survey_link'],
          title: result['title'],
        };
        setEnding(ending);
      } catch (e) {
      }
    };
    getEndData();
  }, [surveyId]);

  return <Component {...props} ending={ending} />;
};

export default withSurveyEnding;