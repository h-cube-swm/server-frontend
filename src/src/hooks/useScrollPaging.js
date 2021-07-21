import { useRef, useState } from "react";

const MOVE_TIME = 500;

const useScrollPaging = (onPaging) => {
    const scrollRef = useRef(0);
    const [isMoving, setIsMoving] = useState(false);

    const _onPaging = (delta) => {
        setIsMoving(true);
        setTimeout(() => {
            setIsMoving(false);
        }, MOVE_TIME);
        if (onPaging) onPaging(delta);
    };

    const onWheel = (event) => {
        const currentScroll = event.deltaY;
        if (!isMoving) {
            if (currentScroll > 0 && currentScroll > scrollRef.current) {
                _onPaging(1);
            } else if (currentScroll < 0 && currentScroll < scrollRef.current) {
                _onPaging(-1);
            }
        }
        scrollRef.current = currentScroll;
    };

    return [onWheel, isMoving];
};

export default useScrollPaging;