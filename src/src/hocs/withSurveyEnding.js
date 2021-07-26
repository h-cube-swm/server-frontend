import React, { useEffect, useState } from 'react';
import { putApi } from "../utils/parser";

const withSurveyEnding = Component => props => {

  const [ending, setEnding] = useState(null);

  const survey_id = props.match.params.link;

  useEffect(() => {
    const getEndData = async () => {
      try {
        const json = await putApi(`/surveys/${survey_id}/end`);
        const { result } = JSON.parse(JSON.stringify(json));
        const ending = {
          description: result['description'],
          resultLink: result['result_link'],
          status: result['status'],
          surveyLink: result['survey_link'],
          title: result['title'],
        };
        setEnding(ending);
      } catch (e) {
        console.log(e);
      }
    };
    getEndData();
  }, [survey_id]);

  return <Component {...props} ending={ending} />;
};

export default withSurveyEnding;