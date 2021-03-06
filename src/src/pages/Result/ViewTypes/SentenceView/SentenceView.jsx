import React from "react";
import "./SentenceView.scss";

export default function SentenceView({ question, answers }) {
  const contents = answers.filter((x) => x).map((answer, i) => <p key={i}>{answer + ""}</p>);
  return (
    <div className="sentence-view">
      <h1>{question.title}</h1>
      <div className="contents">{contents}</div>
    </div>
  );
}
