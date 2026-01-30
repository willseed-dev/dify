"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommandRegistry = exports.SlashCommandRegistry = void 0;
/**
 * Slash Command Registry System
 * Responsible for managing registration, lookup, and search of all slash commands
 */
class SlashCommandRegistry {
    constructor() {
        this.commands = new Map();
        this.commandDeps = new Map();
    }
    /**
     * Register command handler
     */
    register(handler, deps) {
        // Register main command name
        this.commands.set(handler.name, handler);
        // Register aliases
        if (handler.aliases) {
            handler.aliases.forEach((alias) => {
                this.commands.set(alias, handler);
            });
        }
        // Store dependencies and call registration method
        if (deps) {
            this.commandDeps.set(handler.name, deps);
            handler.register?.(deps);
        }
    }
    /**
     * Unregister command
     */
    unregister(name) {
        const handler = this.commands.get(name);
        if (handler) {
            // Call the command's unregister method
            handler.unregister?.();
            // Remove dependencies
            this.commandDeps.delete(handler.name);
            // Remove main command name
            this.commands.delete(handler.name);
            // Remove all aliases
            if (handler.aliases) {
                handler.aliases.forEach((alias) => {
                    this.commands.delete(alias);
                });
            }
        }
    }
    /**
     * Find command handler
     */
    findCommand(commandName) {
        return this.commands.get(commandName);
    }
    /**
     * Smart partial command matching
     * Prioritize alias matching, then match command name prefix
     */
    findBestPartialMatch(partialName) {
        const lowerPartial = partialName.toLowerCase();
        // First check if any alias starts with this
        const aliasMatch = this.findHandlerByAliasPrefix(lowerPartial);
        if (aliasMatch && this.isCommandAvailable(aliasMatch))
            return aliasMatch;
        // Then check if command name starts with this
        const nameMatch = this.findHandlerByNamePrefix(lowerPartial);
        return nameMatch && this.isCommandAvailable(nameMatch) ? nameMatch : undefined;
    }
    /**
     * Find handler by alias prefix
     */
    findHandlerByAliasPrefix(prefix) {
        for (const handler of this.getAllCommands()) {
            if (handler.aliases?.some(alias => alias.toLowerCase().startsWith(prefix)))
                return handler;
        }
        return undefined;
    }
    /**
     * Find handler by name prefix
     */
    findHandlerByNamePrefix(prefix) {
        return this.getAllCommands().find(handler => handler.name.toLowerCase().startsWith(prefix));
    }
    /**
     * Get all registered commands (deduplicated)
     */
    getAllCommands() {
        const uniqueCommands = new Map();
        this.commands.forEach((handler) => {
            uniqueCommands.set(handler.name, handler);
        });
        return Array.from(uniqueCommands.values());
    }
    /**
     * Get all available commands in current context (deduplicated and filtered)
     * Commands without isAvailable method are considered always available
     */
    getAvailableCommands() {
        return this.getAllCommands().filter(handler => this.isCommandAvailable(handler));
    }
    /**
     * Search commands
     * @param query Full query (e.g., "/theme dark" or "/lang en")
     * @param locale Current language
     */
    async search(query, locale = 'en') {
        const trimmed = query.trim();
        // Handle root level search "/"
        if (trimmed === '/' || !trimmed.replace('/', '').trim())
            return await this.getRootCommands();
        // Parse command and arguments
        const afterSlash = trimmed.substring(1).trim();
        const spaceIndex = afterSlash.indexOf(' ');
        const commandName = spaceIndex === -1 ? afterSlash : afterSlash.substring(0, spaceIndex);
        const args = spaceIndex === -1 ? '' : afterSlash.substring(spaceIndex + 1).trim();
        // First try exact match
        let handler = this.findCommand(commandName);
        if (handler && this.isCommandAvailable(handler)) {
            try {
                return await handler.search(args, locale);
            }
            catch (error) {
                console.warn(`Command search failed for ${commandName}:`, error);
                return [];
            }
        }
        // If no exact match, try smart partial matching
        handler = this.findBestPartialMatch(commandName);
        if (handler && this.isCommandAvailable(handler)) {
            try {
                return await handler.search(args, locale);
            }
            catch (error) {
                console.warn(`Command search failed for ${handler.name}:`, error);
                return [];
            }
        }
        // Finally perform fuzzy search
        return this.fuzzySearchCommands(afterSlash);
    }
    /**
     * Get root level command list
     * Only shows commands that are available in current context
     */
    async getRootCommands() {
        return this.getAvailableCommands().map(handler => ({
            id: `root-${handler.name}`,
            title: `/${handler.name}`,
            description: handler.description,
            type: 'command',
            data: {
                command: `root.${handler.name}`,
                args: { name: handler.name },
            },
        }));
    }
    /**
     * Fuzzy search commands
     * Only shows commands that are available in current context
     */
    fuzzySearchCommands(query) {
        const lowercaseQuery = query.toLowerCase();
        const matches = [];
        for (const handler of this.getAvailableCommands()) {
            // Check if command name matches
            if (handler.name.toLowerCase().includes(lowercaseQuery)) {
                matches.push({
                    id: `fuzzy-${handler.name}`,
                    title: `/${handler.name}`,
                    description: handler.description,
                    type: 'command',
                    data: {
                        command: `root.${handler.name}`,
                        args: { name: handler.name },
                    },
                });
            }
            // Check if aliases match
            if (handler.aliases) {
                handler.aliases.forEach((alias) => {
                    if (alias.toLowerCase().includes(lowercaseQuery)) {
                        matches.push({
                            id: `fuzzy-${alias}`,
                            title: `/${alias}`,
                            description: `${handler.description} (alias for /${handler.name})`,
                            type: 'command',
                            data: {
                                command: `root.${handler.name}`,
                                args: { name: handler.name },
                            },
                        });
                    }
                });
            }
        }
        return matches;
    }
    /**
     * Get command dependencies
     */
    getCommandDependencies(commandName) {
        return this.commandDeps.get(commandName);
    }
    /**
     * Determine if a command is available in the current context.
     * Defaults to true when a handler does not implement the guard.
     */
    isCommandAvailable(handler) {
        return handler.isAvailable?.() ?? true;
    }
}
exports.SlashCommandRegistry = SlashCommandRegistry;
// Global registry instance
exports.slashCommandRegistry = new SlashCommandRegistry();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQTs7O0dBR0c7QUFDSCxNQUFhLG9CQUFvQjtJQUFqQztRQUNVLGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBK0IsQ0FBQTtRQUNqRCxnQkFBVyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUE7SUF3TzlDLENBQUM7SUF0T0M7O09BRUc7SUFDSCxRQUFRLENBQWMsT0FBbUMsRUFBRSxJQUFZO1FBQ3JFLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRXhDLG1CQUFtQjtRQUNuQixJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsa0RBQWtEO1FBQ2xELElBQUksSUFBSSxFQUFFLENBQUM7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ3hDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsVUFBVSxDQUFDLElBQVk7UUFDckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkMsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNaLHVDQUF1QztZQUN2QyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQTtZQUV0Qixz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SUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUU7NkJBQzdCO3lCQUNGLENBQUMsQ0FBQTtvQkFDSixDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxzQkFBc0IsQ0FBQyxXQUFtQjtRQUN4QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFFRDs7O09BR0c7SUFDSyxrQkFBa0IsQ0FBQyxPQUE0QjtRQUNyRCxPQUFPLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLElBQUksQ0FBQTtJQUN4QyxDQUFDO0NBQ0Y7QUExT0Qsb0RBME9DO0FBRUQsMkJBQTJCO0FBQ2QsUUFBQSxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbW1hbmRTZWFyY2hSZXN1bHQgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG5cbi8qKlxuICogU2xhc2ggQ29tbWFuZCBSZWdpc3RyeSBTeXN0ZW1cbiAqIFJlc3BvbnNpYmxlIGZvciBtYW5hZ2luZyByZWdpc3RyYXRpb24sIGxvb2t1cCwgYW5kIHNlYXJjaCBvZiBhbGwgc2xhc2ggY29tbWFuZHNcbiAqL1xuZXhwb3J0IGNsYXNzIFNsYXNoQ29tbWFuZFJlZ2lzdHJ5IHtcbiAgcHJpdmF0ZSBjb21tYW5kcyA9IG5ldyBNYXA8c3RyaW5nLCBTbGFzaENvbW1hbmRIYW5kbGVyPigpXG4gIHByaXZhdGUgY29tbWFuZERlcHMgPSBuZXcgTWFwPHN0cmluZywgYW55PigpXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGNvbW1hbmQgaGFuZGxlclxuICAgKi9cbiAgcmVnaXN0ZXI8VERlcHMgPSBhbnk+KGhhbmRsZXI6IFNsYXNoQ29tbWFuZEhhbmRsZXI8VERlcHM+LCBkZXBzPzogVERlcHMpIHtcbiAgICAvLyBSZWdpc3RlciBtYWluIGNvbW1hbmQgbmFtZVxuICAgIHRoaXMuY29tbWFuZHMuc2V0KGhhbmRsZXIubmFtZSwgaGFuZGxlcilcblxuICAgIC8vIFJlZ2lzdGVyIGFsaWFzZXNcbiAgICBpZiAoaGFuZGxlci5hbGlhc2VzKSB7XG4gICAgICBoYW5kbGVyLmFsaWFzZXMuZm9yRWFjaCgoYWxpYXMpID0+IHtcbiAgICAgICAgdGhpcy5jb21tYW5kcy5zZXQoYWxpYXMsIGhhbmRsZXIpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIFN0b3JlIGRlcGVuZGVuY2llcyBhbmQgY2FsbCByZWdpc3RyYXRpb24gbWV0aG9kXG4gICAgaWYgKGRlcHMpIHtcbiAgICAgIHRoaXMuY29tbWFuZERlcHMuc2V0KGhhbmRsZXIubmFtZSwgZGVwcylcbiAgICAgIGhhbmRsZXIucmVnaXN0ZXI/LihkZXBzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbnJlZ2lzdGVyIGNvbW1hbmRcbiAgICovXG4gIHVucmVnaXN0ZXIobmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuY29tbWFuZHMuZ2V0KG5hbWUpXG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIC8vIENhbGwgdGhlIGNvbW1hbmQncyB1bnJlZ2lzdGVyIG1ldGhvZFxuICAgICAgaGFuZGxlci51bnJlZ2lzdGVyPy4oKVxuXG4gICAgICAvLyBSZW1vdmUgZGVwZW5kZW5jaWVzXG4gICAgICB0aGlzLmNvbW1hbmREZXBzLmRlbGV0ZShoYW5kbGVyLm5hbWUpXG5cbiAgICAgIC8vIFJlbW92ZSBtYWluIGNvbW1hbmQgbmFtZVxuICAgICAgdGhpcy5jb21tYW5kcy5kZWxldGUoaGFuZGxlci5uYW1lKVxuXG4gICAgICAvLyBSZW1vdmUgYWxsIGFsaWFzZXNcbiAgICAgIGlmIChoYW5kbGVyLmFsaWFzZXMpIHtcbiAgICAgICAgaGFuZGxlci5hbGlhc2VzLmZvckVhY2goKGFsaWFzKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb21tYW5kcy5kZWxldGUoYWxpYXMpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgY29tbWFuZCBoYW5kbGVyXG4gICAqL1xuICBmaW5kQ29tbWFuZChjb21tYW5kTmFtZTogc3RyaW5nKTogU2xhc2hDb21tYW5kSGFuZGxlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZHMuZ2V0KGNvbW1hbmROYW1lKVxuICB9XG5cbiAgLyoqXG4gICAqIFNtYXJ0IHBhcnRpYWwgY29tbWFuZCBtYXRjaGluZ1xuICAgKiBQcmlvcml0aXplIGFsaWFzIG1hdGNoaW5nLCB0aGVuIG1hdGNoIGNvbW1hbmQgbmFtZSBwcmVmaXhcbiAgICovXG4gIHByaXZhdGUgZmluZEJlc3RQYXJ0aWFsTWF0Y2gocGFydGlhbE5hbWU6IHN0cmluZyk6IFNsYXNoQ29tbWFuZEhhbmRsZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGxvd2VyUGFydGlhbCA9IHBhcnRpYWxOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgIC8vIEZpcnN0IGNoZWNrIGlmIGFueSBhbGlhcyBzdGFydHMgd2l0aCB0aGlzXG4gICAgY29uc3QgYWxpYXNNYXRjaCA9IHRoaXMuZmluZEhhbmRsZXJCeUFsaWFzUHJlZml4KGxvd2VyUGFydGlhbClcbiAgICBpZiAoYWxpYXNNYXRjaCAmJiB0aGlzLmlzQ29tbWFuZEF2YWlsYWJsZShhbGlhc01hdGNoKSlcbiAgICAgIHJldHVybiBhbGlhc01hdGNoXG5cbiAgICAvLyBUaGVuIGNoZWNrIGlmIGNvbW1hbmQgbmFtZSBzdGFydHMgd2l0aCB0aGlzXG4gICAgY29uc3QgbmFtZU1hdGNoID0gdGhpcy5maW5kSGFuZGxlckJ5TmFtZVByZWZpeChsb3dlclBhcnRpYWwpXG4gICAgcmV0dXJuIG5hbWVNYXRjaCAmJiB0aGlzLmlzQ29tbWFuZEF2YWlsYWJsZShuYW1lTWF0Y2gpID8gbmFtZU1hdGNoIDogdW5kZWZpbmVkXG4gIH1cblxuICAvKipcbiAgICogRmluZCBoYW5kbGVyIGJ5IGFsaWFzIHByZWZpeFxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kSGFuZGxlckJ5QWxpYXNQcmVmaXgocHJlZml4OiBzdHJpbmcpOiBTbGFzaENvbW1hbmRIYW5kbGVyIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5nZXRBbGxDb21tYW5kcygpKSB7XG4gICAgICBpZiAoaGFuZGxlci5hbGlhc2VzPy5zb21lKGFsaWFzID0+IGFsaWFzLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChwcmVmaXgpKSlcbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgaGFuZGxlciBieSBuYW1lIHByZWZpeFxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kSGFuZGxlckJ5TmFtZVByZWZpeChwcmVmaXg6IHN0cmluZyk6IFNsYXNoQ29tbWFuZEhhbmRsZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmdldEFsbENvbW1hbmRzKCkuZmluZChoYW5kbGVyID0+XG4gICAgICBoYW5kbGVyLm5hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHByZWZpeCksXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgcmVnaXN0ZXJlZCBjb21tYW5kcyAoZGVkdXBsaWNhdGVkKVxuICAgKi9cbiAgZ2V0QWxsQ29tbWFuZHMoKTogU2xhc2hDb21tYW5kSGFuZGxlcltdIHtcbiAgICBjb25zdCB1bmlxdWVDb21tYW5kcyA9IG5ldyBNYXA8c3RyaW5nLCBTbGFzaENvbW1hbmRIYW5kbGVyPigpXG4gICAgdGhpcy5jb21tYW5kcy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICB1bmlxdWVDb21tYW5kcy5zZXQoaGFuZGxlci5uYW1lLCBoYW5kbGVyKVxuICAgIH0pXG4gICAgcmV0dXJuIEFycmF5LmZyb20odW5pcXVlQ29tbWFuZHMudmFsdWVzKCkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBhdmFpbGFibGUgY29tbWFuZHMgaW4gY3VycmVudCBjb250ZXh0IChkZWR1cGxpY2F0ZWQgYW5kIGZpbHRlcmVkKVxuICAgKiBDb21tYW5kcyB3aXRob3V0IGlzQXZhaWxhYmxlIG1ldGhvZCBhcmUgY29uc2lkZXJlZCBhbHdheXMgYXZhaWxhYmxlXG4gICAqL1xuICBnZXRBdmFpbGFibGVDb21tYW5kcygpOiBTbGFzaENvbW1hbmRIYW5kbGVyW10ge1xuICAgIHJldHVybiB0aGlzLmdldEFsbENvbW1hbmRzKCkuZmlsdGVyKGhhbmRsZXIgPT4gdGhpcy5pc0NvbW1hbmRBdmFpbGFibGUoaGFuZGxlcikpXG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIGNvbW1hbmRzXG4gICAqIEBwYXJhbSBxdWVyeSBGdWxsIHF1ZXJ5IChlLmcuLCBcIi90aGVtZSBkYXJrXCIgb3IgXCIvbGFuZyBlblwiKVxuICAgKiBAcGFyYW0gbG9jYWxlIEN1cnJlbnQgbGFuZ3VhZ2VcbiAgICovXG4gIGFzeW5jIHNlYXJjaChxdWVyeTogc3RyaW5nLCBsb2NhbGU6IHN0cmluZyA9ICdlbicpOiBQcm9taXNlPENvbW1hbmRTZWFyY2hSZXN1bHRbXT4ge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBxdWVyeS50cmltKClcblxuICAgIC8vIEhhbmRsZSByb290IGxldmVsIHNlYXJjaCBcIi9cIlxuICAgIGlmICh0cmltbWVkID09PSAnLycgfHwgIXRyaW1tZWQucmVwbGFjZSgnLycsICcnKS50cmltKCkpXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRSb290Q29tbWFuZHMoKVxuXG4gICAgLy8gUGFyc2UgY29tbWFuZCBhbmQgYXJndW1lbnRzXG4gICAgY29uc3QgYWZ0ZXJTbGFzaCA9IHRyaW1tZWQuc3Vic3RyaW5nKDEpLnRyaW0oKVxuICAgIGNvbnN0IHNwYWNlSW5kZXggPSBhZnRlclNsYXNoLmluZGV4T2YoJyAnKVxuICAgIGNvbnN0IGNvbW1hbmROYW1lID0gc3BhY2VJbmRleCA9PT0gLTEgPyBhZnRlclNsYXNoIDogYWZ0ZXJTbGFzaC5zdWJzdHJpbmcoMCwgc3BhY2VJbmRleClcbiAgICBjb25zdCBhcmdzID0gc3BhY2VJbmRleCA9PT0gLTEgPyAnJyA6IGFmdGVyU2xhc2guc3Vic3RyaW5nKHNwYWNlSW5kZXggKyAxKS50cmltKClcblxuICAgIC8vIEZpcnN0IHRyeSBleGFjdCBtYXRjaFxuICAgIGxldCBoYW5kbGVyID0gdGhpcy5maW5kQ29tbWFuZChjb21tYW5kTmFtZSlcbiAgICBpZiAoaGFuZGxlciAmJiB0aGlzLmlzQ29tbWFuZEF2YWlsYWJsZShoYW5kbGVyKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZXIuc2VhcmNoKGFyZ3MsIGxvY2FsZSlcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYENvbW1hbmQgc2VhcmNoIGZhaWxlZCBmb3IgJHtjb21tYW5kTmFtZX06YCwgZXJyb3IpXG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG5vIGV4YWN0IG1hdGNoLCB0cnkgc21hcnQgcGFydGlhbCBtYXRjaGluZ1xuICAgIGhhbmRsZXIgPSB0aGlzLmZpbmRCZXN0UGFydGlhbE1hdGNoKGNvbW1hbmROYW1lKVxuICAgIGlmIChoYW5kbGVyICYmIHRoaXMuaXNDb21tYW5kQXZhaWxhYmxlKGhhbmRsZXIpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgaGFuZGxlci5zZWFyY2goYXJncywgbG9jYWxlKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ29tbWFuZCBzZWFyY2ggZmFpbGVkIGZvciAke2hhbmRsZXIubmFtZX06YCwgZXJyb3IpXG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZpbmFsbHkgcGVyZm9ybSBmdXp6eSBzZWFyY2hcbiAgICByZXR1cm4gdGhpcy5mdXp6eVNlYXJjaENvbW1hbmRzKGFmdGVyU2xhc2gpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHJvb3QgbGV2ZWwgY29tbWFuZCBsaXN0XG4gICAqIE9ubHkgc2hvd3MgY29tbWFuZHMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIGN1cnJlbnQgY29udGV4dFxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBnZXRSb290Q29tbWFuZHMoKTogUHJvbWlzZTxDb21tYW5kU2VhcmNoUmVzdWx0W10+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdmFpbGFibGVDb21tYW5kcygpLm1hcChoYW5kbGVyID0+ICh7XG4gICAgICBpZDogYHJvb3QtJHtoYW5kbGVyLm5hbWV9YCxcbiAgICAgIHRpdGxlOiBgLyR7aGFuZGxlci5uYW1lfWAsXG4gICAgICBkZXNjcmlwdGlvbjogaGFuZGxlci5kZXNjcmlwdGlvbixcbiAgICAgIHR5cGU6ICdjb21tYW5kJyBhcyBjb25zdCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgY29tbWFuZDogYHJvb3QuJHtoYW5kbGVyLm5hbWV9YCxcbiAgICAgICAgYXJnczogeyBuYW1lOiBoYW5kbGVyLm5hbWUgfSxcbiAgICAgIH0sXG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogRnV6enkgc2VhcmNoIGNvbW1hbmRzXG4gICAqIE9ubHkgc2hvd3MgY29tbWFuZHMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIGN1cnJlbnQgY29udGV4dFxuICAgKi9cbiAgcHJpdmF0ZSBmdXp6eVNlYXJjaENvbW1hbmRzKHF1ZXJ5OiBzdHJpbmcpOiBDb21tYW5kU2VhcmNoUmVzdWx0W10ge1xuICAgIGNvbnN0IGxvd2VyY2FzZVF1ZXJ5ID0gcXVlcnkudG9Mb3dlckNhc2UoKVxuICAgIGNvbnN0IG1hdGNoZXM6IENvbW1hbmRTZWFyY2hSZXN1bHRbXSA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5nZXRBdmFpbGFibGVDb21tYW5kcygpKSB7XG4gICAgICAvLyBDaGVjayBpZiBjb21tYW5kIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGhhbmRsZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGxvd2VyY2FzZVF1ZXJ5KSkge1xuICAgICAgICBtYXRjaGVzLnB1c2goe1xuICAgICAgICAgIGlkOiBgZnV6enktJHtoYW5kbGVyLm5hbWV9YCxcbiAgICAgICAgICB0aXRsZTogYC8ke2hhbmRsZXIubmFtZX1gLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBoYW5kbGVyLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIHR5cGU6ICdjb21tYW5kJyBhcyBjb25zdCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb21tYW5kOiBgcm9vdC4ke2hhbmRsZXIubmFtZX1gLFxuICAgICAgICAgICAgYXJnczogeyBuYW1lOiBoYW5kbGVyLm5hbWUgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiBhbGlhc2VzIG1hdGNoXG4gICAgICBpZiAoaGFuZGxlci5hbGlhc2VzKSB7XG4gICAgICAgIGhhbmRsZXIuYWxpYXNlcy5mb3JFYWNoKChhbGlhcykgPT4ge1xuICAgICAgICAgIGlmIChhbGlhcy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGxvd2VyY2FzZVF1ZXJ5KSkge1xuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKHtcbiAgICAgICAgICAgICAgaWQ6IGBmdXp6eS0ke2FsaWFzfWAsXG4gICAgICAgICAgICAgIHRpdGxlOiBgLyR7YWxpYXN9YCxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGAke2hhbmRsZXIuZGVzY3JpcHRpb259IChhbGlhcyBmb3IgLyR7aGFuZGxlci5uYW1lfSlgLFxuICAgICAgICAgICAgICB0eXBlOiAnY29tbWFuZCcgYXMgY29uc3QsXG4gICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBgcm9vdC4ke2hhbmRsZXIubmFtZX1gLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgbmFtZTogaGFuZGxlci5uYW1lIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjb21tYW5kIGRlcGVuZGVuY2llc1xuICAgKi9cbiAgZ2V0Q29tbWFuZERlcGVuZGVuY2llcyhjb21tYW5kTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb21tYW5kRGVwcy5nZXQoY29tbWFuZE5hbWUpXG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIGlmIGEgY29tbWFuZCBpcyBhdmFpbGFibGUgaW4gdGhlIGN1cnJlbnQgY29udGV4dC5cbiAgICogRGVmYXVsdHMgdG8gdHJ1ZSB3aGVuIGEgaGFuZGxlciBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlIGd1YXJkLlxuICAgKi9cbiAgcHJpdmF0ZSBpc0NvbW1hbmRBdmFpbGFibGUoaGFuZGxlcjogU2xhc2hDb21tYW5kSGFuZGxlcikge1xuICAgIHJldHVybiBoYW5kbGVyLmlzQXZhaWxhYmxlPy4oKSA/PyB0cnVlXG4gIH1cbn1cblxuLy8gR2xvYmFsIHJlZ2lzdHJ5IGluc3RhbmNlXG5leHBvcnQgY29uc3Qgc2xhc2hDb21tYW5kUmVnaXN0cnkgPSBuZXcgU2xhc2hDb21tYW5kUmVnaXN0cnkoKVxuIl19