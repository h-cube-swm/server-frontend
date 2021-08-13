import { useEffect, useState } from "react";

export default function useOnce(callback) {
  const [isUsed, setIsUsed] = useState(false);
  useEffect(() => {
    if (isUsed) return;
    setIsUsed(true);
    callback();
  }, [callback, isUsed, setIsUsed]);
}