import React, { useState } from "react";

export default function Controller({ setElement }) {
  const onClick = (e) => {
    setElement(e.target.innerText);
  };

  return (
    <div>
      <div className="element-box">
        <button onClick={onClick}>단일선택</button>
        <button onClick={onClick}>다중선택</button>
        <button onClick={onClick}>선호도</button>
        <button onClick={onClick}>단답형</button>
        <button onClick={onClick}>장문형</button>
      </div>
    </div>
  );
}
