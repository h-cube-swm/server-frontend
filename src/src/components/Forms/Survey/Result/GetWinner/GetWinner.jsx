import React, { useState } from "react";

export default function GetWinner({ changeOpen, answers }) {
  const SELECT_DICT = {};
  const [isRandom, setIsRandom] = useState(false);
  const [isOrder, setIsOrder] = useState(false);

  const changeRandom = () => {
    setIsRandom(!isRandom);
  };
  const changeOrder = () => {
    setIsOrder(!isOrder);
  };
  return (
    <div className="get-winner">
      <button onClick={changeOpen}>뒤로가기</button>
      <button onClick={changeRandom}>랜덤 추첨</button>
      <button onClick={changeOrder}>시간순 추첨</button>
      <input type="text" />
      <div>{isRandom && <h3>랜덤 추출</h3>}</div>
    </div>
  );
}
