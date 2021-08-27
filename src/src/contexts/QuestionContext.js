import React, { createContext, useContext } from "react";

const QuestionContext = createContext();

export function QuestionProvider({
  children,
  state,
  question,
  setQuestion,
  response,
  setResponse,
  tabIndex,
}) {
  return (
    <QuestionContext.Provider
      value={{ state, question, response, setQuestion, setResponse, tabIndex }}>
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
