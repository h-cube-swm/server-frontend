import React from "react";
import { Redirect } from "react-router-dom";

export default function StartTime({ match }) {
  return <Redirect to={`/forms/survey/response/${match.params.link}?_st=${Date.now()}`}></Redirect>;
}
