import React, { useEffect, useState } from "react";
import { useMessage } from "../../contexts/MessageContext";
import useOnly from "../../hooks/useOnly";
import useTimeout from "../../hooks/useTimeout";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./Loading.scss";

const SPINNER_NUM = 3;

export default function Loading() {
  const isTimeout = useTimeout(500);
  const isError = useTimeout(5000);
  const [spinner, setSpinner] = useState(1);
  const { publish } = useMessage();

  // useEffect for spinner
  useEffect(() => {
    const handle = setInterval(() => {
      if (spinner < SPINNER_NUM) setSpinner(spinner + 1);
      else setSpinner(0);
    }, 500);
    return () => clearInterval(handle);
  });

  // useEffect for error message
  useOnly(
    () => isError && publish("이 화면이 계속 되면 우측 하단 채널톡을 통해 문의해주세요.", "error"),
    [isError],
  );

  const text = new Array(SPINNER_NUM)
    .fill(null)
    .map((_, i) => (i < spinner ? <div className="dot" /> : <div className="dot hide" />));

  return (
    <>
      <FloatingLogo />
      {isTimeout && (
        <div className="loading">
          <h1>로딩 중입니다.</h1>
          <div className="spinner">{text}</div>
        </div>
      )}
    </>
  );
}
