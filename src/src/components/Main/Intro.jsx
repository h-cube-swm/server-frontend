/* React elements */
import { React } from "react";
import { Link } from "react-router-dom";
import EditCover from "../Forms/Survey/Edit/EditCover";

/* Styles */
import "./Intro.scss";
import Chaos from "../Chaos/Chaos";

function Intro() {
  let isMobile = false;
  if (document.getElementById("root").offsetWidth < 767) {
    isMobile = true;
  }

  return (
    <div className="intro">
      <div className="fade-out" />
      <Chaos />
      <div className="outer-box">
        <div className="message">
          <h1>
            모든 폼을 대신하는
            <br />더 폼나는 설문조사
            <br />
            <strong>
              더 폼<p className="beta-tag">beta</p>
            </strong>
          </h1>
          <Link
            className="btn long"
            to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
            설문조사 만들기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Intro;
