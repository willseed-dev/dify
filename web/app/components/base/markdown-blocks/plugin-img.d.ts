import type { SimplePluginInfo } from '../markdown/react-markdown-wrapper';
/**
 * @fileoverview Img component for rendering <img> tags in Markdown.
 * Extracted from the main markdown renderer for modularity.
 * Uses the ImageGallery component to display images.
 */
import * as React from 'react';
type ImgProps = {
    src: string;
    pluginInfo?: SimplePluginInfo;
};
export declare const PluginImg: React.FC<ImgProps>;
export {};
