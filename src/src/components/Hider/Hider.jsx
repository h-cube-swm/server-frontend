import React from "react";
import "./Hider.scss";

export default function Hider({ hide, children }) {
	return <div className={`hider ${hide ? "hide" : ""}`}>{children}</div>;
}
