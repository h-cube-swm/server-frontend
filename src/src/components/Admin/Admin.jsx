import React, { useState } from "react";
import "./Admin.scss";
import API from "../../utils/apis";

const LIMIT = 25;

function beautifyTime(date) {
  return new Date(date).toLocaleString().replace(/ /g, "");
}

function Surveys({ offset = 0 }) {
  const [data, err] = API.admin.useSurveys(offset, LIMIT);
  if (err) return <div>{err + ""}</div>;
  if (!data) return <div>Loading</div>;

  return (
    <div>
      {data.map((survey, i) => {
        const date = new Date(survey.createdAt);
        return (
          <div key={i + offset} className="row">
            <div className="title">
              <div className="index">{offset + i + 1}</div>
              <div className="title">
                <a href={`/forms/survey/response/${survey.deployId}`}>{survey.title}</a>
              </div>
            </div>
            <div className="info">
              <div className="date">
                [{beautifyTime(survey.createdAt)}/{beautifyTime(survey.updatedAt)}]
              </div>
              <div className={"count " + (survey.responseCount > 0 && "strong")}>
                (응답 {survey.responseCount}건)
              </div>
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

  if (!isLoggedIn) return <div>Login Required.</div>;

  const getSetOffset = (newOffset) => () => {
    if (newOffset < 0) setOffset(0);
    else setOffset(newOffset);
  };

  function MoveButtons() {
    return (
      <div>
        <button onClick={getSetOffset(offset - LIMIT)}>Previous</button>
        <input type="number" value={offset} onChange={(e) => setOffset(+e.target.value)} />
        <button onClick={getSetOffset(offset + LIMIT)}>Next</button>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="container">
        <h1>Admin</h1>
        <MoveButtons />
        <div>
          <Surveys offset={offset} />
        </div>
        <MoveButtons />
      </div>
    </div>
  );
}
