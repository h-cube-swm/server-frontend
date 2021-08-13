import React, { useEffect } from "react";
import { useMessage } from "../../contexts/MessageContext";
import "./MessageSystem.scss";
import delIcon from "../../assets/icons/del-btn2.svg";
import Positioner from "../Positioner/Positioner";
import useTimeout from "../../hooks/useTimeout";

const MESSAGE_LIFE = 5000;

function Message({ children, onClose, type }) {
  const shouldClose = useTimeout(MESSAGE_LIFE);
  useEffect(() => {
    if (shouldClose) onClose();
  }, [shouldClose]);

  const classes = "message " + type;

  return (
    <div className="message-box">
      <div className={classes}>
        <div className="message-inner-box">{children}</div>
        <div className="splitter"></div>
        <button onClick={onClose}>
          <img className="close" src={delIcon} alt="del" />
        </button>
      </div>
    </div>
  );
}

export default function MessageSystem() {
  const { messageQueue, close } = useMessage();
  return (
    <div className="message-system">
      {messageQueue.map(([id, message, type], i) => (
        <Positioner key={id} y={(messageQueue.length - i) * 72}>
          <Message type={type} onClose={() => close(id)}>
            {message}
          </Message>
        </Positioner>
      ))}
    </div>
  );
}
