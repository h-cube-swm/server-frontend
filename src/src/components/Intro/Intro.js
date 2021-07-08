import React from 'react';
import './Intro.scss';
import character1 from './main-character-1.svg';

function Intro() {
    return (
        <>
            <div className="row-1">
                <div className="character1">
                    <img src={character1} alt="counting man" />
                </div>
                <div className="outer-box">
                    <div className="intro">
                        <h1>
                            모든 폼을 대신하는<br />더 폼나는 설문조사<br />
                            <strong>더 폼</strong>
                        </h1>
                        <a href="#" className="btn-make-survey">
                            <div>
                                설문조사 하러가기
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Intro;
