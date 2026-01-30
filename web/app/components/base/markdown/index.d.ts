import type { ReactMarkdownWrapperProps, SimplePluginInfo } from './react-markdown-wrapper';
import 'katex/dist/katex.min.css';
/**
 * @fileoverview Main Markdown rendering component.
 * This file was refactored to extract individual block renderers and utility functions
 * into separate modules for better organization and maintainability as of [Date of refactor].
 * Further refactoring candidates (custom block components not fitting general categories)
 * are noted in their respective files if applicable.
 */
export type MarkdownProps = {
    content: string;
    className?: string;
    pluginInfo?: SimplePluginInfo;
} & Pick<ReactMarkdownWrapperProps, 'customComponents' | 'customDisallowedElements'>;
export declare const Markdown: (props: MarkdownProps) => any;
