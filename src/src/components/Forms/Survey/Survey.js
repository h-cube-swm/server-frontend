/* React elements */
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { getApi } from "../../../utils/parser";

const Survey = () => {
  const [data, setData] = useState("");

  useEffect(async () => {
    try {
      const response = await getApi("/link/");
      setData("/forms/survey/edit/" + response.link);
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Survey Page</h1>
      {data && <Redirect to={data} />}
    </div>
  );
};

export default Survey;
