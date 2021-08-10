import { Redirect } from "react-router-dom";
import getQuestion from "../components/Forms/Survey/getQuestion";
import Loading from "../components/Loading/Loading";
import { API } from "../utils/apis";

const withSurvey = Component => props => {

  const surveyId = props.match.params.link;

  const [result, err] = API.useSurvey(surveyId);
  if (err) return <Redirect to="/error/unexpected/cannot-load-survey"></Redirect>;
  if (!result) return <Loading></Loading>;

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
    const { title, description, meta, ...contents } = survey;     //B
    const body = { title, description, contents, view: "slide" }; //A
    return await API.putSurvey(surveyId, body);
  }

  return (
    <Component {...newProps} updateSurvey={updateSurvey} />
  );
};

export default withSurvey;