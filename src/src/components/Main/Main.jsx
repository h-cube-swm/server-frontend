import React from 'react';

import Intro from './Intro';
import Header from './Header';
import Service from './Service';

import './Main.scss';

const Main = () => {
    return (
        <div className="main-page">
            <Header />
            <Intro />
            <Service />
        </div>
    );
};

export default Main;