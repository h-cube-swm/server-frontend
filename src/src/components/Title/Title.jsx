import { useEffect } from "react";

export default function Title({ children }) {
  useEffect(() => {
    document.title = "더 폼 - " + children;
    return () => {};
  }, [children]);
  return null;
}
