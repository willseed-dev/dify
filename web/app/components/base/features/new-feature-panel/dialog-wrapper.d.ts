import type { ReactNode } from 'react';
type DialogProps = {
    className?: string;
    children: ReactNode;
    show: boolean;
    onClose?: () => void;
    inWorkflow?: boolean;
};
declare const DialogWrapper: ({ className, children, show, onClose, inWorkflow, }: DialogProps) => any;
export default DialogWrapper;
