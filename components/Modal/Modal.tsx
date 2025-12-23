//components/Modal/Modal.tsx

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const modalRoot =
  (typeof document !== 'undefined' && document.getElementById('modal-root')) ||
  (typeof document !== 'undefined' ? document.body : null);

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    if (!modalRoot) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!modalRoot) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}
