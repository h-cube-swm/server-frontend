import React, { useState } from "react";
import "./Admin.scss";
import API from "../../utils/apis";

const LIMIT = 25;

function beautifyTime(date) {
  return new Date(date).toLocaleString().replace(/ /g, "");
}

function Surveys({ offset = 0, condition, order }) {
  const [data, err] = API.admin.useSurveys(offset, LIMIT, condition, order);
  if (err) return <div>{err + ""}</div>;
  if (!data) return <div>Loading</div>;

  return (
    <div className="survey-list">
      {data.map((survey, i) => {
        const title = survey.title || "No Title";

        return (
          <div key={i + offset} className="row">
            <div className="upper">
              <div className="index">{offset + i + 1}</div>
              <div className="title">
                {survey.status === "published" ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/forms/survey/response/${survey.deployId}`}>
                    {title}
                  </a>
                ) : (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/forms/survey/edit/${survey.deployId}`}>
                    {title}
                  </a>
                )}
              </div>
              <div className="published" hidden={survey.status !== "published"}>
                Published
              </div>
              <div className="result" hidden={survey.status !== "published"}>
                <a href={`/forms/survey/result/${survey.id}`}>결과</a>
              </div>
            </div>
            <div className="lower">
              <div className="date">
                [{beautifyTime(survey.createdAt)}/{beautifyTime(survey.updatedAt)}]
              </div>
              <div className={"count " + (survey.responseCount > 0 && "strong")}>
                (응답 {survey.responseCount}건)
              </div>
              /<div>User : {survey.userId}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const [isLoggedIn, error] = API.admin.useIsLoggedIn();
  const [offset, setOffset] = useState(0);
  const [surveyId, setSurveyId] = useState("");
  const [deployId, setDeployId] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const conditionDict = {};
  if (surveyId) conditionDict.id = surveyId;
  if (deployId) conditionDict.deployId = deployId;
  const conditionString = JSON.stringify(conditionDict);

  if (error) return <div>Error occrred</div>;
  if (!isLoggedIn) return <div>Login Required.</div>;

  const getSetOffset = (newOffset) => () => {
    if (newOffset < 0) setOffset(0);
    else setOffset(newOffset);
  };

  return (
    <div className="admin">
      <div className="container">
        <h1>Surveys</h1>
        <div className="conditions">
          <div className="row">
            <label htmlFor="sid">Survey ID</label>
            <input
              id="sid"
              type="text"
              value={surveyId}
              autoComplete="off"
              onChange={(e) => {
                setSurveyId(e.target.value);
                setDeployId("");
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="did">Deploy ID</label>
            <input
              id="did"
              type="text"
              value={deployId}
              autoComplete="off"
              onChange={(e) => {
                setDeployId(e.target.value);
                setSurveyId("");
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="order">Order By</label>
            <input
              id="order"
              type="text"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            />
          </div>
          <hr />
          <div>
            {"Select where "}
            {Object.entries(conditionDict)
              .map(([key, value]) => key + " = " + value)
              .join(" and ")}
          </div>
          <div>
            {orderBy && "Order by"} {orderBy}
          </div>
        </div>
        <div className="controller">
          <button onClick={getSetOffset(offset - LIMIT)}>Previous</button>
          <input type="number" value={+offset + ""} onChange={(e) => setOffset(+e.target.value)} />
          <button onClick={getSetOffset(offset + LIMIT)}>Next</button>
        </div>
        <div>
          <Surveys offset={offset} condition={conditionString} order={orderBy} />
        </div>
        <div className="controller">
          <button onClick={getSetOffset(offset - LIMIT)}>Previous</button>
          <input type="number" value={+offset} onChange={(e) => setOffset(+e.target.value)} />
          <button onClick={getSetOffset(offset + LIMIT)}>Next</button>
        </div>
      </div>
    </div>
  );
}
