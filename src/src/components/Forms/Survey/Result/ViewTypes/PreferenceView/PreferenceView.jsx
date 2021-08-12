import React from "react";
import { Bar } from "test-react-chartjs-2";
import "./PreferenceView.scss";

export default function PreferenceView({ question, answers }) {
  let answerObj = {};
  let labels = [question.minDes];
  let values = [];

  answers.forEach((answer) => {
    if (answerObj[answer]) {
      answerObj[answer] += 1;
    } else {
      answerObj[answer] = 1;
    }
  });

  Object.entries(answerObj).forEach(([key, value]) => {
    if (key === "1" || key === `${answers.length}`) {
      values.push(value);
      return;
    }
    labels.push("");
    values.push(value);
  });

  labels.push(question.maxDes);

  const data = {
    labels: labels,
    datasets: [
      {
        label: question.title,
        data: values,
        backgroundColor: [
          "rgba(240, 192, 71, 1)",
          "rgba(235, 82, 64, 1)",
          "rgba(87, 182, 75, 1)",
          "rgba(48, 67, 246, 1)",
          "rgba(177, 177, 177, 1)",
          "rgba(133, 112, 215, 1)",
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
      base: 1,
    },
    scales: {
      yAxes: {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="preference-view">
      <h1>{question.title}</h1>
      <div className="chart">
        <Bar data={data} width={560} height={360} options={option} />
      </div>
    </div>
  );
}
