import type { CommandSearchResult } from '../types';
import type { SlashCommandHandler } from './types';
/**
 * Slash Command Registry System
 * Responsible for managing registration, lookup, and search of all slash commands
 */
export declare class SlashCommandRegistry {
    private commands;
    private commandDeps;
    /**
     * Register command handler
     */
    register<TDeps = any>(handler: SlashCommandHandler<TDeps>, deps?: TDeps): void;
    /**
     * Unregister command
     */
    unregister(name: string): void;
    /**
     * Find command handler
     */
    findCommand(commandName: string): SlashCommandHandler | undefined;
    /**
     * Smart partial command matching
     * Prioritize alias matching, then match command name prefix
     */
    private findBestPartialMatch;
    /**
     * Find handler by alias prefix
     */
    private findHandlerByAliasPrefix;
    /**
     * Find handler by name prefix
     */
    private findHandlerByNamePrefix;
    /**
     * Get all registered commands (deduplicated)
     */
    getAllCommands(): SlashCommandHandler[];
    /**
     * Get all available commands in current context (deduplicated and filtered)
     * Commands without isAvailable method are considered always available
     */
    getAvailableCommands(): SlashCommandHandler[];
    /**
     * Search commands
     * @param query Full query (e.g., "/theme dark" or "/lang en")
     * @param locale Current language
     */
    search(query: string, locale?: string): Promise<CommandSearchResult[]>;
    /**
     * Get root level command list
     * Only shows commands that are available in current context
     */
    private getRootCommands;
    /**
     * Fuzzy search commands
     * Only shows commands that are available in current context
     */
    private fuzzySearchCommands;
    /**
     * Get command dependencies
     */
    getCommandDependencies(commandName: string): any;
    /**
     * Determine if a command is available in the current context.
     * Defaults to true when a handler does not implement the guard.
     */
    private isCommandAvailable;
}
export declare const slashCommandRegistry: SlashCommandRegistry;
