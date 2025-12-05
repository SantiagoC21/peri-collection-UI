// ModalComponent.tsx
import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;


  if (typeof document === 'undefined') return null;

  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) return null;

  // Renderizar el modal usando un Portal
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        
      </div>
    </div>,
    modalRoot as HTMLElement // Apunta al div de fuera de la app
  );
};

export default Modal;

