import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import { API } from "../utils/apis";

const withSurvey = Component => props => {

  const surveyId = props.match.params.link;

  const [result, err] = API.useSurvey(surveyId);
  if (err) return <Redirect to="/error/unexpected"></Redirect>;
  if (!result) return <Loading></Loading>;

  const { title, description, contents } = result;          //A
  const survey = { title, description, ...contents };       //B
  const newProps = { ...props, surveyId, survey };

  async function updateSurvey(survey) {
    const { title, description, ...contents } = survey;           //B
    const body = { title, description, contents, view: "slide" }; //A
    const [result, error] = await API.putSurvey(surveyId, body);
  }

  return (
    <Component {...newProps} updateSurvey={updateSurvey} />
  );
};

export default withSurvey;