/* React elements*/
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* Test */
import { getApi } from "../../../../utils/parser";
import { CardTypes, CardStates, CardStyle } from "../constants";
import "./Edit.scss";

/* Components */
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import useScrollPaging from "../../../../hooks/useScrollPaging";
import useDragPaging from "../../../../hooks/useDragPaging";

const Edit = ({ match }) => {
  const [survey, setSurvey] = useState({ questions: [{ 'type': 0 }] });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [onWheel, isMoving] = useScrollPaging((delta) => {
    setSelectedIndex((index) => {
      let newIndex = index + delta;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= questions.length) newIndex = questions.length - 1;
      return newIndex;
    });
  });

  const [onGrab, backgroundCallbacks, item, isDragging] = useDragPaging((delta) => {
    console.log('DELTA:', delta);
    let newIndex = selectedIndex + delta;
    if (newIndex < 0) return;
    if (newIndex >= survey.questions.length) return;
    if (newIndex === selectedIndex) return;

    const questions = [...survey.questions];
    const tmp = questions[selectedIndex];
    questions[selectedIndex] = questions[newIndex];
    questions[newIndex] = tmp;

    setSelectedIndex(newIndex);
    setSurvey({
      ...survey, questions
    });
  });

  const surveyId = match.params.link;

  const { questions } = survey;

  useEffect(() => {
    const init = async () => {
      const { result: survey } = await getApi(`/surveys/${surveyId}`);
      if (!survey.counter) survey.counter = 0;
      if (!survey.questions) survey.questions = [];
      if (survey.questions.length == 0)
        survey.questions.push({
          id: survey.counter++,
          type: CardTypes.SINGLE_CHOICE,
        });
      setSurvey(survey);
    };
    init();
  }, []);

  const setSelectedSurveyType = (type) => {
    setSurvey((survey) => {
      const questions = [...survey.questions];
      questions[selectedIndex].type = type;
      return {
        questions,
        ...survey,
      };
    });
  };

  /**
   * Insert new survey at given index.
   * @param {Integer} index
   */
  const addQuestion = (index) => {
    setSurvey((survey) => {
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
    <div className="edit" {...backgroundCallbacks}>
      <div style={{ opacity: survey ? 0 : 1 }}>Loading</div>
      <div className="controller-positioning-box">
        <div className="controller-box">
          <Controller
            element={selectedSurveyType}
            setElement={setSelectedSurveyType}
          />
          <Link to={"/forms/survey/end/" + match.params.link}>완료</Link>
        </div>
      </div>
      <div className="question-container" onWheel={onWheel}>
        {sortedQuestions.map((question) => {
          const index = idList.indexOf(question.id);
          const isSelected = index === selectedIndex;

          let state = CardStates.RESPONSE;
          if (isSelected) {
            if (isDragging) {
              state = CardStates.ORDERING;
            } else {
              state = CardStates.EDITTING;
            }
          }

          return (
            <Card
              key={question.id}
              question={question}
              index={index}
              selectedIndex={selectedIndex}
              state={state}
              onGrab={onGrab}
            ></Card>
          );
        })}
        <Card
          key={'GHOST'}
          question={questions[selectedIndex]}
          state={CardStates.GHOST}
          index={isDragging ? 1 : 0}
          dom={item}
        ></Card>
        <div
          className="question-add-box"
          style={{
            transform: `translate(-50%,-50%) translateY(${
              -(CardStyle.HEIGHT + CardStyle.DISTANCE) / 2
            }px)`,
          }}
        >
          <button onClick={() => addQuestion(selectedIndex)}>설문 추가</button>
        </div>
        <div
          className="question-add-box"
          style={{
            transform: `translate(-50%,-50%) translateY(${
              +(CardStyle.HEIGHT + CardStyle.DISTANCE) / 2
            }px)`,
          }}
        >
          <button onClick={() => addQuestion(selectedIndex + 1)}>
            설문 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
