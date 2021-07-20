import React from "react";
import "./Sidebar.scss";
import selectedDot from "../../../../assets/icons/selected-dot.svg";
import unselectedDot from "../../../../assets/icons/unselected-dot.svg";

const DIST_LARGE = 72;
const DIST_NARROW = 48;

export default function Sidebar({ questions, currentIndex, onSelect }) {

  let y = 0;

  let start = 0;
  let end = 0;

  let dots = questions.map((question, i) => {
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
      <button
        className="dot"
        key={question.id}
        onClick={() => {
          onSelect(i);
        }}
        style={{
          transform: `translate(-50%,-50%) translateY(${y}px)`,
          zIndex: selected ? 10 : null
        }}>
        <img src={selected ? selectedDot : unselectedDot} alt="dot" />
      </button>
    );
  });

  /**
   * bar starat point = (0-c +1)*N-L
   * bar end point    = (n-1-c-1)*N+L
   * bar length = (n-1-c-c)*N-2*L
   */

  const barLength = end - start;

  return (
    <div className="sidebar" >
      {dots}
      <div className="bar" style={{ height: barLength, transform: `translateX(-50%) translateY(${start}px)` }}></div>
    </div>
  );
}
