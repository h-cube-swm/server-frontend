import React, { useState } from 'react';
import './Table.scss';

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
    if (nextIndex == index) {
      setCriterion([nextIndex, -order]);
    } else {
      setCriterion([nextIndex, ASC]);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column, i) => <th key={i} onClick={getSetCriterion(i)}>{column}</th>)}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}
      </tbody>
    </table>
  );
}
