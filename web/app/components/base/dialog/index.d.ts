import type { ElementType, ReactNode } from 'react';
type DialogProps = {
    className?: string;
    titleClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    titleAs?: ElementType;
    title?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    show: boolean;
    onClose?: () => void;
};
declare const CustomDialog: ({ className, titleClassName, bodyClassName, footerClassName, titleAs, title, children, footer, show, onClose, }: DialogProps) => any;
export default CustomDialog;
