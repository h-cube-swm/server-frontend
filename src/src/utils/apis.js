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

async function sendImg(body) {
  const { token } = localStorage;

  try {
    const res = await axios({
      method: "post",
      url: `https://images.${DOMAIN}/images`,
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    return [res.data, null, res.status];
  } catch (error) {
    return [error.response && error.response.data, error, error.response.status];
  }
}

async function tempSendData(method, body) {
  try {
    const config = {
      url: `https://suggestion.dev.the-form.io/test`,
      method: method.toLowerCase(),
    };
    if (body) config.data = { text: body };
    const { status, data } = await axios(config);
    return [data, null, status];
  } catch (error) {
    return [error.response && error.response.data, error, -1];
  }
}

async function deleteData(path) {
  const { token } = localStorage;

  try {
    const config = {
      url: ROOT + path,
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { status } = await axios(config);
    return status;
  } catch (error) {
    return 400;
  }
}

export default {
  // rid = Response ID, sid = Survey ID, qid = Question ID

  // Get
  useResponses: (rid) => useFetch(`/surveys/${rid}/responses`),
  useSurvey: (sid) => useFetch(`/surveys/${sid}`),
  useUser: (hash) => useFetch(`/users/surveys/${hash ? "?hash=" + hash : ""}`),

  // PUT,POST
  postSurvey: () => sendData("POST", "/surveys"),
  putSurvey: (sid, survey) => sendData("PUT", `/surveys/${sid}`, survey),
  putEmail: (sid, email) => sendData("PUT", `/surveys/${sid}/emails`, { email }),
  endSurvey: (sid) => sendData("PUT", `/surveys/${sid}/end`),
  postResponse: (sid, response) => sendData("POST", `/surveys/${sid}/responses`, response),
  postImg: (data) => sendImg(data),
  postCopySurvey: (sid) => sendData("POST", "/surveys/copy", { sid }),

  // temporal
  postSuggestion: (body) => tempSendData("POST", body),

  // DELETE
  deleteSurvey: (sid) => deleteData(`/surveys/${sid}`),
};
