import type { ReactNode } from 'react';
export type IToastProps = {
    type?: 'success' | 'error' | 'warning' | 'info';
    size?: 'md' | 'sm';
    duration?: number;
    message: string;
    children?: ReactNode;
    onClose?: () => void;
    className?: string;
    customComponent?: ReactNode;
};
export type ToastHandle = {
    clear?: VoidFunction;
};
export declare const ToastContext: any;
export declare const useToastContext: () => any;
declare const Toast: {
    ({ type, size, message, children, className, customComponent, }: IToastProps): any;
    notify({ type, size, message, duration, className, customComponent, onClose, }: Pick<IToastProps, "type" | "size" | "message" | "duration" | "className" | "customComponent" | "onClose">): ToastHandle;
};
export declare const ToastProvider: ({ children, }: {
    children: ReactNode;
}) => any;
export default Toast;
