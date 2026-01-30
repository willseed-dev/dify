import type { SlashCommandHandler } from './types';
type LanguageDeps = {
    setLocale?: (locale: string) => Promise<void>;
};
/**
 * Language command handler
 * Integrates UI building, search, and registration logic
 */
export declare const languageCommand: SlashCommandHandler<LanguageDeps>;
export {};
