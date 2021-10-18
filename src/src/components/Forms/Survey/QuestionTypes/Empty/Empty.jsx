import { useEffect } from "react";
import { useQuestion } from "../../../../../contexts/QuestionContext";
import { CardStates } from "../../../../../constants";

import "./Empty.scss";
import setNestedState from "../../../../../utils/setNestedState";

export default function Empty() {
  const { state, setQuestion } = useQuestion();
  const isEditting = state === CardStates.EDITTING;
  useEffect(() => {
    if (!isEditting) return;
    const setIsRequired = setNestedState(setQuestion, ["isRequired"]);
    setIsRequired(false);
  }, []);
  return null;
}
