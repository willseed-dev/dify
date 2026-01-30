import type { SlashCommandHandler } from './types';
type ZenDeps = Record<string, never>;
export declare const ZEN_TOGGLE_EVENT = "zen-toggle-maximize";
/**
 * Zen command - Toggle canvas maximize (focus mode) in workflow pages
 * Only available in workflow and chatflow pages
 */
export declare const zenCommand: SlashCommandHandler<ZenDeps>;
export {};
