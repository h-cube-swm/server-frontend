import React from "react";
import "./Sidebar.scss";
import selectedDot from "assets/icons/selected-dot.svg";
import orderedMap from "utils/orderedMap";
import Positioner from "components/Positioner/Positioner";

const DIST_LARGE = 72;
const DIST_NARROW = 48;

export default function Sidebar({ questions, currentIndex, onSelect }) {
  let start = 0;
  let end = 0;

  let y = 0;
  const dots = orderedMap(questions, (question, i) => {
    const delta = i - currentIndex;
    const selected = delta === 0;

    if (delta < 0) {
      y = (delta + 1) * DIST_NARROW - DIST_LARGE;
    } else if (delta > 0) {
      y = (delta - 1) * DIST_NARROW + DIST_LARGE;
    } else {
      y = 0;
    }

    if (start > y) start = y;
    if (end < y) end = y;

    // Place component
    return (
      <Positioner y={y} key={question.id}>
        <button
          onClick={() => {
            onSelect(i);
          }}
          className={"dot " + (selected ? "selected" : "unselected")}>
          <img src={selectedDot} alt="dot" />
          <div className="title">{question.title}</div>
        </button>
      </Positioner>
    );
  });

  const barLength = end - start;

  return (
    <div className="sidebar">
      {dots}
      <Positioner y={start + barLength / 2} zIndex={-1}>
        <div className="bar" style={{ height: barLength }}></div>
      </Positioner>
    </div>
  );
}
