import React from "react";

const Edit = ({ match }) => {
  return (
    <>
      <h1>Edit Page</h1>
      <p>{match.params.link}</p>
    </>
  );
};

export default Edit;
