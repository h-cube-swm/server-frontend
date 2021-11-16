import React from "react";
import Title from "components/Title/Title";

import Intro from "./Intro";
import Header from "./Header";
import Service from "./Service";

import "./Main.scss";

const Main = () => {
  return (
    <>
      <Title>더폼 - 모든 폼을 대신하는 폼 나는 설문조사</Title>
      <div className="main-page">
        <Header />
        <Intro />
        <Service />
        <div className="footer">
          <div className="description">
            <h1 className="company">더폼</h1>
            <h4>주소: 서울특별시 강남구 테헤란로 311(역삼동) 아남타워빌딩 7층(06151)</h4>
            <h4>
              기업문의: <a href="mailto:contact@the-form.io">contact@the-form.io</a>
            </h4>
            <h4>
              이용문의: <a href="mailto:support@the-form.io">support@the-form.io</a>
            </h4>
          </div>
          <p className="copyright">Copyright 2021 H-cube Co. all rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Main;
