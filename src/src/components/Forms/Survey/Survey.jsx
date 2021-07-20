/* React elements */
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { getApi, putApi } from "../../../utils/parser";

const Survey = () => {
  const [redirect, setRedirect] = useState(null);

  useEffect(async () => {
    try {
      const response = await getApi("/link");
      const url = "/forms/survey/edit/" + response.link;
      setRedirect(<Redirect to={url} />);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Survey Page</h1>
      {redirect}
    </div>
  );
};

export default Survey;