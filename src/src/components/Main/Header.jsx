/* React elements */
import React from 'react';
import { Link } from 'react-router-dom';

/* Styles */
import logo from '../../assets/images/logo.png';
import './Header.scss';

function Header() {
    return (
        <div className="header">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="logo" />
                </Link>
            </div>
        </div>
    );
}

export default Header;