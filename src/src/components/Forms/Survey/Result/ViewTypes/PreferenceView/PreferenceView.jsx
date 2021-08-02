import React from "react";
import { Bar } from "react-chartjs-2";
import "./PreferenceView.scss";

export default function PreferenceView({ answers }) {
  console.log(answers);
  let answerObj = {};
  let labels = [];
  let data = [];

  answers.forEach((answer) => {
    if (answerObj[answer]) {
      answerObj[answer] += 1;
    } else {
      answerObj[answer] = 1;
    }
  });

  console.log(answerObj);

  Object.entries(answerObj).forEach(([key, value]) => {
    labels.push(key);
    data.push(value);
  });

  const state = {
    labels: labels,
    datasets: [
      {
        label: "option",
        backgroundColor: "rgba(55,90,180,1)",
        borderColor: "rgba(255,255,255,1)",
        borderWidth: 3,
        data: data,
      },
    ],
  };

  return (
    <div className="preference-view">
      <div className="chart">
        <Bar
          data={state}
          options={{
            title: {
              display: true,
              text: "Average Rainfall per month",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    </div>
  );
}
