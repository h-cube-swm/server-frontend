import React, { useEffect, useState } from 'react';
import getQuestion from "../components/Forms/Survey/getQuestion";
import { getApi } from "../utils/parser";

const withSurvey = Component => props => {

  const surveyId = props.match.params.link;
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const getSurvey = async () => {
      const { result: survey } = await getApi(`/surveys/${surveyId}`);
      if (!survey.counter) survey.counter = 0;
      if (!survey.questions) survey.questions = [];
      if (survey.questions.length === 0) {
        const [counter, question] = getQuestion(survey.counter);
        survey.counter = counter;
        survey.questions.push(question);
      }

      setSurvey(survey);
    };
    getSurvey();
  }, [surveyId]);

  const newProps = { ...props, surveyId, survey, setSurvey };

  return (
    <Component {...newProps} />
  );
};

export default withSurvey;