import axios from "axios";
import { useEffect, useState } from "react";
import { DOMAIN } from "../constants";

const ROOT = `https://api.${DOMAIN}`;

function useFetch(path) {
  const [data, setData] = useState([null, null]);
  const { token } = localStorage;

  useEffect(() => {
    (async () => {
      try {
        const config = {
          url: ROOT + path,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios(config);
        setData([data.result, null]);
      } catch (error) {
        setData([error.response && error.response.data, error]);
      }
    })();
  }, [path]);

  return data;
}

async function sendData(method, path, body) {
  const { token } = localStorage;

  try {
    const config = {
      url: ROOT + path,
      method: method.toLowerCase(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) config.data = body;
    const { status, data } = await axios(config);
    return [data, null, status];
  } catch (error) {
    return [error.response && error.response.data, error, -1];
  }
}

export default {
  // rid = Response ID, sid = Survey ID

  // Get
  useResponses: (rid) => useFetch(`/surveys/${rid}/responses`),
  useSurvey: (sid) => useFetch(`/surveys/${sid}`),
  useUser: () => useFetch("/users/surveys"),

  // PUT,POST
  postSurvey: () => sendData("POST", "/surveys"),
  putSurvey: (sid, survey) => sendData("PUT", `/surveys/${sid}`, survey),
  putEmail: (sid, email) => sendData("PUT", `/surveys/${sid}/emails`, { email }),
  endSurvey: (sid) => sendData("PUT", `/surveys/${sid}/end`),
  postResponse: (sid, response) => sendData("POST", `/surveys/${sid}/responses`, response),
};
