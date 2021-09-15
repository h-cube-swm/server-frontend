import React from "react";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
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
      </div>
    </div>
  );
}
