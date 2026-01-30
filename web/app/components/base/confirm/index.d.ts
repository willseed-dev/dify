import * as React from 'react';
export type IConfirm = {
    className?: string;
    isShow: boolean;
    type?: 'info' | 'warning' | 'danger';
    title: string;
    content?: React.ReactNode;
    confirmText?: string | null;
    onConfirm: () => void;
    cancelText?: string;
    onCancel: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    showConfirm?: boolean;
    showCancel?: boolean;
    maskClosable?: boolean;
};
declare const _default: any;
export default _default;
