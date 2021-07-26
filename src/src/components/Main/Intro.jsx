/* React elements */
import { React } from "react";
import { Link } from "react-router-dom";

/* Styles */
import "./Intro.scss";
import character1 from "../../assets/images/main-character-1.svg";
import character2 from "../../assets/images/main-character-2.svg";
import introMp4 from "../../assets/videos/intro.mp4";

function Intro() {
  return (
    <div className="intro">
      {/* <div className="character1">
        <img src={character1} alt="counting man" />
      </div> */}
      <div className="video-box">
        <video className="videoTag" autoPlay loop muted>
          <source src={introMp4} type="video/mp4" />
        </video>
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
      {/* <div className="character2">
        <img src={character2} alt="counting man" />
      </div> */}
    </div>
  );
}

export default Intro;
