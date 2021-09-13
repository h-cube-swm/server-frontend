/* React elements */
import React, { useEffect, useState } from "react";

/* Components */
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Card from "../Card/Card";
import Controller from "../Controller/Controller";
import Sidebar from "../Sidebar/Sidebar";
import Prologue from "../Prologue/Prologue";
import Positioner from "../../../Positioner/Positioner";
import QuestionAddButton from "./QuestionAddButton/QuestionAddButton";
import Hider from "../../../Hider/Hider";
import QuestionCommon from "../QuestionCommon/QuestionCommon";
import Title from "../../../Title/Title";
import { Response } from "../Response/Response";

/* HOC, Context, Hooks */
import { QuestionProvider } from "../../../../contexts/QuestionContext";
import withSurvey from "../../../../hocs/withSurvey";
import useScrollPaging from "../../../../hooks/useScrollPaging";
import useDragPaging from "../../../../hooks/useDragPaging";
import useThrottle from "../../../../hooks/useThrottle";
import useOnly from "../../../../hooks/useOnly";

/* Others */
import orderedMap from "../../../../utils/orderedMap";
import { CardStates, CardStyle } from "../../../../constants";
import "./Edit.scss";
import setNestedState from "../../../../utils/setNestedState";
import getQuestion from "../getQuestion";
import { useMessage } from "../../../../contexts/MessageContext";
import Branching from "../Branching/Branching";

const MODE_EDIT = "edit";
const MODE_PREVIEW = "preview";
const MODE_BRANCHING = "branching";

function Preview({ survey }) {
  const [responses, setResponses] = useState(null);

  function resetResponse() {
    setResponses((responses) => ({ ...responses, history: [] }));
  }

  useOnly(resetResponse, [survey]);

  if (!responses) return null;

  return (
    <Response
      survey={survey}
      responses={responses}
      setResponses={setResponses}
      onSubmit={resetResponse}
      tabIndex="-1"
      isPreview={true}
    />
  );
}

function Edit({ survey: init, updateSurvey, location }) {
  const [survey, setSurvey] = useState(init);
  const [isEnded, setIsEnded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setIsSaving(true), [survey]);

  const viewMode = location.hash.replace("#", "");
  const isPreview = viewMode === MODE_PREVIEW;
  const isBranching = viewMode === MODE_BRANCHING;
  const isEdit = viewMode !== MODE_PREVIEW && viewMode !== MODE_BRANCHING;

  const { publish } = useMessage();

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
      let { selectedIndex } = survey;
      questions.splice(index, 1);
      if (index === survey.questions.length - 1) {
        selectedIndex = index - 1;
      }
      return { ...survey, selectedIndex, questions };
    });
  };

  const [onWheel] = useScrollPaging((delta) => {
    const index = survey.selectedIndex;
    const { length } = survey.questions;

    let newIndex = index + delta;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= length) newIndex = length - 1;
    if (newIndex === index) return;
    setSelectedIndex(newIndex);
  });

  const putSurvey = async () => {
    await updateSurvey(survey);
    setIsSaving(false);
  };

  const [onGrab, backgroundCallbacks, item, isDragging] = useDragPaging((delta) => {
    // Calculate new index
    const { selectedIndex } = survey;
    const newIndex = selectedIndex + delta;

    // Check range
    if (newIndex < 0) return;
    if (newIndex >= survey.questions.length - 1) return;
    if (newIndex === selectedIndex) return;

    // Swap two question
    const questions = [...survey.questions];
    const tmp = questions[selectedIndex];
    questions[selectedIndex] = questions[newIndex];
    questions[newIndex] = tmp;

    setSurvey({ ...survey, selectedIndex: newIndex, questions });
  });

  const onEvent = useThrottle(putSurvey);
  onEvent();

  if (survey.status === "published" || isEnded)
    return <Redirect to={`/forms/survey/end/${survey.id}`} />;

  const { selectedIndex } = survey;
  const setQuesionType = setNestedState(setSurvey, ["questions", selectedIndex, "type"]);

  const selectedSurveyType = survey.questions[selectedIndex].type;
  const { questions } = survey;

  function detectQuestion() {
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].title) {
        publish("주의❗️ 제목이 비어있는 질문이 있습니다.", "warning");
        return false;
      }
      if (questions[i].type === "single-choice" || questions[i].type === "multiple-choice") {
        if (questions[i].choices.length === 0) {
          publish("주의❗️ 선택지가 없는 질문이 있습니다.", "warning");
          return false;
        }
        for (let j = 0; j < questions[i].choices.length; j++) {
          if (questions[i].choices[j].length === 0) {
            publish("주의❗️ 선택지가 입력되지 않은 질문이 있습니다.", "warning");
            return false;
          }
        }
      }
    }
    return true;
  }

  const onSubmit = async () => {
    if (survey.title.length === 0) {
      publish("주의❗️ 설문 제목을 입력해야 설문 제작을 완료할 수 있습니다.", "warning");
      return;
    }

    if (!detectQuestion()) {
      return;
    }

    try {
      await putSurvey();
      setIsEnded(true);
    } catch {
      /* */
    }
  };

  const isLast = selectedIndex === questions.length - 1;

  return (
    <div className="edit" {...backgroundCallbacks}>
      <Title>{`${survey.title ? survey.title : ""} : 편집중`}</Title>
      <Prologue survey={survey} setSurvey={setSurvey} setIsEnded={setIsEnded}>
        {isSaving ? (
          <>
            <p className="save-indicator">저장중...</p>
            <button className="btn rg submit-btn saving">완료</button>
          </>
        ) : (
          <>
            <p className="save-indicator">저장됨</p>
            <button onClick={onSubmit} className="btn rg submit-btn">
              완료
            </button>
          </>
        )}
      </Prologue>

      <div className="section">
        <Link className={"part " + (isBranching && "selected")} to={"#" + MODE_BRANCHING}>
          흐름설정
        </Link>
        <div className="divider" />
        <Link className={"part " + (isEdit && "selected")} to={"#" + MODE_EDIT}>
          설문편집
        </Link>
        <div className="divider" />
        <Link className={"part " + (isPreview && "selected")} to={"#" + MODE_PREVIEW}>
          미리보기
        </Link>
      </div>

      <div
        className={"view view-edit " + ((isPreview && "left") || (isBranching && "right"))}
        onWheel={onWheel}>
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
            question={questions[selectedIndex]}
            tabIndex="-1">
            <Card slowAppear={false}>
              <QuestionCommon />
            </Card>
          </QuestionProvider>
        </div>

        <div className="question-box">
          {orderedMap(questions, (question, index) => {
            const isSelected = index === selectedIndex;
            const y = (index - selectedIndex) * CardStyle.FRAME_HEIGHT;
            const slowAppear = questions.length > 1;
            const isHide = isDragging && isSelected;
            const state = isSelected ? CardStates.EDITTING : CardStates.PREVIEW;
            const onDelete = questions.length > 1 && isSelected && getRemoveQuestion(index);
            const setQuestion = setNestedState(setSurvey, ["questions", index]);

            return (
              <Positioner key={question.id} y={y}>
                <Hider hide={isHide} animation={false} appearDelay={400}>
                  <QuestionProvider
                    state={state}
                    question={question}
                    setQuestion={isSelected && setQuestion}
                    isLast={isLast}>
                    <Card onDelete={onDelete} onGrab={onGrab} slowAppear={slowAppear}>
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
          isLast={isLast}
        />
        <Hider hide={isLast}>
          <Controller type={selectedSurveyType} setType={setQuesionType} />
        </Hider>
      </div>
      <div className={"view " + (isPreview || "right")}>
        <Preview survey={survey}></Preview>
      </div>
      <div className={"view " + (isBranching || "left")}>
        <Branching survey={survey} setSurvey={setSurvey}></Branching>
      </div>
    </div>
  );
}

// ToDo : Swagger를 써 볼 수도!
export default withSurvey(Edit);
