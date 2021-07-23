import { useRef, useState } from "react";

const TIMEOUT = 500;

const useDragPaging = (onPaging, threshold = 64) => {

    const [isDragging, setIsDragging] = useState(false);

    const mX = useRef(0);
    const mY = useRef(0);
    const isTriggable = useRef(true);
    const ref = useRef(null);
    const onDragRef = useRef(() => { });

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

    const _onPaging = (delta) => {
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

        ref.current.style.transitionDuration = '0s';
        ref.current.style.position = 'absolute';
        ref.current.style.left = mX.current + 'px';
        ref.current.style.top = mY.current + 'px';

        if (!isTriggable.current) return;
        if (mY.current < center - threshold) {
            _onPaging(-1);
        } else if (mY.current > center + threshold) {
            _onPaging(+1);
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

    return [onGrab, backgroundCallbacks, isDragging ? ref : null, isDragging];
};

export default useDragPaging;