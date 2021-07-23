import React, { useEffect, useState } from 'react';
import getQuestion from "../components/Forms/Survey/getQuestion";
import { getApi, putApi } from "../utils/parser";

const withSurvey = Component => props => {

  const surveyId = props.match.params.link;
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const getSurvey = async () => {

      const { result } = await getApi(`/surveys/${surveyId}`);  //A
      const { title, description, contents } = result;          //B
      const survey = { title, description, ...contents };       //C

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

  /**
   * Send survey data to server
   */
  async function putSurvey() {

    const { title, description, ...contents } = survey;             //C
    const body = { title, description, contents, 'view': 'slide' }; //B
    return await putApi(`/surveys/${surveyId}`, body);              //A
  }

  const newProps = { ...props, surveyId, survey, setSurvey, putSurvey };

  return (
    <Component {...newProps} />
  );
};

export default withSurvey;