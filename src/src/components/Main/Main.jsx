import React from "react";

import Intro from "./Intro";
import Header from "./Header";
import Service from "./Service";

import "./Main.scss";

const Main = () => {
  return (
    <div className="main-page">
      <Header />
      <Intro />
      <Service />
      <div className="footer">
        Copyright 2021 H-cube Co. all rights reserved.
      </div>
    </div>
  );
};

export default Main;
