type IModal = {
    className?: string;
    wrapperClassName?: string;
    containerClassName?: string;
    isShow: boolean;
    onClose?: () => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    closable?: boolean;
    overflowVisible?: boolean;
    highPriority?: boolean;
    overlayOpacity?: boolean;
    clickOutsideNotClose?: boolean;
};
export default function Modal({ className, wrapperClassName, containerClassName, isShow, onClose, title, description, children, closable, overflowVisible, highPriority, overlayOpacity, clickOutsideNotClose, }: IModal): any;
export {};
