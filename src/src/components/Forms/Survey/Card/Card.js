import React from 'react';

export default {
    CARD_MODE_EDITTING: 0x01,
    CARD_MODE_RESPONSE: 0x02,

    Card: function ({ question, mode, setQuestion, setResponse, index, selectedIndex }) {
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