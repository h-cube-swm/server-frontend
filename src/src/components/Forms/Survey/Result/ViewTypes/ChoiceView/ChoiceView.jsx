import React from "react";
import { Pie } from "react-chartjs-2";
import Card from "../../../Card/Card";
import "./ChoiceView.scss";

export default function ChoiceView({ answers }) {
  let answerObj = {};
  let labels = [];
  let data = [];

  answers.forEach((answer) => {
    const keys = Object.keys(answer);
    keys.forEach((key) => {
      if (answerObj[key]) {
        answerObj[key] += 1;
      } else {
        answerObj[key] = 1;
      }
    });
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
    <div className="choice-view">
      <div className="chart">
        <Pie
          data={state}
          options={{
            title: {
              display: true,
              text: "Average",
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
