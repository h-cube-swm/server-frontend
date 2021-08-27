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
        if (data.success) {
          setData([data.result, null]);
        } else {
          setData([data.result, data]);
        }
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
    const { data } = await axios(config);
    return [data, null];
  } catch (error) {
    return [error.response && error.response.data, error];
  }
}

export default {
  // Get
  useResponses: (resultId) => useFetch(`/surveys/${resultId}/responses`),
  useLink: () => useFetch("/link"),
  useSurvey: (surveyId) => useFetch(`/surveys/${surveyId}`),

  putSurvey: (surveyId, survey) => sendData("PUT", `/surveys/${surveyId}`, survey),
  putEmail: (surveyId, email) => sendData("PUT", `/surveys/${surveyId}/emails`, { email }),
  endSurvey: (surveyId) => sendData("PUT", `/surveys/${surveyId}/end`),
  postResponse: (surveyId, response) =>
    sendData("POST", `/surveys/${surveyId}/responses`, response),
};
