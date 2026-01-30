import type { FC } from 'react';
export type SimplePluginInfo = {
    pluginUniqueIdentifier: string;
    pluginId: string;
};
export type ReactMarkdownWrapperProps = {
    latexContent: any;
    customDisallowedElements?: string[];
    customComponents?: Record<string, React.ComponentType<any>>;
    pluginInfo?: SimplePluginInfo;
};
export declare const ReactMarkdownWrapper: FC<ReactMarkdownWrapperProps>;
