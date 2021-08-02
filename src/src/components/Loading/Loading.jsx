import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Chaos from "../../utils/Chaos";
import "./Loading.scss";

export default function Loading() {
  return (
    <div className="loading">
      <Link to="/">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      <h1>로딩 중입니다.</h1>
      <Chaos />
    </div>
  );
}
