import type { ReactNode } from 'react';
type ContentDialogProps = {
    className?: string;
    show: boolean;
    onClose?: () => void;
    children: ReactNode;
};
declare const ContentDialog: ({ className, show, onClose, children, }: ContentDialogProps) => any;
export default ContentDialog;
