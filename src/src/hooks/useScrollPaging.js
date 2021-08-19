import { useRef } from "react";

const MOVE_TIME = 500;

const useScrollPaging = (onPaging) => {
  const scrollRef = useRef(0);
  const isMovingRef = useRef(false);

  const handleOnPaging = (delta) => {
    isMovingRef.current = true;
    setTimeout(() => {
      isMovingRef.current = false;
    }, MOVE_TIME);
    if (onPaging) onPaging(delta);
  };

  const onWheel = (event) => {
    const currentScroll = event.deltaY;
    if (!isMovingRef.current) {
      if (currentScroll > 0 && currentScroll > scrollRef.current) {
        handleOnPaging(1);
      } else if (currentScroll < 0 && currentScroll < scrollRef.current) {
        handleOnPaging(-1);
      }
    }
    scrollRef.current = currentScroll;
  };

  return [onWheel];
};

export default useScrollPaging;
