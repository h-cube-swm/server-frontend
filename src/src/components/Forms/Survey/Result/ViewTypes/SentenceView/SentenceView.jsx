import React from "react";
import "./SentenceView.scss";

export default function SentenceView({ answers }) {
  let contents = answers.map((answer) => <p>{answer}</p>);
  return <div className="sentence-view">{contents}</div>;
}
