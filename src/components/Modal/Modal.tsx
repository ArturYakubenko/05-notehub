import type { FC, ReactNode } from "react";
import {useEffect} from "react"
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  openModal: () => void;
}

const Modal: FC<ModalProps> = ({ children, openModal }) => {
 
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        openModal();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [openModal]);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) openModal();
  };

  const modalContent = (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default Modal