import React from "react";
import "./SentenceView.scss";

export default function SentenceView({ question, answers }) {
  let contents = answers.map((answer) => <p>{answer}</p>);
  return (
    <div className="sentence-view">
      <h1>{question.title}</h1>
      <div className="contents">{contents}</div>
    </div>
  );
}
