import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';
import './Header.scss';

function Header() {
    return (
        <div className="header">
            <div className="logo">
                <a href="#">
                    <img src={logo} alt="logo" />
                </a>
            </div>
            <div className="account">
                <a href="#">회원가입</a>
                <a href="#">로그인</a>
            </div>
        </div>
    );
}

export default Header;