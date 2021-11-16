import React from "react";
import { Link } from "react-router-dom";
import "./EditCover.scss";

export default function EditCover() {
  return (
    <div className="edit-cover">
      <div className="contents">
        <h1>
          모바일 환경에서 <br />폼 제작을 권장하지 않습니다.
        </h1>
        <p>PC, 태블릿PC 등을 이용해주세요.</p>
      </div>
      <Link className="btn rg home-btn" to="/">
        홈으로
      </Link>
    </div>
  );
}
