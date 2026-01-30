import type { Plugin } from '../types';
import * as React from 'react';
export type Props = {
    className?: string;
    payload: Plugin;
    titleLeft?: React.ReactNode;
    installed?: boolean;
    installFailed?: boolean;
    hideCornerMark?: boolean;
    descriptionLineRows?: number;
    footer?: React.ReactNode;
    isLoading?: boolean;
    loadingFileName?: string;
    limitedInstall?: boolean;
};
declare const _default: any;
export default _default;
