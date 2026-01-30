import type { SlashCommandHandler } from './types';
type AccountDeps = Record<string, never>;
/**
 * Account command - Navigates to account page
 */
export declare const accountCommand: SlashCommandHandler<AccountDeps>;
export {};
