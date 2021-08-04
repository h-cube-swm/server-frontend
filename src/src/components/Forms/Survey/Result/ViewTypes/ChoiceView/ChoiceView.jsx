import React from "react";
import { Pie } from "react-chartjs-2";
import "./ChoiceView.scss";

export default function ChoiceView({ question, answers }) {
  let answerObj = {};
  let labels = [];
  let values = [];

  answers.forEach((answer) => {
    const keys = Object.keys(answer);
    keys.forEach((key) => {
      if (answer[key]) {
        if (answerObj[key]) {
          answerObj[key] += 1;
        } else {
          answerObj[key] = 1;
        }
      }
    });
  });

  console.log(answerObj);

  Object.entries(answerObj).forEach(([key, value]) => {
    labels.push(question.choices[key]);
    values.push(value);
  });

  const data = {
    labels: labels,
    datasets: [
      {
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
        borderWidth: 3,
      },
    ],
  };

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

  return (
    <div className="choice-view">
      <h1>{question.title}</h1>
      <div className="chart">
        <Pie data={data} width={640} height={250} options={option} />
      </div>
    </div>
  );
}
