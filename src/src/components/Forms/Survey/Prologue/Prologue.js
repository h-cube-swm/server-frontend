import React, { useState, useEffect } from "react";
export default function Prologue() {
  return (
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
  );
}
