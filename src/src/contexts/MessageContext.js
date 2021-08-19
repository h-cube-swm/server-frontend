import React, { createContext, useContext, useRef, useState } from "react";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  /**
   * MessageQueue is list of tuple [messageId, message]
   */
  const messageIdRef = useRef(0);
  const [messageQueue, setMessageQueue] = useState([]);

  function publish(message, type = "default") {
    setMessageQueue((queue) => [...queue, [messageIdRef.current++, message, type]]);
  }

  function close(messageId) {
    setMessageQueue((queue) => queue.filter(([id]) => id !== messageId));
  }

  return (
    <MessageContext.Provider value={{ messageQueue, publish, close }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  return context;
}
