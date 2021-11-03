import React, { useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import Positioner from "../Positioner/Positioner";

import "./ModalSystem.scss";

function Modal({ children, href, onSubmit, onClose, width, height }) {
  const onClick = () => {
    onSubmit();
    onClose();
  };
  return (
    <Positioner>
      <div className="modal-box" style={{ width: { width }, height: { height } }}>
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
            돌아가기
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
