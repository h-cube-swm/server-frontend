/* React elements */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import API from "../../../utils/apis";
import L from "../../../utils/logger";
import Error from "../../Error/Error";
import Loading from "../../Loading/Loading";

const Survey = () => {
  const [state, setState] = useState([null, null, -1]);
  const [response, err, status] = state;

  useEffect(() => {
    (async () => {
      const result = await API.postSurvey();
      L.l(`Create:${JSON.stringify(result)}`);
      setState(result);
    })();
  }, []);

  if (err && status === 400) return <Error type="not-published" />;
  if (err) return <Error type="cannot-get-link" />;
  if (!response) return <Loading />;
  if (!response.result.id) return <Error type="wrong-link" />;
  const url = `/forms/survey/edit/${response.result.id}`;
  return <Redirect to={url} />;
};

export default Survey;
