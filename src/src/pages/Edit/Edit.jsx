// React elements
import React, { useEffect, useState } from "react";
import { Link, Redirect, useLocation, useHistory } from "react-router-dom";

// Hocs
import withSurveyForEdit from "hocs/withSurveyForEdit";

// Hooks
import useOnly from "hooks/useOnly";
import { useDebounce } from "hooks/useThrottle";
import useDragPaging from "hooks/useDragPaging";
import useScrollPaging from "hooks/useScrollPaging";

// Utils
import apis from "utils/apis";
import orderedMap from "utils/orderedMap";
import getQuestion from "utils/getQuestion";
import setNestedState from "utils/setNestedState";

// Contexts
import { useModal } from "contexts/ModalContext";
import { useMessage } from "contexts/MessageContext";
import { useGlobalState } from "contexts/GlobalContext";
import { QuestionProvider } from "contexts/QuestionContext";

// Components
import Title from "components/Title/Title";
import Hider from "components/Hider/Hider";
import Positioner from "components/Positioner/Positioner";
import QuestionCommon from "components/QuestionCommon/QuestionCommon";

// Pages
import { Response } from "pages/Response/Response";

// Constants
import { CardStates, CardStyle, CardTypes, DOMAIN } from "constants.js";

// Sub-components
import Card from "./Card/Card";
import Sidebar from "./Sidebar/Sidebar";
import Prologue from "./Prologue/Prologue";
import Branching from "./Branching/Branching";
import Controller from "./Controller/Controller";
import QuestionAddButton from "./QuestionAddButton/QuestionAddButton";

// Style
import "./Edit.scss";

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
  const [isFolded, setIsFolded] = useState(true);

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
  const history = useHistory();

  const getInsertQuestion = (index) => () => {
    setSurvey((survey) => {
      const question = getQuestion();
      const questions = [...survey.questions];
      questions.splice(index, 0, question);
      return { ...survey, questions };
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

      // Copy question with new id
      const { id } = getQuestion();
      const newQuestion = { ...questions[index], id };
      questions.splice(index + 1, 0, newQuestion);

      // Update selectedIndex
      const selectedIndex = index + 1;
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

  useDebounce(putSurvey, [survey]);

  if (survey.status !== "editing" || isEnded)
    return <Redirect to={`/forms/survey/details/${survey.id}`} />;

  const { selectedIndex } = survey;
  const setQuesionType = setNestedState(setSurvey, ["questions", selectedIndex, "type"]);

  const selectedSurveyType = survey.questions[selectedIndex].type;
  const { questions } = survey;

  function detectQuestion() {
    let index = -1;
    let message = [];

    for (let i = 0; i < questions.length && index < 0; i++) {
      if (
        questions[i].type === CardTypes.SINGLE_CHOICE ||
        questions[i].type === CardTypes.MULTIPLE_CHOICE
      ) {
        if (questions[i].choices.length === 0) {
          message = ["???????????? ?????? ????????? ???????????? ????????????.", "warning"];
          index = i;
        }
        for (let j = 0; j < questions[i].choices.length; j++) {
          if (questions[i].choices[j].length === 0) {
            message = ["???????????? ?????? ????????? ??? ???????????? ????????????.", "warning"];
            index = i;
          }
        }
      }
      if (!questions[i].title) {
        message = ["???????????? ?????? ????????? ????????? ??????????????????.", "warning"];
        index = i;
      }
      if (i === questions.length - 1 && !questions[i].title) {
        message = ["???????????? ????????? ?????? ???????????? ??????????????????.", "warning"];
        index = i;
      }
    }

    if (index >= 0) {
      publish(...message);
      setSelectedIndex(index);
      history.push("#edit");
      return false;
    }

    return true;
  }

  const onSubmit = async () => {
    try {
      await putSurvey();
      await apis.endSurvey(survey.id);
      setIsEnded(true);
    } catch {
      // ToDo : Error handling
    }
  };

  const onClick = () => {
    if (survey.title.length === 0) {
      publish("???????????? ?????? ????????? ???????????? ?????? ????????? ????????? ??? ????????????.", "warning");
      setIsFolded(false);
      return;
    }

    if (!detectQuestion()) return;

    if (!token) {
      load({
        children: (
          <>
            <h2 style={{ fontWeight: "700", marginBottom: "1rem" }}>???? ????????? ?????????????????? ????</h2>
            <p style={{ fontWeight: "500", marginBottom: "1rem" }}>
              ??????! ???????????? ?????? ?????????, ????????? ?????????????????? ????
            </p>
            <p style={{ fontWeight: "500" }}>
              1????????? ??????????????? ??? ??? ?????? ????????? ?????????????????? ????
            </p>
          </>
        ),
        href,
        onSubmit,
      });
    } else if (token && survey.draw.isEnabled) {
      load({
        children: (
          <>
            <br />
            <h2 style={{ fontWeight: "700", marginBottom: "1rem" }}>???? ????????? ?????????????????? ????</h2>
            <p
              style={{
                display: "block",
                backgroundColor: "#f6c344",
                borderRadius: "15px",
                padding: "1.5rem",
              }}>
              ?????? <b style={{ fontWeight: "bold" }}>????????? ?????? ??????</b>??? ???????????? ??????????????????
              <br />
              <br />
              <b style={{ color: "#2b44ff", fontWeight: "bold" }}>?????????, ???????????? ???</b> ????????????
              ????????? ??? ?????? ????????? ????????????!
            </p>
            <p style={{ fontWeight: "500", marginBottom: "1rem" }}>
              <br />
              ????????? ????????? ?????? ?????? ????????? &quot;????????????&quot; ????????? ?????? ?????????????????? ????
              <br />
              <Link to={"#" + MODE_BRANCHING} style={{ color: "#2b44ff", fontWeight: "bold" }}>
                [????????????]
              </Link>
              ??????
              <Link to={"#" + MODE_PREVIEW} style={{ color: "#2b44ff", fontWeight: "bold" }}>
                [????????????]
              </Link>
              ??? ??? ?????????????????? ????
            </p>
          </>
        ),
        onSubmit,
      });
    } else {
      load({
        children: (
          <>
            <br />
            <h2 style={{ fontWeight: "700", marginBottom: "1rem" }}>???? ????????? ?????????????????? ????</h2>
            <p style={{ fontWeight: "500", marginBottom: "1rem" }}>
              ???????????? ?????????
              <Link to={"#" + MODE_BRANCHING} style={{ color: "#2b44ff", fontWeight: "bold" }}>
                [????????????]
              </Link>
              ??????
              <Link to={"#" + MODE_PREVIEW} style={{ color: "#2b44ff", fontWeight: "bold" }}>
                [????????????]
              </Link>
              ??? ???????????????????
              <br />
              <br />
              ?????? ??????????????? ????????? &quot;????????????&quot; ????????? ?????? ??? ?????????????????? ???? <br />
              <br />
              ?????? ????????? ?????? ??????????????? ????????? &quot;??????&quot; ????????? ??????????????? ????
            </p>
          </>
        ),
        onSubmit,
      });
    }
  };

  return (
    <div className="edit" {...backgroundCallbacks}>
      <Title>{`${survey.title ? survey.title : ""} : ?????????`}</Title>
      <Prologue
        survey={survey}
        setSurvey={setSurvey}
        isFolded={isFolded}
        setIsFolded={setIsFolded}
        setIsEnded={setIsEnded}>
        {isSaving ? (
          <>
            <p className="save-indicator">?????????...</p>
            <button className="btn rg submit-btn saving">??????</button>
          </>
        ) : (
          <>
            <p className="save-indicator">?????????</p>
            <button onClick={onClick} className="btn rg submit-btn">
              ??????
            </button>
          </>
        )}
      </Prologue>

      <div className="section">
        <Link className={"part " + (isBranching && "selected")} to={"#" + MODE_BRANCHING}>
          ????????????
        </Link>
        <div className="divider" />
        <Link className={"part " + (isEdit && "selected")} to={"#" + MODE_EDIT}>
          ????????????
        </Link>
        <div className="divider" />
        <Link className={"part " + (isPreview && "selected")} to={"#" + MODE_PREVIEW}>
          ????????????
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
            const state = isSelected ? CardStates.EDITING : CardStates.PREVIEW;
            const onDelete = questions.length > 1 && isSelected && getRemoveQuestion(index);
            const onDuplicate = isSelected && getCopyQuestion(index);
            const setQuestion = setNestedState(setSurvey, ["questions", index]);

            return (
              <Positioner key={question.id} y={y} zIndex={3}>
                <Hider hide={isHide} animation={false} appearDelay={400}>
                  <QuestionProvider
                    state={state}
                    surveyId={survey.id}
                    question={question}
                    setQuestion={isSelected && setQuestion}
                    isLast={index === questions.length - 1}
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

        <QuestionAddButton onClick={getInsertQuestion(selectedIndex)} top />

        <QuestionAddButton
          onClick={getInsertQuestion(selectedIndex + 1)}
          isLast={selectedIndex === questions.length - 1}
        />
        <Hider hide={selectedIndex === questions.length - 1}>
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

// ToDo : Swagger??? ??? ??? ??????!
export default withSurveyForEdit(Edit);
