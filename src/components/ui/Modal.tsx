import React, { useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!isOpen) return null;

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity" onClick={handleClickOutside}>
      <div className="bg-white rounded-lg p-6 relative w-full max-w-lg max-h-[80vh] shadow-lg overflow-y-auto" ref={modalRef}>
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-gray-950 text-lg">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
