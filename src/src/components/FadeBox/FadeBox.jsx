import React from "react";
import "./FadeBox.scss";

export default function FadeBox({ height, children }) {
  const h = `${height}rem`;
  return (
    <>
      {children}
      <div className="fade-box-top fade-box-fader" style={{ height: h }} />
      <div className="fade-box-bottom fade-box-fader" style={{ height: h }} />
    </>
  );
}
