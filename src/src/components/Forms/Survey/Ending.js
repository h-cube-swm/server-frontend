import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { putApi } from "../../../utils/parser";

const Ending = ({ match }) => {
  const [title, setTitle] = useState("제목을 입력해주세요.");
  const [description, setDescription] = useState("제목을 입력해주세요.");
  const [surveyLink, setSurveyLink] = useState("test");
  const [resultLink, setResultLink] = useState("test");
  const survey_id = match.params.link;

  useEffect(async () => {
    try {
      const json = await putApi(`/surveys/${survey_id}/end`);
      const obj = JSON.parse(JSON.stringify(json));
      setTitle(obj.result[0].fields.title);
      setDescription(obj.result[0].fields.description);
      setSurveyLink(obj.result[0].fields.survey_link);
      setResultLink(obj.result[0].fields.result_link);
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <>
      <h1>Ending</h1>
      <h2>제목: {title}</h2>
      <p>설명: {description}</p>
      <p>배포링크: {surveyLink}</p>
      <p>결과링크: {resultLink}</p>
      <Link to="/">배포하기</Link>
    </>
  );
};

export default Ending;
