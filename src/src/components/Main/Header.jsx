/* React elements */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobalState } from "../../contexts/GlobalContext";
import { DOMAIN } from "../../constants";
import "./Header.scss";
import logo from "../../assets/images/logo.png";

function Header({ isScolled }) {
  const { token, logout } = useGlobalState();
  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const loginHref = `https://auth.the-form.io?redirect=${location}`;

  function handleLogout() {
    logout();
  }

  return (
    <div className="header">
      <div className={isScolled ? "header-box scrolled" : "header-box"}>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="banner">
          <Link to="/pricing">가격안내</Link>
          {token ? (
            <>
              <Link to="/mypage">마이페이지</Link>
              <a className="login" href="./" onClick={handleLogout}>
                로그아웃
              </a>
            </>
          ) : (
            <a className="login" href={loginHref}>
              로그인
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
