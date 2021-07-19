import React, { useEffect, useState } from 'react';
import { CardTypes, CardStates } from '../constants';
import '../Card/Card.scss';

export default function Card({ question, state, setQuestion, setResponse, index, selectedIndex }) {

    const [isInit, setIsInit] = useState(true);
    const { type } = question;
    const deltaIndex = index - selectedIndex;
    const isSelected = deltaIndex === 0;
    const yPos = deltaIndex * 540;

    useEffect(() => {
        setTimeout(() => {
            setIsInit(false);
        }, 400);
    }, []);

    const style = {
        transform: 'translate(-50%, -50%)',
        opacity: isInit ? 0 : 1
    };

    switch (type) {

    }

    switch (state) {
        case CardStates.EDITTING:
            style.transform += ` translateY(${yPos}px)`;
            if (isSelected) {

            } else {

            }
            break;
        case CardStates.ORDERING:
            break;
        case CardStates.RESPONSE:
            break;
    }

    return (
        <div className="survey-card" style={style}>
            {CardTypes.CARD_MODE_RESPONSE}
            <div>Question : {JSON.stringify(question)}</div>
            <div>Type : {type}</div>
            <div>State: {state}</div>
            <div>Index : {index}</div>
            <div>SelectedIndex : {selectedIndex}</div>
        </div>
    );
};