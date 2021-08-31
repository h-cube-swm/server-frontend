import React, { useRef, useState } from "react";
import { CardTypes } from "../../../../constants";
import setNestedState from "../../../../utils/setNestedState";
import "./Branching.scss";

const TOP = 200;
const LEFT = 120;
const RIGHT = 120;
const QUESTION_DIST = 300; // Horizontal distance between each cards including its width
const CARD_W = 240; // Width of cards
const CARD_H = 150; // Height of cards
const CHOICE_DIST = 80; // Vertical distance between choices includig its height
const CHOICE_H = 16 * 3;

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
  return [getCardPosition(i)[0], TOP + CARD_H + CHOICE_DIST * (j + 0.5) + CHOICE_H / 2];
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

function Card({ index: questionIndex, question, onGrab }) {
  const [x, y] = getCardPosition(questionIndex);
  const choices = question.choices || [];
  return (
    <>
      <div className="branch-card" style={{ left: x, top: y, width: CARD_W, height: CARD_H }}>
        {question.title}
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

  // Derived states
  const { questions } = survey;
  const { branching } = survey;
  const setBranching = setNestedState(setSurvey, ["branching"]);

  function indexToId(index) {
    if (!questions[index]) return -1;
    return questions[index].id;
  }

  function idToIndex(id) {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].id + "" === id + "") return i;
    }
    return -1;
  }

  function handleGrab(i, j) {
    setSelectedHandle([i, j]);
  }

  function handleMove(e) {
    if (!frameRef.current) return;
    if (!selectedHandle) return;
    e.preventDefault();

    const [questionId, choiceIndex] = selectedHandle;

    // Get current handle position
    const [sx, sy] = getHandlePosition(idToIndex(questionId), choiceIndex);
    const rect = frameRef.current.getBoundingClientRect();

    // Calculate relative mouse position
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    // Get nearest distance
    const [destIndex, distSquare] = getNearestAnchor(questions.length, mx, my);
    const newDestId = indexToId(destIndex);

    // If the mouse is close enough to the anchor,
    // move the endpoint to the anchor position.
    if (distSquare < 15 * 15) {
      [mx, my] = getAnchorPosition(destIndex);
      // Update destination
      if (curDestId !== newDestId) setDestBody(newDestId);
    } else if (curDestId > 0 && curDestId !== -1) setDestBody(-1);

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

  function handleRelease() {
    if (curDestId >= 0) {
      const [questionId, choiceIndex] = selectedHandle;
      setBranching({
        ...branching,
        [hashChoice(questionId, choiceIndex)]: curDestId,
      });
    }
    setSelectedHandle(null);
    setDestBody(-1);
  }

  return (
    <div className="branching">
      <div
        className="frame"
        ref={frameRef}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onMouseMove={handleMove}
        style={{ width: getCardPosition(questions.length - 1)[0] + CARD_W + RIGHT }}>
        {questions.map((question, index) => {
          return <Card key={index} index={index} question={question} onGrab={handleGrab} />;
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
              // Skip non-choice question
              if (question.type !== CardTypes.SINGLE_CHOICE) return null;
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
                  strokeWidth="4"
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
          </svg>
        </div>
        <p className="comment">아무것도 연결하지 않으면 바로 다음 질문으로 넘어갑니다.</p>
      </div>
    </div>
  );
}
