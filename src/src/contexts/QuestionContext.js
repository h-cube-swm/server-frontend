import { createContext, useContext, useRef } from "react";

const QuestionContext = createContext();

export function QuestionProvider({ children, state, question, setQuestion, response, setResponse }) {
  return <QuestionContext.Provider value={{ state, question, response, setQuestion, setResponse }} >
    {children}
  </QuestionContext.Provider >;
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  const { state, question, setQuestion, response, setResponse } = context;
  return { state, question, setQuestion, response, setResponse };
}