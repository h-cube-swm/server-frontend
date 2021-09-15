import React from "react";
import Header from "../Main/Header";

import "./Pricing.scss";

export default function Pricing() {
  return (
    <div className="pricing">
      <Header />
      <div className="message">
        <span className="welcome">
          <h2>개인고객도</h2>
          <h2>기업고객도</h2>
          <h2>
            <strong>더폼</strong>에선 모두
          </h2>
        </span>

        <span className="zero">
          <h1>&quot;0원&quot;</h1>
        </span>

        <ul>
          <li>응답수 무제한</li>
          <li>6가지 질문 세트</li>
          <li>흐름 설정 기능</li>
          <li>링크를 통한 간편한 설문 배포, 결과 확인</li>
          <li>.xslx .png 등의 결과추출</li>
          <li>결과차트 제공</li>
          <li>임베드 코드 제공</li>
          <li>질문 자동추천</li>
          <li>api 제공 (기업용)</li>
          <li>.</li>
          <li>.</li>
          <li>.</li>
          <li>.</li>
        </ul>
        <p className="free">이 모든 것이 무료</p>
        <span className="comment">
          <p>
            * 기업 및 단체 고객의 경우 문의를 통한 자사 서비스 이용 시 홍보에 사용될 수 있습니다.
          </p>
          <p>* 무료 사용자의 경우 제작한 설문이 질문 추천 기능의 성능 개선에 사용될 수 있습니다.</p>
        </span>
      </div>
    </div>
  );
}
