import React, { useEffect } from "react";
import Chaos from "../Chaos/Chaos";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./Loading.scss";

export default function Loading() {
  return (
    <div className="loading">
      <FloatingLogo />
      <h1>로딩 중입니다.</h1>
      <Chaos />
    </div>
  );
}
