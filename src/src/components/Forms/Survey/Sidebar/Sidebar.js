import React from "react";
import "./Sidebar.scss";
import selectedDot from "../../../../assets/icons/selected-dot.svg";
import unselectedDot from "../../../../assets/icons/unselected-dot.svg";

const DIST_LARGE = 64;
const DIST_NARROW = 48;

export default function Sidebar({ questionsNumber, currentIndex, onSelect }) {
  let dots = [];

  let y = 0;
  let start = 0;

  for (let i = 0; i < questionsNumber; i++) {
    const delta = i - currentIndex;
    const selected = delta === 0;

    if (delta < 0) {
      y = (delta + 1) * DIST_NARROW - DIST_LARGE;
    } else if (delta > 0) {
      y = (delta - 1) * DIST_NARROW + DIST_LARGE;
    } else {
      y = 0;
    }

    if (i === 0) start = y;

    // Place component
    dots.push(
      <button
        className="dot"
        onClick={() => {
          onSelect(i);
        }}
        key={i}
        style={{
          transform: `translate(-50%,-50%) translateY(${y}px)`,
        }}>
        <img src={selected ? selectedDot : unselectedDot} alt="dot" />
      </button>
    );
  }

  let end = y;

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
