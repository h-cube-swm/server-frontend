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
  }
  return <div />;
}
