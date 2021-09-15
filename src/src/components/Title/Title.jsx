import React from "react";
import { Helmet } from "react-helmet";

export default function Title({ children }) {
  let text = "";
  if (children instanceof Array) {
    text = children.join("");
  } else {
    text = `${children}`;
  }

  return (
    <Helmet>
      <title>{text}</title>
    </Helmet>
  );
}
