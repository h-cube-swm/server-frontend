import axios from "axios";
import { useEffect, useState } from "react";
import { DOMAIN } from "constants.js";

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

async function getSuggestion(text) {
  try {
    const config = {
      url: `https://suggestion.dev.the-form.io/test?text=${text}`,
      method: "GET",
    };
    const { data } = await axios(config);
    return [data, null];
  } catch (error) {
    return [error.response && error.response.data, error];
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

  // GET
  useResponses: (rid) => useFetch(`/surveys/${rid}/responses`),
  useSurvey: (sid, mode = "edit", hash) =>
    useFetch(`/surveys/${sid}?mode=${mode}${hash ? "&hash=" + hash : ""}`),
  useUser: (hash) => useFetch(`/users/surveys/${hash ? "?hash=" + hash : ""}`),
  useDraw: (sid, mode) => useFetch(`/surveys/${sid}/draw?mode=${mode}`),

  // PUT,POST
  postSurvey: () => sendData("POST", "/surveys"),
  putSurvey: (sid, survey) => sendData("PUT", `/surveys/${sid}`, survey),
  putSurveyStatus: (sid, status) => sendData("PUT", `/surveys/${sid}/status`, { status }),
  putEmail: (sid, email) => sendData("PUT", `/surveys/${sid}/emails`, { email }),
  endSurvey: (sid) => sendData("PUT", `/surveys/${sid}/end`),
  postResponse: (sid, response) => sendData("POST", `/surveys/${sid}/responses`, response),
  postImg: (data) => sendImg(data),
  postCopySurvey: (sid) => sendData("POST", "/surveys/copy", { sid }),

  // DELETE
  deleteSurvey: (sid) => deleteData(`/surveys/${sid}`),

  // temporal
  getSuggestion,

  // Admin API
  admin: {
    useIsLoggedIn: () => useFetch("/admin/isLoggedIn"),
    useSurvey: (id) => useFetch(`/admin/surveys/${id}`),
    useSurveys: (offset, limit, condition, order) =>
      useFetch(
        `/admin/surveys?offset=${offset}&limit=${limit}&condition=${condition}&order=${order}`,
      ),
    useSurveysWithCount: (offset, limit) =>
      useFetch(`/admin/surveys/count?offset=${offset}&limit=${limit}`),
  },
};
