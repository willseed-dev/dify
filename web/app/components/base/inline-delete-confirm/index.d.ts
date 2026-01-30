import type { FC } from 'react';
export type InlineDeleteConfirmProps = {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    className?: string;
    variant?: 'delete' | 'warning' | 'info';
};
declare const InlineDeleteConfirm: FC<InlineDeleteConfirmProps>;
export default InlineDeleteConfirm;
