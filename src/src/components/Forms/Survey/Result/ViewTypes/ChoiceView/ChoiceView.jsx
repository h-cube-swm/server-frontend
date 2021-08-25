import React from "react";
import { Pie } from "test-react-chartjs-2";
import "./ChoiceView.scss";

const option = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "left",
      labels: {
        font: {
          size: 14,
          family: "'Roboto', 'Noto Sans KR', sans-serif",
          weight: 700,
        },
      },
    },
  },
};

export default function ChoiceView({ question, answers }) {
  const labels = question.choices;
  const values = new Array(labels.length).fill(0);

  answers.forEach((answer) => {
    Object.entries(answer).forEach(([key, value]) => {
      values[key] += value;
    });
  });

  const colors = [];
  for (let i = labels.length; i > 0; i--) {
    colors.push(`rgba(43,68,255,${i / labels.length})`);
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "rgba(255,255,255,1)",
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="choice-view">
      <h1>{question.title}&nbsp;</h1>
      <div className="chart">
        <Pie data={data} width={640} height={250} options={option} />
      </div>
    </div>
  );
}
