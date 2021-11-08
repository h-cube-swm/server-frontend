import { useEffect } from "react";
import { useQuestion } from "../../../../../contexts/QuestionContext";
import { CardStates } from "../../../../../constants";

import setNestedState from "../../../../../utils/setNestedState";

export default function Empty() {
  const { state, setQuestion } = useQuestion();
  const isEditting = state === CardStates.EDITING;
  useEffect(() => {
    if (!isEditting) return;
    const setIsRequired = setNestedState(setQuestion, ["isRequired"]);
    setIsRequired(false);
  }, []);
  return null;
}
