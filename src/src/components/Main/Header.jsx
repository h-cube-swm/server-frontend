/* React elements */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DOMAIN } from "../../constants";
import { useGlobalState } from "../../contexts/GlobalContext";
import FloatingLogo from "../FloatingLogo/FloatingLogo";
import "./Header.scss";

function Header() {
  const { token, logout } = useGlobalState();
  const location = `https://${DOMAIN}${useLocation().pathname}`;

  function handleLogout() {
    logout();
  }

  return (
    <div className="header">
      <FloatingLogo />
      <div className="banner">
        {token && (
          <>
            <Link to="/mypage">마이페이지</Link>
            <a className="login" href="./" onClick={handleLogout}>
              로그아웃
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
