import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function FloatingLogo() {
  return (
    <div className="floating-logo">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
    </div>
  );
}
