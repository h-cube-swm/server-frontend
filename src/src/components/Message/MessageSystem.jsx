import React, { useEffect, useState } from "react";
import { useMessage } from "../../contexts/MessageContext";
import "./MessageSystem.scss";
import delIcon from "../../assets/icons/del-btn2.svg";
import delIconWhite from "../../assets/icons/del-btn3.svg";
import Positioner from "../Positioner/Positioner";
import useTimeout from "../../hooks/useTimeout";

const MESSAGE_LIFE = 5000;

function Message({ index, children, onClose, type }) {
  const shouldClose = useTimeout(MESSAGE_LIFE);
  const [position, setPosition] = useState(-72);

  useEffect(() => {
    if (shouldClose) onClose();
  }, [shouldClose, onClose]);

  useEffect(() => {
    setTimeout(() => setPosition(index * 72), 0);
  }, [index]);

  const classes = "message " + type;
  const splitterClasses = "splitter " + type;

  return (
    <Positioner y={position}>
      <div className="message-box">
        <div className={classes}>
          <div className="message-inner-box">{children}</div>
          <div className={splitterClasses}></div>
          <button onClick={onClose}>
            <img
              className="close"
              src={type === "default" ? delIcon : delIconWhite}
              alt="del"
            />
          </button>
        </div>
      </div>
    </Positioner>
  );
}

export default function MessageSystem() {
  const { messageQueue, close } = useMessage();
  return (
    <div className="message-system">
      {messageQueue.map(([id, message, type], i) => (
        <Message
          key={id}
          index={messageQueue.length - i}
          type={type}
          onClose={() => close(id)}>
          {message}
        </Message>
      ))}
    </div>
  );
}
