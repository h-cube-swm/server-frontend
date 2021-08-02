/* React elements*/
import React, { useState } from "react";
import { Link } from "react-router-dom";

/* Components */
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import Sidebar from "../Sidebar/Sidebar";
import Prologue from "../Prologue/Prologue";
import Positioner from "../../../Positioner/Positioner";
import { QuestionAddButton } from "./QuestionAddButton/QuestionAddButton";

/* HOC, Context, Hooks */
import withSurvey from "../../../../hocs/withSurvey";
import useScrollPaging from "../../../../hooks/useScrollPaging";
import useDragPaging from "../../../../hooks/useDragPaging";

/* Others */
import orderedMap from "../../../../utils/orderedMap";
import { CardStates, CardStyle } from "../constants";
import "./Edit.scss";
import getQuestion from "../getQuestion";
import setNestedState from "../../../../utils/setNestedState";
import Hider from "../../../Hider/Hider";
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import QuestionCommon from "../QuestionCommon/QuestionCommon";
import Error from "../../../Error/Error";

const Edit = ({ surveyId, survey, setSurvey, putSurvey }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const setQuesionType = setNestedState(setSurvey, [
    "questions",
    selectedIndex,
    "type",
  ]);

  const getInsertQuestion = (index) => () => {
    setSurvey((survey) => {
      const [counter, question] = getQuestion(survey.counter);
      const questions = [...survey.questions];
      questions.splice(index, 0, question);
      return { ...survey, counter, questions };
    });
    setSelectedIndex(index);
  };

  const getRemoveQuestion = (index) => () => {
    if (survey.questions.length <= 1) return;
    setSurvey((survey) => {
      const questions = [...survey.questions];
      questions.splice(index, 1);
      return { ...survey, questions };
    });
    if (index === survey.questions.length - 1) {
      setSelectedIndex(index - 1);
    }
  };

  const [onWheel, isMoving] = useScrollPaging((delta) => {
    setSelectedIndex((index) => {
      let newIndex = index + delta;
      if (newIndex < 0) return index;
      if (newIndex >= survey.questions.length) return index;
      return newIndex;
    });
  });

  const [onGrab, backgroundCallbacks, item, isDragging] = useDragPaging(
    (delta) => {
      // Calculate new index
      let newIndex = selectedIndex + delta;

      // Check range
      if (newIndex < 0) return;
      if (newIndex >= survey.questions.length) return;
      if (newIndex === selectedIndex) return;

      // Swap two question
      const questions = [...survey.questions];
      const tmp = questions[selectedIndex];
      questions[selectedIndex] = questions[newIndex];
      questions[newIndex] = tmp;

      // Update index and question
      setSelectedIndex(newIndex);
      setSurvey({ ...survey, questions });
    }
  );

  if (!survey) return <Error type="loading"></Error>;

  const selectedSurveyType = survey.questions[selectedIndex].type;
  const showAddButton = !isDragging && !isMoving;
  const { questions } = survey;

  return (
    <div className="edit" {...backgroundCallbacks}>
      <div className="positioning-box">
        <div className="controller-box">
          <Controller type={selectedSurveyType} setType={setQuesionType} />
          <Link
            onClick={putSurvey}
            className="link-btn"
            to={"/forms/survey/end/" + surveyId}>
            완료
          </Link>
          <button onClick={putSurvey}>저장</button>
        </div>
        <div className="sidebar-box">
          <Sidebar
            questions={questions}
            currentIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>
      </div>
      <Prologue survey={survey} setSurvey={setSurvey} />

      {/* Ghost that appears when card moves */}
      <div ref={item}>
        <QuestionProvider
          state={CardStates.GHOST}
          question={questions[selectedIndex]}>
          <Card slowAppear={false}>
            <QuestionCommon />
          </Card>
        </QuestionProvider>
      </div>

      <div className="question-box" onWheel={onWheel}>
        {orderedMap(questions, (question, index) => {
          const isSelected = index === selectedIndex;
          const y = (index - selectedIndex) * CardStyle.FRAME_HEIHGT;
          const slowAppear = questions.length > 1;
          const setQuestion = setNestedState(setSurvey, ["questions", index]);
          const onDelete = questions.length > 1 && getRemoveQuestion(index);

          let state = null;
          if (isSelected) {
            state = CardStates.EDITTING;
          } else {
            state = CardStates.PREVIEW;
          }

          return (
            <Positioner key={question.id} y={y}>
              <Hider hide={isDragging && isSelected} animation={false}>
                <QuestionProvider
                  state={state}
                  question={question}
                  setQuestion={setQuestion}>
                  <Card
                    onDelete={onDelete}
                    onGrab={onGrab}
                    slowAppear={slowAppear}>
                    <QuestionCommon />
                  </Card>
                </QuestionProvider>
              </Hider>
            </Positioner>
          );
        })}

        <QuestionAddButton
          onClick={getInsertQuestion(selectedIndex)}
          y={-CardStyle.FRAME_HEIHGT / 2}
          show={showAddButton}
        />

        <QuestionAddButton
          onClick={getInsertQuestion(selectedIndex + 1)}
          y={+CardStyle.FRAME_HEIHGT / 2}
          show={showAddButton}
        />
      </div>
    </div>
  );
};

export default withSurvey(Edit);
