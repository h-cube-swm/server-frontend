import React from "react";

import Intro from "./Intro";
import Header from "./Header";
import Service from "./Service";

import "./Main.scss";
import Title from "../Title/Title";

const Main = () => {
  return (
    <>
      <Title>더 폼 - 모든 폼을 대신하는 폼 나는 설문조사</Title>
      <div className="main-page">
        <Header />
        <Intro />
        <Service />
        <div className="footer">
          <div className="description">
            <h1 className="company">더 폼</h1>
            <h4>주소: 서울특별시 강남구 테헤란로 311(역삼동) 아남타워빌딩 7층(06151)</h4>
            <h4>제휴·협력문의: support@the-from.io</h4>
          </div>
          <p className="copyright">Copyright 2021 H-cube Co. all rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Main;
