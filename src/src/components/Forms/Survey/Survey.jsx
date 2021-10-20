/* React elements */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import API from "../../../utils/apis";
import L from "../../../utils/logger";
import Loading from "../../Loading/Loading";

const Survey = () => {
  const [state, setState] = useState([null, null, -1]);
  const [response, err, status] = state;

  useEffect(() => {
    (async () => {
      const result = await API.postSurvey();
      L.l(`Create:${result}`);
      setState(result);
    })();
  }, []);

  if (err && status === 400) return <Redirect to="/error/published" />;
  if (err) return <Redirect to="/error/unexpected/cannot-get-link"></Redirect>;
  if (!response) return <Loading />;
  if (!response.result.id) return <Redirect to="/error/unexpected/wrong-link"></Redirect>;
  const url = `/forms/survey/edit/${response.result.id}`;
  return <Redirect to={url} />;
};

export default Survey;
