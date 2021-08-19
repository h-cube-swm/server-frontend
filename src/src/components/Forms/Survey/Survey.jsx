/* React elements */
import React from "react";
import { Redirect } from "react-router-dom";
import API from "../../../utils/apis";
import Loading from "../../Loading/Loading";

const Survey = () => {
  const [link, err] = API.useLink();
  if (err && err.status === 400) return <Redirect to="/error/published" />;
  if (err) return <Redirect to="/error/unexpected/cannot-get-link"></Redirect>;
  if (!link) return <Loading />;
  const url = "/forms/survey/edit/" + link;
  return <Redirect to={url} />;
};

export default Survey;
