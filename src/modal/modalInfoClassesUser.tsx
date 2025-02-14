import React from "react";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    type?: "max" | "min";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, type }) => {  

    if (!isOpen) return null;
    
    return (
        <div className={`modal ${type}`}>
            <div className={`modal-content ${type}`}>
                <button className="close-bot" onClick={onClose}><RxCross2 /></button>
                {children}
            </div>
        </div>
    );
};

export default Modal;