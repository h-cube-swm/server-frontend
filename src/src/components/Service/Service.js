import React from 'react';
import './Service.scss';
import character3 from './main-service-1.svg';
import character4 from './main-service-2.svg';
import character5 from './main-service-3.svg';

function Service() {
    return (
        <div className="container">
            <div className="row-1">
                <h2>
                    방금 답한 이름, 나이, 직업같은 것들<br />
                    다시 입력할 필요 없이 저희가 다 해드릴게요.
                </h2>
                <img src={character3} alt="sitting man" />
            </div>
            <div className="row-2">
                <img src={character4} alt="man and bubble" />
                <h2>
                    단조로운 디자인, 귀찮은 경품 추첨,<br />
                    어려운 조사방법론까지.<br />
                    당신은 그저 정보만 가져가세요.<br />
                    그것도 저희가 다 해드릴게요.
                </h2>
            </div>
            <div className="row-3">
                <h2>
                    이렇게나 묻고 답하기 좋은 폼이<br />
                    여기, 있습니다.
                </h2>
                <img src={character5} alt="" />
            </div>
        </div>
    );
}

export default Service;
