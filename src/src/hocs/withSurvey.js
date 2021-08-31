import React, { Redirect } from "react-router-dom";
import { CardTypes } from "../constants";
import getQuestion from "../components/Forms/Survey/getQuestion";
import Loading from "../components/Loading/Loading";
import API from "../utils/apis";
import { isUnhashable, unhash } from "../utils/hasher";

const withSurvey = (Component) => (props) => {
  let surveyId = props.match.params.link;
  if (isUnhashable(surveyId)) surveyId = unhash(surveyId);

  // Load survey data from server
  const [survey, err] = API.useSurvey(surveyId);
  if (err) return <Redirect to="/error/unexpected/cannot-load-survey" />;
  if (!survey) return <Loading></Loading>;

  // Reshape survey structure into one object
  if (!survey.id) survey.id = surveyId;
  if (!survey.counter) survey.counter = 0;
  if (!survey.questions) survey.questions = [];
  if (!survey.selectedIndex) survey.selectedIndex = 0;
  if (!survey.branching) survey.branching = {};
  if (survey.questions.length === 0) {
    const [counter, question] = getQuestion(survey.counter);
    survey.counter = counter;
    survey.questions.push(question);
  }
  const newProps = { ...props, survey };

  async function updateSurvey(_survey) {
    // Copy survey
    const survey = JSON.parse(JSON.stringify(_survey));

    // Filter empty choices of single choice or multiple choice
    survey.questions = survey.questions.map((question) => {
      const { type } = question;
      const filtered = { ...question };
      if (type === CardTypes.SINGLE_CHOICE || type === CardTypes.MULTIPLE_CHOICE) {
        if (filtered.choices) filtered.choices = filtered.choices.filter((x) => x);
      }
      return filtered;
    });

    // Send data to server
    return API.putSurvey(surveyId, survey);
  }

  return <Component {...newProps} updateSurvey={updateSurvey} />;
};

export default withSurvey;
