import { createContext, useContext, useRef } from "react";

const QuestionContext = createContext();

export function QuestionProvider({ children, state, question, setQuestion, response, setResponse }) {
  const callbackRef = useRef({});
  const callbacks = callbackRef.current;

  if (callbacks.question !== question || callbacks.question === undefined) {
    callbacks.question = question;
    callbacks['setQuestion'] = setQuestion;
  }

  if (callbacks.response !== response || callbacks.response === undefined) {
    callbacks.response = response;
    callbacks['setResponse'] = setResponse;
  }

  return <QuestionContext.Provider value={{ state, question, response, ...callbacks }} >
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