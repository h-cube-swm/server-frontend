import React from "react";
import { useModal } from "../../contexts/ModalContext";
import Positioner from "../Positioner/Positioner";

import "./ModalSystem.scss";

function Modal({
  children,
  href,
  onSubmit,
  onClose,
  width,
  height,
  type,
  submitMessage,
  isVisible,
}) {
  const onClick = () => {
    onSubmit();
    onClose();
  };
  let buttonColor = "#2b44ff";
  if (type) {
    buttonColor = "#E22F1B";
  }
  return (
    <Positioner y={isVisible ? 0 : "-200%"}>
      <div className={"modal-box " + type} style={{ width, height }}>
        <div className="modal-inner-box">{children}</div>
        <div className="btn-children">
          {href && (
            <a className="login" href={href}>
              로그인
            </a>
          )}
          {onSubmit && (
            <button className="default" onClick={onClick} style={{ backgroundColor: buttonColor }}>
              {submitMessage}
            </button>
          )}
          <button className="gray" onClick={onClose}>
            돌아가기
          </button>
        </div>
      </div>
    </Positioner>
  );
}

export default function ModalSystem() {
  const { modal, remove } = useModal();
  const { children, href, onSubmit, type, submitMessage } = modal;
  const isVisible = Object.keys(modal).length > 0;
  return (
    <>
      {
        <>
          {isVisible && <div className="black-board" onClick={() => remove()} />}
          <div className="modal-system">
            <Modal
              isVisible={isVisible}
              href={href}
              onSubmit={onSubmit}
              onClose={() => remove()}
              type={type}
              submitMessage={submitMessage}>
              {children}
            </Modal>
          </div>
        </>
      }
    </>
  );
}
