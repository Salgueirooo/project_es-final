import React from "react";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children}) => {  

    if (!isOpen) return null;
    
    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-bot" onClick={onClose}><RxCross2 /></button>
                {children}
            </div>
        </div>
    );
};

export default Modal;