import React, { useState, useEffect } from "react";
import "./Prologue.scss";

export default function Prologue() {
  const [isFolding, setIsFolding] = useState(false);

  return (
    <div
      className="prologue-box"
      onClick={() => {
        setIsFolding(false);
      }}
    >
      {!isFolding && (
        <form>
          <input
            name="title"
            type="text"
            placeholder="설문 제목을 입력해주세요"
          />
          <br />
          <input
            name="description"
            type="text"
            placeholder="설문 설명을 입력해주세요"
          />
        </form>
      )}
    </div>
  );
}
