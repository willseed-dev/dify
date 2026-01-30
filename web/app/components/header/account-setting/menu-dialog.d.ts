import type { ReactNode } from 'react';
type DialogProps = {
    className?: string;
    children: ReactNode;
    show: boolean;
    onClose?: () => void;
};
declare const MenuDialog: ({ className, children, show, onClose, }: DialogProps) => any;
export default MenuDialog;
