import type { SimplePluginInfo } from '../markdown/react-markdown-wrapper';
import * as React from 'react';
type PluginParagraphProps = {
    pluginInfo?: SimplePluginInfo;
    node?: any;
    children?: React.ReactNode;
};
export declare const PluginParagraph: React.FC<PluginParagraphProps>;
export {};
