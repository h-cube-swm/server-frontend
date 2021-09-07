import React, { useEffect } from "react";
import { useQuestion } from "../../../../../contexts/QuestionContext";
import { CardStates } from "../../../../../constants";

import "./Empty.scss";
import setNestedState from "../../../../../utils/setNestedState";

export default function Empty() {
  const { state, setQuestion, isLast } = useQuestion();
  const isEditting = state === CardStates.EDITTING;
  if (isEditting) {
    useEffect(() => {
      const setIsRequired = setNestedState(setQuestion, ["isRequired"]);
      setIsRequired(false);
    }, []);

    if (isLast) return <div className="empty">설문 종료 후 보여질 문구를 작성해주세요.</div>;

    return <div className="empty">이 질문은 제목만 노출되는 빈 질문입니다.</div>;
  }
  return <div />;
}
