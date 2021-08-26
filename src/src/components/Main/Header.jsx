/* React elements */
import React from "react";
import { useLocation } from "react-router-dom";
import { DOMAIN } from "../../constants";
import { useGlobalState } from "../../contexts/GlobalContext";
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
      {token ? (
        <a className="login" href="./" onClick={handleLogout}>
          Logout
        </a>
      ) : (
        <a className="login" href={href}>
          Login
        </a>
      )}
    </div>
  );
}

export default Header;
