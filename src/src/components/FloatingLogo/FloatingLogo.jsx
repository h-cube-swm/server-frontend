import React from "react";
import { Link } from "react-router-dom";
import logo from "assets/images/logo.png";
import { useGlobalState } from "contexts/GlobalContext";
import "./FloatingLogo.scss";

export default function FloatingLogo() {
  const { isEmbed } = useGlobalState();
  if (isEmbed) return null;

  return (
    <div className="floating-logo">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
    </div>
  );
}
