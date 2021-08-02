/* React elements */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { getApi } from "../../../utils/parser";
import Error from "../../Error/Error";

const Survey = () => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const getLink = async () => {
      try {
        const response = await getApi("/link");
        const url = "/forms/survey/edit/" + response.link;
        setRedirect(<Redirect to={url} />);
      } catch (e) {
        console.log(e);
      }
    };
    getLink();
  }, []);

  return (
    <div>
      <Error type="loading" />
      {redirect}
    </div>
  );
};

export default Survey;
