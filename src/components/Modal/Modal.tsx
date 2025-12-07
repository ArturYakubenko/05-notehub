import type { FC, ReactNode } from "react";
import {useEffect} from "react"
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  closeModal: () => void;
}

const Modal: FC<ModalProps> = ({ children, closeModal }) => {
 
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
     const originalOverflow = document.body.style.overflow;
          document.body.style.overflow = "hidden";
    

    return () => {
      window.removeEventListener("keydown", handleEsc);
         document.body.style.overflow = originalOverflow;
    };
  }, [closeModal]);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) closeModal();
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