import React, { useEffect, useState } from 'react';
import { getApi } from "../utils/parser";

const withSurvey = Component => props => {

  const surveyId = props.match.params.link;
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { result: survey } = await getApi(`/surveys/${surveyId}`);
      if (!survey.counter) survey.counter = 0;
      if (!survey.questions) survey.questions = [];
      setSurvey(survey);
    };
    init();
  }, [surveyId]);

  return (
    <Component {...props} surveyId={surveyId} survey={survey} setSurvey={setSurvey} />
  );
};

export default withSurvey;