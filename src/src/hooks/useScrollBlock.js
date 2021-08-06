import { useRef } from "react";

export default function useScrollBlock() {
  const ref = useRef(null);

  const onWheel = (event) => {
    if (ref.current.scrollHeight > ref.current.clientHeight) {
      event.stopPropagation();
    }
  };

  return { ref, onWheel };
}