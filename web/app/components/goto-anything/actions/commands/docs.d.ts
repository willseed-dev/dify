import type { SlashCommandHandler } from './types';
type DocDeps = Record<string, never>;
/**
 * Documentation command - Opens help documentation
 */
export declare const docsCommand: SlashCommandHandler<DocDeps>;
export {};
