import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { putApi } from "../../../../utils/parser";

import "./Ending.scss";

const Ending = ({ match }) => {
  const [title, setTitle] = useState("Loading...");
  const [description, setDescription] = useState("Loading...");
  const [surveyLink, setSurveyLink] = useState("Loading...");
  const [resultLink, setResultLink] = useState("Loading...");
  const survey_id = match.params.link;

  useEffect(async () => {
    try {
      const json = await putApi(`/surveys/${survey_id}/end`);
      const obj = JSON.parse(JSON.stringify(json));
      setTitle(obj.result.title);
      setDescription(obj.result.description);
      setSurveyLink(obj.result.survey_link);
      setResultLink(obj.result.result_link);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="ending-page">
      <h1 className="celebrate-sentence">
        축하합니다. 설문을 완성했습니다.
        <br />
        이제 배포만 남았습니다.
      </h1>
      <div className="survey-sum">
        <h1>{title}</h1>
        <h2>{description}</h2>
        <ul>
          <li>
            <h3>배포링크</h3>
            <p>{"https://the-form.io/forms/survey/response/" + surveyLink}</p>
          </li>
          <li>
            <h3>결과링크</h3>
            <p>{"https://the-form.io/forms/survey/result/" + resultLink}</p>
          </li>
        </ul>
      </div>
      <Link className="link-btn-lg" to="/">
        홈으로
      </Link>
    </div>
  );
};

export default Ending;
