/* React elements */
import { React } from "react";
import { Link } from "react-router-dom";

/* Styles */
import "./Intro.scss";
import character1 from "../../assets/images/main-character-1.svg";
import character2 from "../../assets/images/main-character-2.svg";

function Intro() {
  return (
    <div className="intro">
      <div className="character1">
        <img src={character1} alt="counting man" />
      </div>
      <div className="outer-box">
        <div className="message">
          <h1>
            모든 폼을 대신하는
            <br />더 폼나는 설문조사
            <br />
            <strong>더 폼</strong>
          </h1>
          <Link className="link-btn-xl" to="/forms/survey">
            설문조사 하러가기
          </Link>
        </div>
      </div>
      <div className="character2">
        <img src={character2} alt="counting man" />
      </div>
    </div>
  );
}

export default Intro;
