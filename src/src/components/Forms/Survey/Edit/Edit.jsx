/* React elements*/
import React, { useCallback, useMemo, useState } from "react";

/* Components */
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import Sidebar from "../Sidebar/Sidebar";
import Prologue from "../Prologue/Prologue";
import Positioner from "../../../Positioner/Positioner";
import { QuestionAddButton } from "./QuestionAddButton/QuestionAddButton";
import Hider from "../../../Hider/Hider";
import QuestionCommon from "../QuestionCommon/QuestionCommon";
import Ending from "../EditEnding/EditEnding";

/* HOC, Context, Hooks */
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import withSurvey from "../../../../hocs/withSurvey";
import getQuestion from "../getQuestion";
import useScrollPaging from "../../../../hooks/useScrollPaging";
import useDragPaging from "../../../../hooks/useDragPaging";
import useThrottle from "../../../../hooks/useThrottle";

/* Others */
import orderedMap from "../../../../utils/orderedMap";
import { CardStates, CardStyle } from "../constants";
import "./Edit.scss";
import setNestedState from "../../../../utils/setNestedState";
import { Redirect } from "react-router-dom";

const Edit = ({ survey: init, updateSurvey }) => {
  const [survey, setSurvey] = useState(init);
  const [isEnded, setIsEnded] = useState(false);
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

  const [onWheel] = useScrollPaging((delta) => {
    const index = survey.selectedIndex;
    const length = survey.questions.length;

    let newIndex = index + delta;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= length) newIndex = length - 1;
    if (newIndex === index) return;
    setSelectedIndex(newIndex);
  });

  const putSurvey = () => updateSurvey(survey);

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

  if (survey.meta.status === "published")
    return <Redirect to="/error/published" />;
  if (isEnded) return <Ending surveyId={survey.id} />;

  const { selectedIndex } = survey;
  const setQuesionType = setNestedState(setSurvey, [
    "questions",
    selectedIndex,
    "type",
  ]);

  const selectedSurveyType = survey.questions[selectedIndex].type;
  const { questions } = survey;

  return (
    <div className="edit" {...backgroundCallbacks}>
      <Prologue
        survey={survey}
        setSurvey={setSurvey}
        putSurvey={putSurvey}
        setIsEnded={setIsEnded}
      />
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
                  setQuestion={isSelected && setQuestion}>
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
