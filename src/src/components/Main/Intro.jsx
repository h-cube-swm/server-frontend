/* React elements */
import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import EditCover from "../Forms/Survey/Edit/EditCover";

/* Styles */
import "./Intro.scss";
import Chaos from "../Chaos/Chaos";
import { useMessage } from "../../contexts/MessageContext";

function Intro() {
  let isMobile = false;
  if (document.getElementById("root").offsetWidth < 767) {
    isMobile = true;
  }

  const { publish } = useMessage();

  useEffect(() => {
    publish(
      <div>
        <p>
          본 서비스는 <strong>베타 버전</strong>입니다 🚢 <br /> 문제가 발생할 경우 하단{" "}
          <strong>채널톡</strong>을 통해 알려주시면 빠르게 개선하도록 하겠습니다.
        </p>
      </div>,
      "warning",
    );
  }, []);

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
          <Link className="btn long" to={isMobile ? "/forms/survey/mobile" : "/forms/survey"}>
            설문조사 만들기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Intro;
