/* React elements */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { getApi } from "../../../utils/parser";
import Loading from "../../Loading/Loading";

const Survey = () => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const getLink = async () => {
      try {
        const response = await getApi("/link");
        const url = "/forms/survey/edit/" + response.link;
        setRedirect(<Redirect to={url} />);
      } catch (e) {
        if (e.response.status === 400)
          setRedirect(<Redirect to="/error/published" />);
        console.log(e);
      }
    };
    getLink();
  }, []);

  return (
    <div>
      <Loading />
      {redirect}
    </div>
  );
};

export default Survey;
