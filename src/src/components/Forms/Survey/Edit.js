/* React elements*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../../../utils/parser";

/* Components */
import Controller from "./Controller/Controller";

const Edit = ({ match }) => {
  const [survey, setSurvey] = useState(null);

  const [selectedElement, setSelectedElement] = useState("");
  const surveyId = match.params.link;

  useEffect(async () => {
    const survey = await getApi(`/surveys/${surveyId}`);
    setSurvey(survey);
  }, []);

  console.log(survey);

  return (
    <div>
      <div style={{ opacity: survey ? 0 : 1 }}>Loading</div>
      <h1>Edit Page</h1>
      <p>{surveyId}</p>
      <Controller element={selectedElement} setElement={setSelectedElement} />
      <h2>{selectedElement}</h2>
      <Link to={"/forms/survey/end/" + match.params.link}>완료</Link>
    </div>
  );
};

export default Edit;
