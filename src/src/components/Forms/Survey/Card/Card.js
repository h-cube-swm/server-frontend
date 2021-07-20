import React, { useEffect, useState } from 'react';
import { CardTypes, CardStates, CardStyle } from '../constants';
import '../Card/Card.scss';
import hanleImage from '../../../../assets/icons/handle.svg';

export default function Card({
    question,
    state,
    setQuestion,
    setResponse,
    index,
    selectedIndex,
    onGrab,
    dom
}) {

    const [isInit, setIsInit] = useState(true);
    //ToDo : 여기서 에러 발생함. question 이 null인 경우 있음!
    const { type } = question;
    const deltaIndex = index - selectedIndex;
    const yPos = deltaIndex * (CardStyle.HEIGHT + CardStyle.DISTANCE);
    let showHandle = false;

    useEffect(() => {
        setTimeout(() => {
            setIsInit(false);
        }, 400);
    }, []);

    let style = {
        transform: 'translate(-50%, -50%)',
        opacity: isInit ? 0 : 1,
        height: CardStyle.HEIGHT
    };

    switch (type) {

    }

    switch (state) {
        case CardStates.EDITTING:
            style.transform += ` translateY(${yPos}px)`;
            showHandle = true;
            break;
        case CardStates.ORDERING:
            style.opacity = 0;
            style.transitionDuration = 0 + 's';
            break;
        case CardStates.RESPONSE:
            style.transform += ` translateY(${yPos}px)`;
            break;
        case CardStates.GHOST:
            showHandle = true;
            style.transform = "translate(-660px,-50%)";
            style.transitionDuration = 0 + 's';
            if (index == 0) {
                style.opacity = 0;
                style.zIndex = -1;
            }
            break;
    }

    const _onGrab = (event) => {
        if (!showHandle) return;
        event.preventDefault();
        onGrab();
    };

    return (
        <div className="survey-card" style={style} ref={dom} >
            {CardTypes.CARD_MODE_RESPONSE}
            <div>Question : {JSON.stringify(question)}</div>
            <div>Type : {type}</div>
            <div>State: {state}</div>
            <div>Index : {index}</div>
            <div>SelectedIndex : {selectedIndex}</div>
            <div className="handle" onMouseDown={_onGrab} style={{ opacity: showHandle ? 1 : 0, cursor: showHandle ? 'grab' : 'inherit' }}>
                <img src={hanleImage}></img>
            </div>
        </div>
    );
};