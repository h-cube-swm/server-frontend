import React from "react";
import "./Service.scss";
import character3 from "../../assets/images/main-service-1.svg";
import character4 from "../../assets/images/main-service-2.svg";
import character5 from "../../assets/images/main-service-3.svg";
import partition from "../../assets/images/partition.png";

import useScrollFadeIn from "../../hooks/useScrollFadeIn";

function Service() {
  const animatedItem = useScrollFadeIn();
  const animatedItem2 = useScrollFadeIn();
  const animatedItem3 = useScrollFadeIn();

  return (
    <div className="container">
      <div className="row row-1" {...animatedItem}>
        <h2>
          방금 답한 이름, 나이, 직업같은 것들
          <br />
          다시 입력할 필요 없이 저희가 다 해드릴게요.
        </h2>
        <img src={character3} alt="sitting man" />
      </div>
      <div className="row row-2" {...animatedItem2}>
        <img src={character4} alt="man and bubble" />
        <h2>
          단조로운 디자인, 귀찮은 경품 추첨,
          <br />
          어려운 조사방법론까지.
          <br />
          당신은 그저 정보만 가져가세요.
          <br />
          그것도 저희가 다 해드릴게요.
        </h2>
      </div>
      <div className="row row-3" {...animatedItem3}>
        <h2>
          이렇게나 묻고 답하기 좋은 폼이
          <br />
          여기, 있습니다.
        </h2>
        <img src={character5} alt="" />
      </div>
    </div>
  );
}

export default Service;
