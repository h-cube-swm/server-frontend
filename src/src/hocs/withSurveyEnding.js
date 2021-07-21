import React, { useEffect, useState } from 'react';
import { putApi } from "../utils/parser";

const withSurveyEnding = Component => props => {

  const [title, setTitle] = useState("Loading...");
  const [description, setDescription] = useState("Loading...");
  const [surveyLink, setSurveyLink] = useState("Loading...");
  const [resultLink, setResultLink] = useState("Loading...");
  const survey_id = props.match.params.link;

  useEffect(() => {
    const getEndData = async () => {
      try {
        const json = await putApi(`/surveys/${survey_id}/end`);
        const { result } = JSON.parse(JSON.stringify(json));
        setTitle(result.title);
        setDescription(result.description);
        setSurveyLink(result.survey_link);
        setResultLink(result.result_link);
      } catch (e) {
        console.log(e);
      }
    };
    getEndData();
  }, [survey_id]);

  const newProps = { ...props, title, description, surveyLink, resultLink };

  return <Component {...newProps} />;
};

export default withSurveyEnding;