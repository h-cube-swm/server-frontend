import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  /**
   * ModalQueue is list of tuple [ModalId, Modal]
   */
  const [modal, setModal] = useState([]);

  function load(children, href, onSubmit) {
    setModal([children, href, onSubmit]);
  }

  function remove() {
    setModal([]);
  }

  return <ModalContext.Provider value={{ modal, load, remove }}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  return context;
}
