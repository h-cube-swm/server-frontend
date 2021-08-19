import React, { useState } from "react";
import "./Table.scss";

const ASC = 1;

export default function Table({ columns, rows }) {
  const [criterion, setCriterion] = useState([0, ASC]);

  const [index, order] = criterion;
  const sortedRows = [...rows];
  sortedRows.sort((a, b) => {
    if (a[index] < b[index]) {
      return -order;
    } else if (a[index] > b[index]) {
      return order;
    } else {
      return 0;
    }
  });

  const getSetCriterion = (nextIndex) => () => {
    if (nextIndex === index) {
      setCriterion([nextIndex, -order]);
    } else {
      setCriterion([nextIndex, ASC]);
    }
  };

  const weight = new Array(columns.length).fill(1);
  // Weight assign comes here, if Required.
  const weightSum = weight.reduce((pre, cur) => pre + cur, 0);
  const weightStyles = weight.map((x) => ({ flexGrow: 1 }));

  return (
    <div className="table">
      <div className="thead">
        <div className="tr">
          {columns.map((column, i) => (
            <div className="th" style={weightStyles[i]} key={i} onClick={getSetCriterion(i)}>
              {column}
            </div>
          ))}
        </div>
      </div>
      <div className="tbody">
        {sortedRows.map((row, i) => (
          <div className="tr" key={i}>
            {row.map((cell, j) => (
              <div className="td" style={weightStyles[j]} key={j}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
