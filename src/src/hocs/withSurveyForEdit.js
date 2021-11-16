import React from "react-router-dom";
import { CardTypes } from "constants.js";
import getQuestion from "utils/getQuestion";
import Loading from "pages/Loading/Loading";
import API from "utils/apis";
import { tryUnhash } from "utils/hasher";
import Error from "pages/Error/Error";

const withSurveyForEdit = (Component) => (props) => {
  let surveyId = props.match.params.link;
  surveyId = tryUnhash(surveyId);

  // Load survey data from server
  const [survey, err] = API.useSurvey(surveyId, "edit");
  if (err) return <Error type="cannot-load-survey" />;
  if (!survey) return <Loading />;

  // Reshape survey structure into one object
  if (!survey.id) survey.id = surveyId;
  if (!survey.questions) survey.questions = [];
  if (!survey.selectedIndex) survey.selectedIndex = 0;
  if (!survey.branching) survey.branching = {};
  if (!survey.themeColor) survey.themeColor = "#2b44ff";
  if (!survey.draw) survey.draw = { isEnabled: false, number: 0 };
  if (survey.questions.length === 0) {
    const question = getQuestion();
    survey.questions.push(question);
    const lastQuestion = getQuestion();
    lastQuestion.type = CardTypes.EMPTY;
    lastQuestion.isRequired = false;
    survey.questions.push(lastQuestion);
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

export default withSurveyForEdit;
