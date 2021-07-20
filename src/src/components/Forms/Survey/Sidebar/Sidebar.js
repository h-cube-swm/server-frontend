import React from "react";
import "./Sidebar.scss";
import selectedDot from "../../../../assets/icons/selected-dot.svg";
import unselectedDot from "../../../../assets/icons/unselected-dot.svg";

/**
 * Let
 *    default margin = dm
 *    additional margin = am
 *    total length   = L
 *
 * Then L = dm * (n-1) + am * 2
 * Suppose that am = dm * r.
 * Then L = dm * (n-1) + dm * r * 2
 *        = dm * (n-1+r*2)
 *
 * Therefore dm = L / (n-1+r*2)
 */

const SIDEBAR_HEIGHT = 200;
const ADDITIONAL_MARGIN_RATE = 1;

export default function Sidebar({ questionsNumber, currentIndex, onSelect }) {
  // Calculate default margin(dm) and additional marign(am)
  const dm =
    SIDEBAR_HEIGHT / (questionsNumber - 1 + ADDITIONAL_MARGIN_RATE * 2);
  const am = dm * ADDITIONAL_MARGIN_RATE;

  let dots = [];
  let y = 0;

  for (let i = 0; i < questionsNumber; i++) {
    const selected = i === currentIndex;
    let mt = dm;
    let mb = dm;

    // Calculate upper margin and lower margin
    if (i === 0) {
      mt = 0;
      if (selected) {
        mb += am * 2;
      }
    } else if (i === questionsNumber - 1) {
      mb = 0;
      if (selected) {
        mt += am * 2;
      }
    } else {
      if (selected) {
        mb += am;
        mt += am;
      }
    }

    // Add upper margin
    y += mt;

    // Place component
    dots.push(
      <button
        className="dot"
        onClick={() => {
          onSelect(i);
        }}
        key={i}
        style={{
          transform: `translate(-50%,-50%) translateY( ${y}px)`,
        }}>
        <img src={selected ? selectedDot : unselectedDot} alt="dot" />
      </button>
    );

    // Add lower margin
    y += mb;
  }

  return (
    <div className="sidebar" style={{ height: y }}>
      {dots}
      <div className="bar"></div>
    </div>
  );
}
