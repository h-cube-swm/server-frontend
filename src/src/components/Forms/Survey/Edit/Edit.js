/* React elements*/
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* Test */
import { getApi } from "../../../../utils/parser";
import { CardTypes, CardStates } from "../constants";
import './Edit.scss';

/* Components */
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import useScrollPaging from "../../../../hooks/useScrollPaging";

const Edit = ({ match }) => {

  const [survey, setSurvey] = useState({ questions: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [onWheel, isMoving] = useScrollPaging((delta) => {
    setSelectedIndex(index => {
      let newIndex = index + delta;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= questions.length) newIndex = questions.length - 1;
      return newIndex;
    });
  });

  const surveyId = match.params.link;
  const windowHeight = window.innerHeight;
  const { questions } = survey;
  const questionNumber = questions.length;

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

  console.log(survey);

  /**
   * Insert new survey at given index.
   * @param {Integer} index 
   */
  const addQuestion = (index) => {
    setSurvey(survey => {
      const counter = survey.counter + 1;
      const newQuestion = {
        id: counter,
        type: CardTypes.SINGLE_CHOICE,
      };
      const questions = [...survey.questions];
      questions.splice(index, 0, newQuestion);
      return { ...survey, counter, questions };
    });
    setSelectedIndex(index);
  };


  const selectedSurveyType = survey.questions[selectedIndex]?.type;
  const sortedQuestions = [...survey?.questions].sort((a, b) => a.id - b.id);
  const idList = survey.questions.map(({ id }) => id);

  return (
    <div className="edit">
      <div style={{ opacity: survey ? 0 : 1 }}>Loading</div>
      <h1>Edit Page</h1>
      <Controller element={selectedSurveyType} setElement={setSelectedSurveyType} />
      <div className="question-container" onWheel={onWheel}>
        {sortedQuestions.map((question => {
          const index = idList.indexOf(question.id);
          return (
            <Card
              key={question.id}
              question={question}
              index={index}
              selectedIndex={selectedIndex}
              state={CardStates.EDITTING}
            >
            </Card>
          );
        }))}
        <div className="question-add-box" style={{ transform: `translate(-50%, ${-240 - 32}px)` }}>
          <button onClick={() => addQuestion(selectedIndex)}>
            설문 추가
          </button>
        </div>
        <div className="question-add-box" style={{ transform: `translate(-50%, ${+240 + 32}px)` }}>
          <button onClick={() => addQuestion(selectedIndex + 1)}>
            설문 추가
          </button>
        </div>
      </div>
      <Link to={"/forms/survey/end/" + match.params.link}>완료</Link>
    </div >
  );
};

export default Edit;
