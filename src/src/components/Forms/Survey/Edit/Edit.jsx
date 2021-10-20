/* React elements */
import React, { useEffect, useState } from "react";

/* Components */
import { Link, Redirect, useLocation } from "react-router-dom";
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
import { CardStates, CardStyle, DOMAIN } from "../../../../constants";
import "./Edit.scss";
import setNestedState from "../../../../utils/setNestedState";
import getQuestion from "../getQuestion";
import { useMessage } from "../../../../contexts/MessageContext";
import { useGlobalState } from "../../../../contexts/GlobalContext";
import Branching from "../Branching/Branching";
import { useModal } from "../../../../contexts/ModalContext";

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

  const { load } = useModal();
  const { publish } = useMessage();
  const current = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${current}`;
  const { token } = useGlobalState();

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

  const getCopyQuestion = (index) => () => {
    setSurvey((_survey) => {
      // ToDo : Use efficient deepcopy library instead of tricky copy
      const survey = JSON.parse(JSON.stringify(_survey));
      const questions = [...survey.questions];
      let { selectedIndex } = survey;
      const id = ++survey.counter + "";
      const newQuestion = { ...questions[selectedIndex], id };
      questions.splice(index + 1, 0, newQuestion);
      selectedIndex = index + 1;
      return { ...survey, selectedIndex, questions };
    });
  };

  const events = useScrollPaging((delta) => {
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
    try {
      await putSurvey();
      setIsEnded(true);
    } catch {
      /* */
    }
  };

  const onClick = () => {
    if (survey.title.length === 0) {
      publish("주의❗️ 설문 제목을 입력해야 설문 제작을 완료할 수 있습니다.", "warning");
      return;
    }

    if (!detectQuestion()) {
      return;
    }

    if (!token) {
      load(
        <>
          <h2 style={{ fontWeight: "700", marginTop: "2rem", marginBottom: "2rem" }}>
            🎉 설문을 완성했습니다 🎉
          </h2>
          <p style={{ fontWeight: "500", marginBottom: "1rem" }}>
            잠깐! 로그인을 하지 않으면, 수정이 불가능합니다 🔨
          </p>
          <p style={{ fontWeight: "500" }}>1초만에 로그인하고 더 폼 나게 설문을 만들어보세요 👏</p>
        </>,
        href,
        onSubmit,
      );
    } else {
      load(
        <>
          <br />
          <h2 style={{ fontWeight: "700", marginTop: "2rem", marginBottom: "2rem" }}>
            🎉 설문을 완성했습니다 🎉
          </h2>
          <p style={{ fontWeight: "500", marginBottom: "1rem" }}>
            잠깐!{" "}
            <Link to={"#" + MODE_PREVIEW} style={{ color: "#2b44ff", fontWeight: "bold" }}>
              [미리보기]
            </Link>{" "}
            또는 설문의{" "}
            <Link to={"#" + MODE_BRANCHING} style={{ color: "#2b44ff", fontWeight: "bold" }}>
              [흐름설정]
            </Link>
            을 확인하셨나요?
            <br />
            <br />
            혹시 놓치셨다면 아래의 &quot;돌아가기&quot; 버튼을 눌러 더 다듬어주시고 🤔 <br />
            <br />
            설문 제작을 모두 마치셨다면 아래의 &quot;완료&quot; 버튼을 눌러주세요 👏
          </p>
        </>,
        null,
        onSubmit,
      );
    }
  };

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
            <button onClick={onClick} className="btn rg submit-btn">
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
        {...events}>
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
            surveyId={survey.id}
            question={questions[selectedIndex]}
            tabIndex="-1"
            themeColor={survey.themeColor}>
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
            const onDuplicate = isSelected && getCopyQuestion(index);
            const setQuestion = setNestedState(setSurvey, ["questions", index]);

            return (
              <Positioner key={question.id} y={y}>
                <Hider hide={isHide} animation={false} appearDelay={400}>
                  <QuestionProvider
                    state={state}
                    surveyId={survey.id}
                    question={question}
                    setQuestion={isSelected && setQuestion}
                    isLast={question.id === "1"}
                    themeColor={survey.themeColor}>
                    <Card onGrab={onGrab} slowAppear={slowAppear}>
                      <QuestionCommon handleOnDelete={onDelete} handleOnDuplicate={onDuplicate} />
                    </Card>
                  </QuestionProvider>
                </Hider>
              </Positioner>
            );
          })}
        </div>

        <div className="fade-out top" />
        <div className="fade-out bottom" />

        <QuestionAddButton onClick={getInsertQuestion(selectedIndex)} y={"-30vh"} />

        <QuestionAddButton
          onClick={getInsertQuestion(selectedIndex + 1)}
          y={"30vh"}
          isLast={questions[selectedIndex].id === "1"}
        />
        <Hider hide={questions[selectedIndex].id === "1"}>
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
