import React from "react";
import DataGrid from "react-data-grid";

export default function Tables({ questions, answers }) {
  const columns = [{ key: "timestamp", name: "응답 시각" }];
  questions.forEach((question) => {
    columns.push({ key: question.id, name: question.title });
  });

  const rows = answers.map(({ answer, submit_time: timestamp }) => {
    let row = { ...answer };
    row.timestamp = timestamp;
    Object.keys(row).forEach((key) => (row[key] = JSON.stringify(row[key])));
    return row;
  });

  return <DataGrid columns={columns} rows={rows} />;
}
