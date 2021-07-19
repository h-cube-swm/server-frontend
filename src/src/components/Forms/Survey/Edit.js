/* React elements*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../../../utils/parser";
import { CardTypes, CardStates } from "./constants";
import Card from "./Card/Card";
import './Edit.scss';

/* Components */
import Controller from "./Controller/Controller";

const Edit = ({ match }) => {
  const [survey, setSurvey] = useState({ questions: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const surveyId = match.params.link;

  useEffect(async () => {
    const { result: survey } = await getApi(`/surveys/${surveyId}`);
    if (!survey.counter) survey.counter = 0;
    if (!survey.questions) survey.questions = [];
    if (survey.questions.length == 0) survey.questions.push({
      id: survey.counter++,
      type: CardTypes.SINGLE_CHOICE
    });
    setSurvey(survey);
  }, []);

  const setSelectedSurveyType = (type) => {
    setSurvey(survey => {
      const questions = [...survey.questions];
      questions[selectedIndex].type = type;
      return {
        questions,
        ...survey
      };
    });
  };

  const selectedSurveyType = survey.questions[selectedIndex]?.type;
  const sortedQuestions = [...survey?.questions].sort((a, b) => a.id - b.id);
  const idList = survey.questions.map(({ id }) => id);

  return (
    <div className="edit">
      <div style={{ opacity: survey ? 0 : 1 }}>Loading</div>
      <h1>Edit Page</h1>
      <Controller element={selectedSurveyType} setElement={setSelectedSurveyType} />
      <div className="question-container">
        {sortedQuestions.map((question => {
          const index = idList.indexOf(question.id);
          return (
            <Card
              question={question}
              index={index}
              selectedIndex={selectedIndex}
              mode={CardStates.BLURREED}
            >
            </Card>
          );
        }))}
      </div>
      <Link to={"/forms/survey/end/" + match.params.link}>완료</Link>
    </div>
  );
};

export default Edit;
