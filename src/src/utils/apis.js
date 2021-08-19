import axios from "axios";
import { useEffect, useState } from "react";

const ROOT = "https://api.the-form.io";

function useFetch(path) {
  const [data, setData] = useState([null, null]);

  useEffect(() => {
    (async () => {
      try {
        const config = {
          url: ROOT + path,
          method: "GET",
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
  try {
    const config = {
      url: ROOT + path,
      method: method.toLowerCase(),
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
