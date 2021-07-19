import React from 'react';
import { CardTypes, CardStates } from '../constants';
import '../Card/Card.scss';

export default function Card({ question, state, setQuestion, setResponse, index, selectedIndex }) {

    const { type } = question;
    const style = {
        transform: 'translate(-50%,-50%)'
    };

    switch (type) {

    }

    switch (state) {

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