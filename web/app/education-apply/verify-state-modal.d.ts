import * as React from 'react';
export type IConfirm = {
    className?: string;
    isShow: boolean;
    title: string;
    content?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    maskClosable?: boolean;
    email?: string;
    showLink?: boolean;
};
declare const _default: any;
export default _default;
