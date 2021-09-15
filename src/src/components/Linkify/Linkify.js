import React from "react";

const REGEX_URL =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export default function Linkify({ children }) {
  if (children instanceof Array) return children.map((x, i) => <Linkify key={i}>{x}</Linkify>);
  if (typeof children === "string") {
    let str = children;
    const list = [];
    while (true) {
      const match = str.match(REGEX_URL);
      if (match === null) break;
      const url = match[0];
      list.push(str.substring(0, match.index));
      list.push(
        <a href={url} key={list.length}>
          {url}
        </a>,
      );
      str = str.substring(match.index + url.length);
    }
    if (str.length > 0) {
      list.push(str);
    }
    return <>{list}</>;
  }
  return <>{children}</>;
}
