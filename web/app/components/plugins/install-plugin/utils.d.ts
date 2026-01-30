import type { Plugin, PluginDeclaration, PluginManifestInMarket } from '../types';
import type { GitHubUrlInfo } from '@/app/components/plugins/types';
export declare const pluginManifestToCardPluginProps: (pluginManifest: PluginDeclaration) => Plugin;
export declare const pluginManifestInMarketToPluginProps: (pluginManifest: PluginManifestInMarket) => Plugin;
export declare const parseGitHubUrl: (url: string) => GitHubUrlInfo;
export declare const convertRepoToUrl: (repo: string) => string;
