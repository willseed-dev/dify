type IModal = {
    className?: string;
    wrapperClassName?: string;
    open: boolean;
    onClose?: () => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    closable?: boolean;
    overflowVisible?: boolean;
};
export default function FullScreenModal({ className, wrapperClassName, open, onClose, children, closable, overflowVisible, }: IModal): any;
export {};
