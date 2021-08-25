import React from "react";

import Intro from "./Intro";
import Header from "./Header";
import Service from "./Service";

import "./Main.scss";
import Title from "../Title/Title";

const Main = () => {
  return (
    <>
      <Title>모든 폼을 대신하는 폼나는 설문조사</Title>
      <div className="main-page">
        <Header />
        <Intro />
        <Service />
        <div className="footer">Copyright 2021 H-cube Co. all rights reserved.</div>
      </div>
    </>
  );
};

export default Main;
