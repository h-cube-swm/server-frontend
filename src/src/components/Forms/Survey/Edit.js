/* React elements*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../../../utils/parser";

/* Components */
import Controller from "./Controller/Controller";

const Edit = ({ match }) => {
  const [selectedElement, setSelectedElement] = useState("");
  const survey_id = match.params.link;

  return (
    <>
      <h1>Edit Page</h1>
      <p>{survey_id}</p>
      <Controller setElement={setSelectedElement} />
      <h2>{selectedElement}</h2>
      <Link to={"/forms/survey/end/" + match.params.link}>완료</Link>
    </>
  );
};

export default Edit;
