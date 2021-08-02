import axios from "axios";
import { useEffect, useState } from 'react';

const ROOT = "https://api.the-form.io";

function useFetch(path) {

  const [data, setData] = useState([null, null]);

  useEffect(() => {
    setTimeout(async () => {
      try {
        const config = {
          url: ROOT + path,
          method: 'GET'
        };
        const { data } = await axios(config);
        if (data.success) {
          setData([data.result, null]);
        } else {
          setData([data.result, data]);
        }
      } catch (error) {
        setData([error.response.data, error]);
      }
    }, 1000);
  }, [path]);

  return data;
}

async function sendData(method, path, body) {

  method = method.toLowerCase();

  try {
    const config = {
      url: ROOT + path,
      method
    };
    if (body) config.data = body;
    const { data } = await axios(config);
    return [data, null];
  } catch (error) {
    return [error.response.data, error];
  }
}

export const API = {
  // Get
  useResponses: resultId => useFetch(`/surveys/${resultId}/responses`),
  useLink: () => useFetch('/link'),
  useSurvey: surveyId => useFetch(`/surveys/${surveyId}`),

  putSurvey: (surveyId, survey) => sendData('PUT', `/surveys/${surveyId}`, survey),
  endSurvey: (surveyId) => sendData('PUT', `/surveys/${surveyId}/end`),
  postResponse: (surveyId, response) => sendData("POST", `/surveys/${surveyId}/responses`, response)
};