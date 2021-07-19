import React from 'react';

export default function Card({ question, mode, setQuestion, setResponse, index, selectedIndex }) {
    return (
        <div>
            {this.CARD_MODE_RESPONSE}
            <div>Question : {JSON.stringify(question)}</div>
            <div>Mode : {mode}</div>
            <div>Index : {index}</div>
            <div>SelectedIndex : {selectedIndex}</div>
        </div>
    );
}
};