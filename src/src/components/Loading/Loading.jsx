import React, { useEffect, useState } from "react";
import { useMessage } from "../../contexts/MessageContext";
import useOnly from "../../hooks/useOnly";
import useTimeout from "../../hooks/useTimeout";
import "./Loading.scss";

const SPINNER_NUM = 10;

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
    () =>
      isError &&
      publish(
        "로딩이 계속 끝나지 않는다면 우측 하단 채널톡을 통해 문의해주세요.",
        "error"
      ),
    [isError]
  );

  const text = new Array(SPINNER_NUM)
    .fill(null)
    .map((_, i) => (i < spinner ? "■" : "□"))
    .join(" ");

  return (
    isTimeout && (
      <div className="loading">
        <h1>로딩 중입니다.</h1>
        <div className="spinner">{text}</div>
      </div>
    )
  );
}
