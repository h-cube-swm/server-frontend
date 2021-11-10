import React, { useState } from "react";
import "./Admin.scss";
import API from "../../utils/apis";

const LIMIT = 25;

function beautifyTime(date) {
  return new Date(date).toLocaleString().replace(/ /g, "");
}

function escapeID(id) {
  let newId = id;
  if (newId.indexOf("/") >= 0) newId = newId.split("/").pop();
  if (newId.indexOf("?") >= 0) [newId] = newId.split("?");
  if (newId.indexOf("#") >= 0) [newId] = newId.split("?");
  return newId;
}

function Tab({ to, children, ...props }) {
  return (
    <a target="_blank" rel="noreferrer" href={to} {...props}>
      {children}
    </a>
  );
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
                <Tab to={`/admin/view/${survey.deployId}`}>{title}</Tab>
              </div>
              <div className={"tag " + survey.status} hidden={survey.status === "editing"}>
                {survey.status}
              </div>
              <div className="spacer"></div>
              <div className="edit" hidden={survey.status !== "editing" && survey.status}>
                <Tab className="button" to={`/forms/survey/edit/${survey.id}`}>
                  수정
                </Tab>
              </div>
              <div className="result" hidden={survey.status !== "published"}>
                <Tab className="button" to={`/forms/survey/response/${survey.deployId}`}>
                  응답
                </Tab>
                <Tab className="button" to={`/forms/survey/result/${survey.id}`}>
                  결과
                </Tab>
              </div>
            </div>
            <div className="lower">
              <div className="date">
                [{beautifyTime(survey.createdAt)}/{beautifyTime(survey.updatedAt)}]
              </div>
              <div className={"count " + (survey.responseCount > 0 && "strong")}>
                (응답 {survey.responseCount}건)
              </div>
              <div hidden={!survey.userId}> / User : {survey.userId}</div>
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
                setSurveyId(escapeID(e.target.value));
                setDeployId("");
                setOffset(0);
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
                setDeployId(escapeID(e.target.value));
                setSurveyId("");
                setOffset(0);
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="order">Order By</label>
            <input
              id="order"
              type="text"
              value={orderBy}
              placeholder="e.g. -responseCount"
              onChange={(e) => {
                setOrderBy(e.target.value);
                setOffset(0);
              }}
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
