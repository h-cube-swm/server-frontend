/* React elements*/
import React, { useMemo, useState } from "react";

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
import Loading from "../../../Loading/Loading";
import useThrottle from "../../../../hooks/useThrottle";

const Edit = ({ surveyId, survey: init, updateSurvey }) => {
  const initSurvey = useMemo(() => {
    if (!init.counter) init.counter = 0;
    if (!init.questions) init.questions = [];
    if (!init.selectedIndex) init.selectedIndex = 0;
    if (!init.id) init.id = surveyId;
    if (init.questions.length === 0) {
      const [counter, question] = getQuestion(init.counter);
      init.counter = counter;
      init.questions.push(question);
    }
    return init;
  }, [init]);

  const [survey, setSurvey] = useState(initSurvey);

  const setSelectedIndex = setNestedState(setSurvey, ["selectedIndex"]);

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
      let selectedIndex = survey.selectedIndex;
      questions.splice(index, 1);
      if (index === survey.questions.length - 1) {
        selectedIndex = index - 1;
      }
      return { ...survey, selectedIndex, questions };
    });
  };

  const [onWheel, isMoving] = useScrollPaging((delta) => {
    setSelectedIndex((index) => {
      let newIndex = index + delta;
      if (newIndex < 0) return index;
      if (newIndex >= survey.questions.length) return index;
      return newIndex;
    });
  });

  const putSurvey = async () => {
    updateSurvey(survey);
  };

  const [onGrab, backgroundCallbacks, item, isDragging] = useDragPaging(
    (delta) => {
      // Calculate new index
      const { selectedIndex } = survey;
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

      setSurvey({ ...survey, selectedIndex: newIndex, questions });
    }
  );

  const onEvent = useThrottle(putSurvey);
  onEvent();

  if (!survey) return <Loading></Loading>;

  const { selectedIndex } = survey;
  const setQuesionType = setNestedState(setSurvey, [
    "questions",
    selectedIndex,
    "type",
  ]);

  const selectedSurveyType = survey.questions[selectedIndex].type;
  const showAddButton = !isDragging && !isMoving;
  const { questions } = survey;

  return (
    <div className="edit" {...backgroundCallbacks}>
      <Prologue survey={survey} setSurvey={setSurvey} putSurvey={putSurvey} />
      <div className="positioning-box">
        <div className="sidebar-box">
          <Sidebar
            questions={questions}
            currentIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>
      </div>

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
          const y = (index - selectedIndex) * CardStyle.FRAME_HEIGHT;
          const slowAppear = questions.length > 1;
          const isHide = isDragging && isSelected;
          const state = isSelected ? CardStates.EDITTING : CardStates.PREVIEW;
          const onDelete =
            questions.length > 1 && isSelected && getRemoveQuestion(index);
          const setQuestion = setNestedState(setSurvey, ["questions", index]);

          return (
            <Positioner key={question.id} y={y}>
              <Hider hide={isHide} animation={false} appearDelay={400}>
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
      </div>

      <div className="fade-out top" />
      <div className="fade-out bottom" />

      <QuestionAddButton
        onClick={getInsertQuestion(selectedIndex)}
        y={-CardStyle.FRAME_HEIGHT / 2}
      />

      <QuestionAddButton
        onClick={getInsertQuestion(selectedIndex + 1)}
        y={+CardStyle.FRAME_HEIGHT / 2}
      />

      <Controller type={selectedSurveyType} setType={setQuesionType} />
    </div>
  );
};

export default withSurvey(Edit);
