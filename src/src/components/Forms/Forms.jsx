import React from 'react';
import { Route, Link } from 'react-router-dom';

const Forms = () => {
  return (
    <>
      <div>
        <ul>
          <li>
            <Link to="/forms/survey/:survey_id">설문조사</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Forms;