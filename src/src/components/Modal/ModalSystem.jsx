import React from "react";
import { useModal } from "../../contexts/ModalContext";
import Positioner from "../Positioner/Positioner";

import "./ModalSystem.scss";

function Modal({ children, href, onSubmit, onClose }) {
  const onClick = () => {
    onSubmit();
    onClose();
  };
  return (
    <Positioner>
      <div className="modal-box">
        <div className="modal-inner-box">{children}</div>
        <div className="btn-children">
          {href && (
            <a className="login" href={href}>
              로그인
            </a>
          )}
          {onSubmit && (
            <button className="default" onClick={onClick}>
              완료
            </button>
          )}
          <button className="gray" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </Positioner>
  );
}

export default function ModalSystem() {
  const { modal, remove } = useModal();
  const [children, href, onSubmit] = modal;
  return (
    <>
      {modal.length !== 0 && (
        <>
          <div className="black-board" onClick={() => remove()} />
          <div className="modal-system">
            <Modal href={href} onSubmit={onSubmit} onClose={() => remove()}>
              {children}
            </Modal>
          </div>
        </>
      )}
    </>
  );
}
