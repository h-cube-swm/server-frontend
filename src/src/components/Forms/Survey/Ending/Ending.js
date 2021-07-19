import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { putApi } from "../../../../utils/parser";

import "./Ending.scss";

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
  }, []);

  return (
    <div className="ending-page">
      <div className="survey-sum">
        <h1>제목: {title}</h1>
        <h2>설명: {description}</h2>
        <p>배포링크: {surveyLink}</p>
        <p>결과링크: {resultLink}</p>
      </div>
      <Link className="home-btn" to="/">
        홈으로
      </Link>
    </div>
  );
};

export default Ending;
