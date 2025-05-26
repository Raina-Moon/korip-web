import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-lg p-6 relative w-full max-w-lg shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-gray-950 text-lg">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
