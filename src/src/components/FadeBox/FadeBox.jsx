import React from "react";
import "./FadeBox.scss";

export default function FadeBox({ height, children }) {
  const h = `${height}rem`;
  return (
    <>
      <div className="fade-box top" style={{ height: h }} />
      {children}
      <div className="fade-box bottom" style={{ height: h }} />
    </>
  );
}
