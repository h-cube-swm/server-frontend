import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Chaos from "../../utils/Chaos";
import "./Error.scss";

export default function Error(type) {
  let contents = null;
  type = "loading";
  switch (type) {
    case "loading":
      contents = (
        <>
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          {contents}
          <Chaos />
        </>
      );
      break;
    case "routing":
      break;
    case "404":
      break;
    case "400":
      break;
    default:
      break;
  }

  return <div className="error">{contents}</div>;
}
