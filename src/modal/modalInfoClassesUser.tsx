import React from "react";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    type?: "max" | "min";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children}) => {  

    if (!isOpen) return null;
    
    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-bot" onClick={onClose}><RxCross2 /></button>
                {children}
            </div>
        </div>
    );
};

export default Modal;