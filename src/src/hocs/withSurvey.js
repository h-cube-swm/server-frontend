import { Redirect } from "react-router-dom";
import { CardTypes } from "../components/Forms/Survey/constants";
import getQuestion from "../components/Forms/Survey/getQuestion";
import Loading from "../components/Loading/Loading";
import { API } from "../utils/apis";
import { isUnhashable, unhash } from "../utils/hasher";

const withSurvey = Component => props => {

  let surveyId = props.match.params.link;
  if (isUnhashable(surveyId)) surveyId = unhash(surveyId);

  // Load survey data from server
  const [result, err] = API.useSurvey(surveyId);
  if (err) return <Redirect to="/error/unexpected/cannot-load-survey"></Redirect>;
  if (!result) return <Loading></Loading>;

  // Reshape survey structure into one object
  const { title, description, contents, ...meta } = result;       //A
  let survey = { title, description, meta, ...contents };         //B
  survey.id = surveyId;
  if (!survey.counter) survey.counter = 0;
  if (!survey.questions) survey.questions = [];
  if (!survey.selectedIndex) survey.selectedIndex = 0;
  if (survey.questions.length === 0) {
    const [counter, question] = getQuestion(survey.counter);
    survey.counter = counter;
    survey.questions.push(question);
  }
  const newProps = { ...props, surveyId, survey };

  async function updateSurvey(survey) {
    // Copy survey
    survey = JSON.parse(JSON.stringify(survey));

    // Filter empty choices of single choice or multiple choice
    survey.questions = survey.questions.map((question) => {
      const { type } = question;
      if (type == CardTypes.SINGLE_CHOICE || type == CardTypes.MULTIPLE_CHOICE) {
        question.choices = question.choices.filter(x => x);
      }
      return question;
    });

    // Reshape survey object
    const { title, description, meta, ...contents } = survey;     //B
    const body = { title, description, contents, view: "slide" }; //A

    // Send data to server
    return await API.putSurvey(surveyId, body);
  }

  return (
    <Component {...newProps} updateSurvey={updateSurvey} />
  );
};

export default withSurvey;