import React from "react";
import { Bar } from "react-chartjs-2";
import "./PreferenceView.scss";

export default function PreferenceView({ question, answers }) {
  let answerObj = {};
  let labels = [];
  let values = [];

  answers.forEach((answer) => {
    if (answerObj[answer]) {
      answerObj[answer] += 1;
    } else {
      answerObj[answer] = 1;
    }
  });

  Object.entries(answerObj).forEach(([key, value]) => {
    labels.push(key);
    values.push(value);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "선호도",
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: "rgba(255,255,255,1)",
        borderRadius: 15,
        borderWidth: 0.1,
      },
    ],
  };
  const option = {
    legend: {
      display: true,
      position: "left",
    },
  };

  return (
    <div className="preference-view">
      <h1>{question.title}</h1>
      <div className="chart">
        <Bar data={data} width={640} height={280} options={option} />
      </div>
    </div>
  );
}
