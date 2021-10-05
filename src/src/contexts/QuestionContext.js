import React, { createContext, useContext } from "react";

const QuestionContext = createContext();

export function QuestionProvider({
  children,
  state,
  surveyId,
  question,
  setQuestion,
  response,
  setResponse,
  tabIndex,
  isLast,
}) {
  return (
    <QuestionContext.Provider
      value={{ state, question, surveyId, response, setQuestion, setResponse, tabIndex, isLast }}>
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestion must be used within a QuestionProvider");
  }
  return context;
}
