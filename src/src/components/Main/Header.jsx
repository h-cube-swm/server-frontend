/* React elements */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobalState } from "../../contexts/GlobalContext";
import { DOMAIN } from "../../constants";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./Header.scss";

function Header() {
  const { token, logout } = useGlobalState();
  const location = `https://${DOMAIN}${useLocation().pathname}`;
  const href = `https://auth.the-form.io?redirect=${location}`;

  function handleLogout() {
    logout();
  }

  return (
    <div className="header">
      <FloatingLogo />
      <div className="banner">
        {token ? (
          <>
            <Link to="/mypage">마이페이지</Link>
            <a className="login" href="./" onClick={handleLogout}>
              로그아웃
            </a>
          </>
        ) : (
          <a className="login" href={href}>
            로그인
          </a>
        )}
      </div>
    </div>
  );
}

export default Header;
