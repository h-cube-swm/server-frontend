import React, { useEffect, useRef, useState } from "react";
import { CardTypes } from "../../../../constants";
import setNestedState from "../../../../utils/setNestedState";
import "./Branching.scss";

const TOP = 240; // Distance between frame top and card top
const LEFT = 120; // Distance between frame left and card left
const RIGHT = 120; // Distance between frame right and card right
const QUESTION_DIST = 300; // Horizontal distance between each cards including its width
const CARD_W = 240; // Width of cards
const CARD_H = 150; // Height of cards
const CHOICE_DIST = 75; // Vertical distance between choices includig its height
const CHOICE_H = 48; // Vertical size of choices
const SCROLL_DIST = 110; // Distance from frame edge that scrolling is enabled when connecting branch

/**
 *
 * @param {Number} i Index of question
 * @returns [x, y]
 */
function getCardPosition(i) {
  return [i * QUESTION_DIST + LEFT, TOP];
}

/**
 * @param {Number} i Index of question
 * @param {Number} j Index of choice
 * @returns {Array} [x, y]
 */
function getChoicePosition(i, j) {
  const [x, y] = getCardPosition(i);
  if (j === -1) {
    return [x, y + CARD_H - 4 * CHOICE_H];
  }
  return [x, TOP + CARD_H + CHOICE_DIST * (j + 0.5) + CHOICE_H / 2];
}

/** *
 * @param {Number} sx x of start position
 * @param {Number} sy y of start position
 * @param {Number} ex x of end position
 * @param {Number} ey y of end position
 * @returns {String} SVG path d string
 */
function getCurveString(sx, sy, ex, ey) {
  const C = (ex - sx) / 2;
  return `M${sx},${sy} C${sx + C},${sy} ${ex - C},${ey} ${ex},${ey}`;
}

/**
 * @param {Number} i Index of question
 * @param {Number} j Index of choice
 * @returns {Array} [x, y]
 */
function getHandlePosition(i, j) {
  const [x, y] = getChoicePosition(i, j);
  return [x + CARD_W, y];
}

/**
 * @param {Number} i Index of question
 * @returns {Array} [x, y]
 */
function getAnchorPosition(i) {
  const [x, y] = getCardPosition(i);
  return [x, y + CARD_H / 2];
}

/**
 * Calculate nearest body anchor from given position
 * and return [index of anchor, distance to that anchor]
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Array} [index, distance square]
 */
function getNearestAnchor(n, x, y) {
  let minDistSquare = 9999 * 9999;
  let minIndex = -1;

  for (let i = 0; i < n; i++) {
    const [x2, y2] = getAnchorPosition(i);
    const dist = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
    if (dist < minDistSquare) {
      minDistSquare = dist;
      minIndex = i;
    }
  }

  return [minIndex, minDistSquare];
}

/**
 * Convert integer tuple to string
 * @param {Number} i
 * @param {Number} j
 * @returns {String} hash
 */
function hashChoice(i, j) {
  return i + " " + j;
}

/**
 * Convert hashed string to integer tuple
 * @param {String} hashed
 * @returns {Array} [i, j]
 */
function unhashChoice(hashed) {
  const [i, j] = hashed.split(" ");
  return [+i, +j];
}

/**
 * Calculate how much scroll should be moved.
 * @param {*} pos x or y
 * @param {*} length width or height
 * @param {*} scrollDist Distance from frame edge that scrolling is enabled
 * @returns
 */
function getScrollDiff(pos, length, scrollDist) {
  let diff = 0;
  if (pos < scrollDist) diff = pos - scrollDist;
  else if (pos > length - scrollDist) diff = pos - (length - scrollDist);
  diff *= 0.25;
  return diff;
}

function Card({ index: questionIndex, question, onGrab, isLast }) {
  const [x, y] = getCardPosition(questionIndex);
  const choices = question.choices || [];
  const backgroundColor = !isLast ? "#fff" : "linear-gradient(to right, #009611, #57b64b)";
  const color = !isLast ? "#000" : "#fff";
  return (
    <>
      <div
        className={!isLast ? "choice default-branch" : "choice default-branch last"}
        style={{
          top: y + CARD_H - 4 * CHOICE_H,
          left: x,
          width: CARD_W,
        }}>
        <div className="text">이 질문의 다음 질문</div>
        <div className="handle">
          <div className="handle-dot" onMouseDown={() => onGrab(question.id, -1, true)} />
        </div>
      </div>
      <div
        className="branch-card"
        style={{
          left: x,
          top: y,
          width: CARD_W,
          height: CARD_H,
          background: backgroundColor,
          color,
        }}>
        <p className="title">{question.title}</p>
        {isLast ? <p className="end">종료</p> : <></>}
      </div>
      {question.type === CardTypes.SINGLE_CHOICE &&
        choices.map((text, choiceIndex) => {
          const [x, y] = getChoicePosition(questionIndex, choiceIndex);
          return (
            <div className="choice" key={choiceIndex} style={{ top: y, left: x, width: CARD_W }}>
              <div className="text">{text}</div>
              <div className="handle" onMouseDown={() => onGrab(question.id, choiceIndex)}>
                <div className="handle-dot" />
              </div>
              <p className="next-question">{}</p>
            </div>
          );
        })}
      <div className="anchor" style={{ left: x, top: y + CARD_H / 2 }}>
        <div className="anchor-dot" />
      </div>
    </>
  );
}

export default function Branching({ survey, setSurvey }) {
  // States
  const [selectedHandle, setSelectedHandle] = useState(null);
  const [curDestId, setDestBody] = useState(-1);

  // References
  const curve = useRef(null);
  const frameRef = useRef(null);
  const contentRef = useRef(null);
  const mouseRef = useRef([0, 0]);
  const scrollRef = useRef([0, 0]);

  // Derived states
  const { questions } = survey;
  const { branching } = survey;
  const setBranching = setNestedState(setSurvey, ["branching"]);

  // List of indexes of questions that does not have the 'Next question' settings,
  // So that branch to the next question should be shown.
  const defaultList = [];
  for (let i = 0; i < questions.length - 1; i++) {
    const { id } = questions[i];
    const defaultNextHash = hashChoice(id, -1);
    if (selectedHandle && selectedHandle[0] === id && selectedHandle[1] === -1) continue;
    if (defaultNextHash in branching && branching[defaultNextHash] >= 0) continue;
    defaultList.push(i);
  }

  // Maximum length of chocies
  const maxChoices = Math.max(...questions.map((x) => (x.choices ? x.choices.length : 0)));

  function indexToId(index) {
    if (!questions[index]) return -1;
    return questions[index].id;
  }

  function idToIndex(id) {
    if (id < 0) return -1;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].id + "" === id + "") return i;
    }
    return -1;
  }

  function handleGrab(i, j, isDefault) {
    if (isDefault) {
      setSelectedHandle([i, -1]);
    } else {
      setSelectedHandle([i, j]);
    }
  }

  function handleConnecting() {
    if (!curve.current) return;

    const [cx, cy] = mouseRef.current;

    const [questionId, choiceIndex] = selectedHandle;

    // Get current handle position
    const [sx, sy] = getHandlePosition(idToIndex(questionId), choiceIndex);
    const rect = contentRef.current.getBoundingClientRect();

    // Calculate relative mouse position
    let mx = cx - rect.left;
    let my = cy - rect.top;

    // Calculate scroll
    const scrollDiffX = getScrollDiff(cx, window.innerWidth, SCROLL_DIST);
    const scrollDiffY = getScrollDiff(cy, window.innerHeight, SCROLL_DIST);
    scrollRef.current = [scrollDiffX, scrollDiffY];

    // Get nearest distance
    const [destIndex, distSquare] = getNearestAnchor(questions.length, mx, my);
    const newDestId = indexToId(destIndex);

    // If the mouse is close enough to the anchor,
    // move the endpoint to the anchor position.
    if (distSquare < 15 * 15) {
      [mx, my] = getAnchorPosition(destIndex);
      // Update destination
      if (curDestId !== newDestId) setDestBody(newDestId);
    } else if (curDestId !== -1) setDestBody(-1);

    // Calculate curve string and apply
    const curveString = getCurveString(sx, sy, mx, my);
    curve.current.setAttributeNS(null, "d", curveString);

    // Set color of curve
    if (curDestId >= 0) {
      curve.current.setAttributeNS(null, "stroke", "#009611");
    } else {
      curve.current.setAttributeNS(null, "stroke", "#707070");
    }
  }

  function handleMove(e) {
    mouseRef.current = [e.clientX, e.clientY];
    if (!contentRef.current) return;
    if (!selectedHandle) return;
    e.preventDefault();
    handleConnecting();
  }

  function handleRelease() {
    if (!selectedHandle) return;
    const [questionId, choiceIndex] = selectedHandle;
    setBranching({
      ...branching,
      [hashChoice(questionId, choiceIndex)]: curDestId,
    });
    setSelectedHandle(null);
    setDestBody(-1);
  }

  useEffect(() => {
    if (!selectedHandle) return null;
    const id = setInterval(() => {
      const [diffX, diffY] = scrollRef.current;
      frameRef.current.scrollLeft += diffX;
      frameRef.current.scrollTop += diffY;
      handleConnecting();
    }, 25);
    return () => clearInterval(id);
  }, [selectedHandle]);

  return (
    <div className="branching" ref={frameRef}>
      <div
        className="frame"
        ref={contentRef}
        onMouseUp={handleRelease}
        onMouseMove={handleMove}
        style={{
          width: getCardPosition(questions.length - 1)[0] + CARD_W + RIGHT,
          minHeight: TOP + CARD_H + CHOICE_DIST * maxChoices,
        }}>
        {questions.map((question, index) => {
          return (
            <Card
              key={index}
              index={index}
              question={question}
              onGrab={handleGrab}
              isLast={index === questions.length - 1}
            />
          );
        })}
        <div className="curve">
          <svg>
            {Object.entries(branching).map(([choiceHash, destId]) => {
              const [questionId, choiceIndex] = unhashChoice(choiceHash);
              const questionIndex = idToIndex(questionId);
              const destIndex = idToIndex(destId);
              const question = questions[questionIndex];

              // Skip removed question
              if (questionIndex < 0) return null;
              // Skip choice of none-singe-choice-questions
              if (question.type !== CardTypes.SINGLE_CHOICE && choiceIndex >= 0) return null;
              // Skip unconnected linev
              if (destIndex < 0) return null;
              // Skip removed choice
              if (question.choices.length <= choiceIndex) return null;
              // Skip currently modifing branch
              if (selectedHandle && hashChoice(...selectedHandle) === choiceHash) return null;

              const [sx, sy] = getHandlePosition(questionIndex, choiceIndex);
              const [ex, ey] = getAnchorPosition(destIndex);
              const curveString = getCurveString(sx, sy, ex, ey);

              return (
                <path
                  d={curveString}
                  id="curveCurrent"
                  key={choiceHash + "/" + destId}
                  ref={curve}
                  fill="none"
                  stroke="#707070"
                  strokeWidth="3.5"
                />
              );
            })}
            {selectedHandle && (
              <path
                id="curveCurrent"
                ref={curve}
                fill="none"
                stroke="black"
                strokeWidth="4"
                fillOpacity="1"
              />
            )}
            {defaultList.map((questionIndex) => {
              const [sx, sy] = getHandlePosition(questionIndex, -1);
              const [ex, ey] = getAnchorPosition(questionIndex + 1);
              const curveString = getCurveString(sx, sy, ex, ey);
              return (
                <path
                  d={curveString}
                  id="curveCurrent"
                  key={`${questionIndex} -1 / ${questionIndex + 1}`}
                  ref={curve}
                  fill="none"
                  stroke="#707070"
                  strokeWidth="3.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <p className="comment">
        <strong>&#34;선택지가 가리키는 다음 질문&#34;</strong>이&nbsp;
        <strong>&#34;이 질문의 다음 질문&#34;</strong>에 우선합니다.
        <br />
        <br />
        아무것도 연결하지 않으면 바로 다음 질문으로 넘어갑니다.
      </p>
    </div>
  );
}
