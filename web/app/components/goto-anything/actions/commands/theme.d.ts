import type { SlashCommandHandler } from './types';
type ThemeDeps = {
    setTheme?: (value: 'light' | 'dark' | 'system') => void;
};
/**
 * Theme command handler
 * Integrates UI building, search, and registration logic
 */
export declare const themeCommand: SlashCommandHandler<ThemeDeps>;
export {};
