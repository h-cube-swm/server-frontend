import React, { createContext, useContext, useRef } from "react";

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
  const scrollRef = useRef(null);
  function scrollToBottom() {
    if (scrollRef.current)
      scrollRef.current.scrollTo({
        top: 999999999,
        behavior: "smooth",
      });
  }

  return (
    <QuestionContext.Provider
      value={{
        state,
        question,
        surveyId,
        response,
        setQuestion,
        setResponse,
        tabIndex,
        isLast,
        scrollRef,
        scrollToBottom,
      }}>
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
