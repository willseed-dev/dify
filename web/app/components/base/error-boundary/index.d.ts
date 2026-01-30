import type { ErrorInfo, ReactNode } from 'react';
import * as React from 'react';
type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onReset?: () => void;
    showDetails?: boolean;
    className?: string;
    resetKeys?: Array<string | number>;
    resetOnPropsChange?: boolean;
    isolate?: boolean;
    enableRecovery?: boolean;
    customTitle?: string;
    customMessage?: string;
};
declare const ErrorBoundary: React.FC<ErrorBoundaryProps>;
export declare function useErrorHandler(): any;
export declare function useAsyncError(): any;
export declare function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>): React.ComponentType<P>;
export declare const ErrorFallback: React.FC<{
    error: Error;
    resetErrorBoundaryAction: () => void;
}>;
export default ErrorBoundary;
