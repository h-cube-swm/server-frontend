import { useEffect, useRef, useState } from "react";

const TIMEOUT = 500;

const useDragPaging = (onPaging, threshold = 64) => {
  const [isDragging, setIsDragging] = useState(false);

  const mX = useRef(0);
  const mY = useRef(0);
  const isTriggable = useRef(true);
  const ref = useRef(null);
  const onDragRef = useRef(() => {});

  const center = window.innerHeight / 2;

  const onGrab = () => {
    setIsDragging(true);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const handleOnPaging = (delta) => {
    if (!isTriggable.current) return;
    isTriggable.current = false;

    onPaging(delta);
    setTimeout(() => {
      isTriggable.current = true;
      onDragRef.current();
    }, TIMEOUT);
  };

  const onDrag = () => {
    if (!isDragging) return;
    if (!ref.current) return;

    ref.current.style.left = `${mX.current}px`;
    ref.current.style.top = `${mY.current}px`;

    if (!isTriggable.current) return;
    if (mY.current < center - threshold) {
      handleOnPaging(-1);
    } else if (mY.current > center + threshold) {
      handleOnPaging(+1);
    }
  };
  onDragRef.current = onDrag;
  onDrag();

  const onMouseMove = (event) => {
    mX.current = event.clientX;
    mY.current = event.clientY;

    onDrag();
  };

  const backgroundCallbacks = { onMouseMove, onMouseUp, onMouseLeave };

  if (ref.current) {
    if (isDragging) {
      ref.current.style.transitionDuration = "0s";
      ref.current.style.opacity = 1;
      ref.current.style.zIndex = 1;
    } else {
      ref.current.style.opacity = 0;
      ref.current.style.zIndex = -1;
    }
  }

  useEffect(() => {
    if (ref.current) ref.current.style.position = "absolute";
  }, []);

  return [onGrab, backgroundCallbacks, ref, isDragging];
};

export default useDragPaging;
