"use strict";
/**
 * Goto Anything - Action System
 *
 * This file defines the action registry for the goto-anything search system.
 * Actions handle different types of searches: apps, knowledge bases, plugins, workflow nodes, and commands.
 *
 * ## How to Add a New Slash Command
 *
 * 1. **Create Command Handler File** (in `./commands/` directory):
 *    ```typescript
 *    // commands/my-command.ts
 *    import type { SlashCommandHandler } from './types'
 *    import type { CommandSearchResult } from '../types'
 *    import { registerCommands, unregisterCommands } from './command-bus'
 *
 *    interface MyCommandDeps {
 *      myService?: (data: any) => Promise<void>
 *    }
 *
 *    export const myCommand: SlashCommandHandler<MyCommandDeps> = {
 *      name: 'mycommand',
 *      aliases: ['mc'], // Optional aliases
 *      description: 'My custom command description',
 *
 *      async search(args: string, locale: string = 'en') {
 *        // Return search results based on args
 *        return [{
 *          id: 'my-result',
 *          title: 'My Command Result',
 *          description: 'Description of the result',
 *          type: 'command' as const,
 *          data: { command: 'my.action', args: { value: args } }
 *        }]
 *      },
 *
 *      register(deps: MyCommandDeps) {
 *        registerCommands({
 *          'my.action': async (args) => {
 *            await deps.myService?.(args?.value)
 *          }
 *        })
 *      },
 *
 *      unregister() {
 *        unregisterCommands(['my.action'])
 *      }
 *    }
 *    ```
 *
 * **Example for Self-Contained Command (no external dependencies):**
 *    ```typescript
 *    // commands/calculator-command.ts
 *    export const calculatorCommand: SlashCommandHandler = {
 *      name: 'calc',
 *      aliases: ['calculator'],
 *      description: 'Simple calculator',
 *
 *      async search(args: string) {
 *        if (!args.trim()) return []
 *        try {
 *          // Safe math evaluation (implement proper parser in real use)
 *          const result = Function('"use strict"; return (' + args + ')')()
 *          return [{
 *            id: 'calc-result',
 *            title: `${args} = ${result}`,
 *            description: 'Calculator result',
 *            type: 'command' as const,
 *            data: { command: 'calc.copy', args: { result: result.toString() } }
 *          }]
 *        } catch {
 *          return [{
 *            id: 'calc-error',
 *            title: 'Invalid expression',
 *            description: 'Please enter a valid math expression',
 *            type: 'command' as const,
 *            data: { command: 'calc.noop', args: {} }
 *          }]
 *        }
 *      },
 *
 *      register() {
 *        registerCommands({
 *          'calc.copy': (args) => navigator.clipboard.writeText(args.result),
 *          'calc.noop': () => {} // No operation
 *        })
 *      },
 *
 *      unregister() {
 *        unregisterCommands(['calc.copy', 'calc.noop'])
 *      }
 *    }
 *    ```
 *
 * 2. **Register Command** (in `./commands/slash.tsx`):
 *    ```typescript
 *    import { myCommand } from './my-command'
 *    import { calculatorCommand } from './calculator-command' // For self-contained commands
 *
 *    export const registerSlashCommands = (deps: Record<string, any>) => {
 *      slashCommandRegistry.register(themeCommand, { setTheme: deps.setTheme })
 *      slashCommandRegistry.register(languageCommand, { setLocale: deps.setLocale })
 *      slashCommandRegistry.register(myCommand, { myService: deps.myService }) // With dependencies
 *      slashCommandRegistry.register(calculatorCommand) // Self-contained, no dependencies
 *    }
 *
 *    export const unregisterSlashCommands = () => {
 *      slashCommandRegistry.unregister('theme')
 *      slashCommandRegistry.unregister('language')
 *      slashCommandRegistry.unregister('mycommand')
 *      slashCommandRegistry.unregister('calc') // Add this line
 *    }
 *    ```
 *
 *
 * 3. **Update SlashCommandProvider** (in `./commands/slash.tsx`):
 *    ```typescript
 *    export const SlashCommandProvider = () => {
 *      const theme = useTheme()
 *      const myService = useMyService() // Add external dependency if needed
 *
 *      useEffect(() => {
 *        registerSlashCommands({
 *          setTheme: theme.setTheme,          // Required for theme command
 *          setLocale: setLocaleOnClient,      // Required for language command
 *          myService: myService,              // Required for your custom command
 *          // Note: calculatorCommand doesn't need dependencies, so not listed here
 *        })
 *        return () => unregisterSlashCommands()
 *      }, [theme.setTheme, myService]) // Update dependency array for all dynamic deps
 *
 *      return null
 *    }
 *    ```
 *
 *    **Note:** Self-contained commands (like calculator) don't require dependencies but are
 *    still registered through the same system for consistent lifecycle management.
 *
 * 4. **Usage**: Users can now type `/mycommand` or `/mc` to use your command
 *
 * ## Command System Architecture
 * - Commands are registered via `SlashCommandRegistry`
 * - Each command is self-contained with its own dependencies
 * - Commands support aliases for easier access
 * - Command execution is handled by the command bus system
 * - All commands should be registered through `SlashCommandProvider` for consistent lifecycle management
 *
 * ## Command Types
 * **Commands with External Dependencies:**
 * - Require external services, APIs, or React hooks
 * - Must provide dependencies in `SlashCommandProvider`
 * - Example: theme commands (needs useTheme), API commands (needs service)
 *
 * **Self-Contained Commands:**
 * - Pure logic operations, no external dependencies
 * - Still recommended to register through `SlashCommandProvider` for consistency
 * - Example: calculator, text manipulation commands
 *
 * ## Available Actions
 * - `@app` - Search applications
 * - `@knowledge` / `@kb` - Search knowledge bases
 * - `@plugin` - Search plugins
 * - `@node` - Search workflow nodes (workflow pages only)
 * - `/` - Execute slash commands (theme, language, etc.)
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowNodesAction = exports.pluginAction = exports.knowledgeAction = exports.appAction = exports.matchAction = exports.searchAnything = exports.Actions = exports.createActions = void 0;
const app_1 = require("./app");
Object.defineProperty(exports, "appAction", { enumerable: true, get: function () { return app_1.appAction; } });
const commands_1 = require("./commands");
const registry_1 = require("./commands/registry");
const knowledge_1 = require("./knowledge");
Object.defineProperty(exports, "knowledgeAction", { enumerable: true, get: function () { return knowledge_1.knowledgeAction; } });
const plugin_1 = require("./plugin");
Object.defineProperty(exports, "pluginAction", { enumerable: true, get: function () { return plugin_1.pluginAction; } });
const rag_pipeline_nodes_1 = require("./rag-pipeline-nodes");
const workflow_nodes_1 = require("./workflow-nodes");
Object.defineProperty(exports, "workflowNodesAction", { enumerable: true, get: function () { return workflow_nodes_1.workflowNodesAction; } });
// Create dynamic Actions based on context
const createActions = (isWorkflowPage, isRagPipelinePage) => {
    const baseActions = {
        slash: commands_1.slashAction,
        app: app_1.appAction,
        knowledge: knowledge_1.knowledgeAction,
        plugin: plugin_1.pluginAction,
    };
    // Add appropriate node search based on context
    if (isRagPipelinePage) {
        return {
            ...baseActions,
            node: rag_pipeline_nodes_1.ragPipelineNodesAction,
        };
    }
    else if (isWorkflowPage) {
        return {
            ...baseActions,
            node: workflow_nodes_1.workflowNodesAction,
        };
    }
    // Default actions without node search
    return baseActions;
};
exports.createActions = createActions;
// Legacy export for backward compatibility
exports.Actions = {
    slash: commands_1.slashAction,
    app: app_1.appAction,
    knowledge: knowledge_1.knowledgeAction,
    plugin: plugin_1.pluginAction,
    node: workflow_nodes_1.workflowNodesAction,
};
const searchAnything = async (locale, query, actionItem, dynamicActions) => {
    const trimmedQuery = query.trim();
    if (actionItem) {
        const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixPattern = new RegExp(`^(${escapeRegExp(actionItem.key)}|${escapeRegExp(actionItem.shortcut)})\\s*`);
        const searchTerm = trimmedQuery.replace(prefixPattern, '').trim();
        try {
            return await actionItem.search(query, searchTerm, locale);
        }
        catch (error) {
            console.warn(`Search failed for ${actionItem.key}:`, error);
            return [];
        }
    }
    if (trimmedQuery.startsWith('@') || trimmedQuery.startsWith('/'))
        return [];
    const globalSearchActions = Object.values(dynamicActions || exports.Actions)
        // Exclude slash commands from general search results
        .filter(action => action.key !== '/');
    // Use Promise.allSettled to handle partial failures gracefully
    const searchPromises = globalSearchActions.map(async (action) => {
        try {
            const results = await action.search(query, query, locale);
            return { success: true, data: results, actionType: action.key };
        }
        catch (error) {
            console.warn(`Search failed for ${action.key}:`, error);
            return { success: false, data: [], actionType: action.key, error };
        }
    });
    const settledResults = await Promise.allSettled(searchPromises);
    const allResults = [];
    const failedActions = [];
    settledResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
            allResults.push(...result.value.data);
        }
        else {
            const actionKey = globalSearchActions[index]?.key || 'unknown';
            failedActions.push(actionKey);
        }
    });
    if (failedActions.length > 0)
        console.warn(`Some search actions failed: ${failedActions.join(', ')}`);
    return allResults;
};
exports.searchAnything = searchAnything;
const matchAction = (query, actions) => {
    return Object.values(actions).find((action) => {
        // Special handling for slash commands
        if (action.key === '/') {
            // Get all registered commands from the registry
            const allCommands = registry_1.slashCommandRegistry.getAllCommands();
            // Check if query matches any registered command
            return allCommands.some((cmd) => {
                const cmdPattern = `/${cmd.name}`;
                // For direct mode commands, don't match (keep in command selector)
                if (cmd.mode === 'direct')
                    return false;
                // For submenu mode commands, match when complete command is entered
                return query === cmdPattern || query.startsWith(`${cmdPattern} `);
            });
        }
        const reg = new RegExp(`^(${action.key}|${action.shortcut})(?:\\s|$)`);
        return reg.test(query);
    });
};
exports.matchAction = matchAction;
__exportStar(require("./commands"), exports);
__exportStar(require("./types"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtS0c7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0gsK0JBQWlDO0FBb0l4QiwwRkFwSUEsZUFBUyxPQW9JQTtBQW5JbEIseUNBQXdDO0FBQ3hDLGtEQUEwRDtBQUMxRCwyQ0FBNkM7QUFpSXpCLGdHQWpJWCwyQkFBZSxPQWlJVztBQWhJbkMscUNBQXVDO0FBZ0lGLDZGQWhJNUIscUJBQVksT0FnSTRCO0FBL0hqRCw2REFBNkQ7QUFDN0QscURBQXNEO0FBOEhILG9HQTlIMUMsb0NBQW1CLE9BOEgwQztBQTVIdEUsMENBQTBDO0FBQ25DLE1BQU0sYUFBYSxHQUFHLENBQUMsY0FBdUIsRUFBRSxpQkFBMEIsRUFBRSxFQUFFO0lBQ25GLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLEtBQUssRUFBRSxzQkFBVztRQUNsQixHQUFHLEVBQUUsZUFBUztRQUNkLFNBQVMsRUFBRSwyQkFBZTtRQUMxQixNQUFNLEVBQUUscUJBQVk7S0FDckIsQ0FBQTtJQUVELCtDQUErQztJQUMvQyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDdEIsT0FBTztZQUNMLEdBQUcsV0FBVztZQUNkLElBQUksRUFBRSwyQ0FBc0I7U0FDN0IsQ0FBQTtJQUNILENBQUM7U0FDSSxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLE9BQU87WUFDTCxHQUFHLFdBQVc7WUFDZCxJQUFJLEVBQUUsb0NBQW1CO1NBQzFCLENBQUE7SUFDSCxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLE9BQU8sV0FBVyxD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Q3ZCLE9BQU8sS0FBSyxDQUFBO2dCQUVkLG9FQUFvRTtnQkFDcEUsT0FBTyxLQUFLLEtBQUssVUFBVSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFBO1lBQ25FLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxZQUFZLENBQUMsQ0FBQTtRQUN0RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUF2QlksUUFBQSxXQUFXLGVBdUJ2QjtBQUVELDZDQUEwQjtBQUMxQiwwQ0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdvdG8gQW55dGhpbmcgLSBBY3Rpb24gU3lzdGVtXG4gKlxuICogVGhpcyBmaWxlIGRlZmluZXMgdGhlIGFjdGlvbiByZWdpc3RyeSBmb3IgdGhlIGdvdG8tYW55dGhpbmcgc2VhcmNoIHN5c3RlbS5cbiAqIEFjdGlvbnMgaGFuZGxlIGRpZmZlcmVudCB0eXBlcyBvZiBzZWFyY2hlczogYXBwcywga25vd2xlZGdlIGJhc2VzLCBwbHVnaW5zLCB3b3JrZmxvdyBub2RlcywgYW5kIGNvbW1hbmRzLlxuICpcbiAqICMjIEhvdyB0byBBZGQgYSBOZXcgU2xhc2ggQ29tbWFuZFxuICpcbiAqIDEuICoqQ3JlYXRlIENvbW1hbmQgSGFuZGxlciBGaWxlKiogKGluIGAuL2NvbW1hbmRzL2AgZGlyZWN0b3J5KTpcbiAqICAgIGBgYHR5cGVzY3JpcHRcbiAqICAgIC8vIGNvbW1hbmRzL215LWNvbW1hbmQudHNcbiAqICAgIGltcG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG4gKiAgICBpbXBvcnQgdHlwZSB7IENvbW1hbmRTZWFyY2hSZXN1bHQgfSBmcm9tICcuLi90eXBlcydcbiAqICAgIGltcG9ydCB7IHJlZ2lzdGVyQ29tbWFuZHMsIHVucmVnaXN0ZXJDb21tYW5kcyB9IGZyb20gJy4vY29tbWFuZC1idXMnXG4gKlxuICogICAgaW50ZXJmYWNlIE15Q29tbWFuZERlcHMge1xuICogICAgICBteVNlcnZpY2U/OiAoZGF0YTogYW55KSA9PiBQcm9taXNlPHZvaWQ+XG4gKiAgICB9XG4gKlxuICogICAgZXhwb3J0IGNvbnN0IG15Q29tbWFuZDogU2xhc2hDb21tYW5kSGFuZGxlcjxNeUNvbW1hbmREZXBzPiA9IHtcbiAqICAgICAgbmFtZTogJ215Y29tbWFuZCcsXG4gKiAgICAgIGFsaWFzZXM6IFsnbWMnXSwgLy8gT3B0aW9uYWwgYWxpYXNlc1xuICogICAgICBkZXNjcmlwdGlvbjogJ015IGN1c3RvbSBjb21tYW5kIGRlc2NyaXB0aW9uJyxcbiAqXG4gKiAgICAgIGFzeW5jIHNlYXJjaChhcmdzOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nID0gJ2VuJykge1xuICogICAgICAgIC8vIFJldHVybiBzZWFyY2ggcmVzdWx0cyBiYXNlZCBvbiBhcmdzXG4gKiAgICAgICAgcmV0dXJuIFt7XG4gKiAgICAgICAgICBpZDogJ215LXJlc3VsdCcsXG4gKiAgICAgICAgICB0aXRsZTogJ015IENvbW1hbmQgUmVzdWx0JyxcbiAqICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gb2YgdGhlIHJlc3VsdCcsXG4gKiAgICAgICAgICB0eXBlOiAnY29tbWFuZCcgYXMgY29uc3QsXG4gKiAgICAgICAgICBkYXRhOiB7IGNvbW1hbmQ6ICdteS5hY3Rpb24nLCBhcmdzOiB7IHZhbHVlOiBhcmdzIH0gfVxuICogICAgICAgIH1dXG4gKiAgICAgIH0sXG4gKlxuICogICAgICByZWdpc3RlcihkZXBzOiBNeUNvbW1hbmREZXBzKSB7XG4gKiAgICAgICAgcmVnaXN0ZXJDb21tYW5kcyh7XG4gKiAgICAgICAgICAnbXkuYWN0aW9uJzogYXN5bmMgKGFyZ3MpID0+IHtcbiAqICAgICAgICAgICAgYXdhaXQgZGVwcy5teVNlcnZpY2U/LihhcmdzPy52YWx1ZSlcbiAqICAgICAgICAgIH1cbiAqICAgICAgICB9KVxuICogICAgICB9LFxuICpcbiAqICAgICAgdW5yZWdpc3RlcigpIHtcbiAqICAgICAgICB1bnJlZ2lzdGVyQ29tbWFuZHMoWydteS5hY3Rpb24nXSlcbiAqICAgICAgfVxuICogICAgfVxuICogICAgYGBgXG4gKlxuICogKipFeGFtcGxlIGZvciBTZWxmLUNvbnRhaW5lZCBDb21tYW5kIChubyBleHRlcm5hbCBkZXBlbmRlbmNpZXMpOioqXG4gKiAgICBgYGB0eXBlc2NyaXB0XG4gKiAgICAvLyBjb21tYW5kcy9jYWxjdWxhdG9yLWNvbW1hbmQudHNcbiAqICAgIGV4cG9ydCBjb25zdCBjYWxjdWxhdG9yQ29tbWFuZDogU2xhc2hDb21tYW5kSGFuZGxlciA9IHtcbiAqICAgICAgbmFtZTogJ2NhbGMnLFxuICogICAgICBhbGlhc2VzOiBbJ2NhbGN1bGF0b3InXSxcbiAqICAgICAgZGVzY3JpcHRpb246ICdTaW1wbGUgY2FsY3VsYXRvcicsXG4gKlxuICogICAgICBhc3luYyBzZWFyY2goYXJnczogc3RyaW5nKSB7XG4gKiAgICAgICAgaWYgKCFhcmdzLnRyaW0oKSkgcmV0dXJuIFtdXG4gKiAgICAgICAgdHJ5IHtcbiAqICAgICAgICAgIC8vIFNhZmUgbWF0aCBldmFsdWF0aW9uIChpbXBsZW1lbnQgcHJvcGVyIHBhcnNlciBpbiByZWFsIHVzZSlcbiAqICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEZ1bmN0aW9uKCdcInVzZSBzdHJpY3RcIjsgcmV0dXJuICgnICsgYXJncyArICcpJykoKVxuICogICAgICAgICAgcmV0dXJuIFt7XG4gKiAgICAgICAgICAgIGlkOiAnY2FsYy1yZXN1bHQnLFxuICogICAgICAgICAgICB0aXRsZTogYCR7YXJnc30gPSAke3Jlc3VsdH1gLFxuICogICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NhbGN1bGF0b3IgcmVzdWx0JyxcbiAqICAgICAgICAgICAgdHlwZTogJ2NvbW1hbmQnIGFzIGNvbnN0LFxuICogICAgICAgICAgICBkYXRhOiB7IGNvbW1hbmQ6ICdjYWxjLmNvcHknLCBhcmdzOiB7IHJlc3VsdDogcmVzdWx0LnRvU3RyaW5nKCkgfSB9XG4gKiAgICAgICAgICB9XVxuICogICAgICAgIH0gY2F0Y2gge1xuICogICAgICAgICAgcmV0dXJuIFt7XG4gKiAgICAgICAgICAgIGlkOiAnY2FsYy1lcnJvcicsXG4gKiAgICAgICAgICAgIHRpdGxlOiAnSW52YWxpZCBleHByZXNzaW9uJyxcbiAqICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBtYXRoIGV4cHJlc3Npb24nLFxuICogICAgICAgICAgICB0eXBlOiAnY29tbWFuZCcgYXMgY29uc3QsXG4gKiAgICAgICAgICAgIGRhdGE6IHsgY29tbWFuZDogJ2NhbGMubm9vcCcsIGFyZ3M6IHt9IH1cbiAqICAgICAgICAgIH1dXG4gKiAgICAgICAgfVxuICogICAgICB9LFxuICpcbiAqICAgICAgcmVnaXN0ZXIoKSB7XG4gKiAgICAgICAgcmVnaXN0ZXJDb21tYW5kcyh7XG4gKiAgICAgICAgICAnY2FsYy5jb3B5JzogKGFyZ3MpID0+IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGFyZ3MucmVzdWx0KSxcbiAqICAgICAgICAgICdjYWxjLm5vb3AnOiAoKSA9PiB7fSAvLyBObyBvcGVyYXRpb25cbiAqICAgICAgICB9KVxuICogICAgICB9LFxuICpcbiAqICAgICAgdW5yZWdpc3RlcigpIHtcbiAqICAgICAgICB1bnJlZ2lzdGVyQ29tbWFuZHMoWydjYWxjLmNvcHknLCAnY2FsYy5ub29wJ10pXG4gKiAgICAgIH1cbiAqICAgIH1cbiAqICAgIGBgYFxuICpcbiAqIDIuICoqUmVnaXN0ZXIgQ29tbWFuZCoqIChpbiBgLi9jb21tYW5kcy9zbGFzaC50c3hgKTpcbiAqICAgIGBgYHR5cGVzY3JpcHRcbiAqICAgIGltcG9ydCB7IG15Q29tbWFuZCB9IGZyb20gJy4vbXktY29tbWFuZCdcbiAqICAgIGltcG9ydCB7IGNhbGN1bGF0b3JDb21tYW5kIH0gZnJvbSAnLi9jYWxjdWxhdG9yLWNvbW1hbmQnIC8vIEZvciBzZWxmLWNvbnRhaW5lZCBjb21tYW5kc1xuICpcbiAqICAgIGV4cG9ydCBjb25zdCByZWdpc3RlclNsYXNoQ29tbWFuZHMgPSAoZGVwczogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICogICAgICBzbGFzaENvbW1hbmRSZWdpc3RyeS5yZWdpc3Rlcih0aGVtZUNvbW1hbmQsIHsgc2V0VGhlbWU6IGRlcHMuc2V0VGhlbWUgfSlcbiAqICAgICAgc2xhc2hDb21tYW5kUmVnaXN0cnkucmVnaXN0ZXIobGFuZ3VhZ2VDb21tYW5kLCB7IHNldExvY2FsZTogZGVwcy5zZXRMb2NhbGUgfSlcbiAqICAgICAgc2xhc2hDb21tYW5kUmVnaXN0cnkucmVnaXN0ZXIobXlDb21tYW5kLCB7IG15U2VydmljZTogZGVwcy5teVNlcnZpY2UgfSkgLy8gV2l0aCBkZXBlbmRlbmNpZXNcbiAqICAgICAgc2xhc2hDb21tYW5kUmVnaXN0cnkucmVnaXN0ZXIoY2FsY3VsYXRvckNvbW1hbmQpIC8vIFNlbGYtY29udGFpbmVkLCBubyBkZXBlbmRlbmNpZXNcbiAqICAgIH1cbiAqXG4gKiAgICBleHBvcnQgY29uc3QgdW5yZWdpc3RlclNsYXNoQ29tbWFuZHMgPSAoKSA9PiB7XG4gKiAgICAgIHNsYXNoQ29tbWFuZFJlZ2lzdHJ5LnVucmVnaXN0ZXIoJ3RoZW1lJylcbiAqICAgICAgc2xhc2hDb21tYW5kUmVnaXN0cnkudW5yZWdpc3RlcignbGFuZ3VhZ2UnKVxuICogICAgICBzbGFzaENvbW1hbmRSZWdpc3RyeS51bnJlZ2lzdGVyKCdteWNvbW1hbmQnKVxuICogICAgICBzbGFzaENvbW1hbmRSZWdpc3RyeS51bnJlZ2lzdGVyKCdjYWxjJykgLy8gQWRkIHRoaXMgbGluZVxuICogICAgfVxuICogICAgYGBgXG4gKlxuICpcbiAqIDMuICoqVXBkYXRlIFNsYXNoQ29tbWFuZFByb3ZpZGVyKiogKGluIGAuL2NvbW1hbmRzL3NsYXNoLnRzeGApOlxuICogICAgYGBgdHlwZXNjcmlwdFxuICogICAgZXhwb3J0IGNvbnN0IFNsYXNoQ29tbWFuZFByb3ZpZGVyID0gKCkgPT4ge1xuICogICAgICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKClcbiAqICAgICAgY29uc3QgbXlTZXJ2aWNlID0gdXNlTXlTZXJ2aWNlKCkgLy8gQWRkIGV4dGVybmFsIGRlcGVuZGVuY3kgaWYgbmVlZGVkXG4gKlxuICogICAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICogICAgICAgIHJlZ2lzdGVyU2xhc2hDb21tYW5kcyh7XG4gKiAgICAgICAgICBzZXRUaGVtZTogdGhlbWUuc2V0VGhlbWUsICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciB0aGVtZSBjb21tYW5kXG4gKiAgICAgICAgICBzZXRMb2NhbGU6IHNldExvY2FsZU9uQ2xpZW50LCAgICAgIC8vIFJlcXVpcmVkIGZvciBsYW5ndWFnZSBjb21tYW5kXG4gKiAgICAgICAgICBteVNlcnZpY2U6IG15U2VydmljZSwgICAgICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciB5b3VyIGN1c3RvbSBjb21tYW5kXG4gKiAgICAgICAgICAvLyBOb3RlOiBjYWxjdWxhdG9yQ29tbWFuZCBkb2Vzbid0IG5lZWQgZGVwZW5kZW5jaWVzLCBzbyBub3QgbGlzdGVkIGhlcmVcbiAqICAgICAgICB9KVxuICogICAgICAgIHJldHVybiAoKSA9PiB1bnJlZ2lzdGVyU2xhc2hDb21tYW5kcygpXG4gKiAgICAgIH0sIFt0aGVtZS5zZXRUaGVtZSwgbXlTZXJ2aWNlXSkgLy8gVXBkYXRlIGRlcGVuZGVuY3kgYXJyYXkgZm9yIGFsbCBkeW5hbWljIGRlcHNcbiAqXG4gKiAgICAgIHJldHVybiBudWxsXG4gKiAgICB9XG4gKiAgICBgYGBcbiAqXG4gKiAgICAqKk5vdGU6KiogU2VsZi1jb250YWluZWQgY29tbWFuZHMgKGxpa2UgY2FsY3VsYXRvcikgZG9uJ3QgcmVxdWlyZSBkZXBlbmRlbmNpZXMgYnV0IGFyZVxuICogICAgc3RpbGwgcmVnaXN0ZXJlZCB0aHJvdWdoIHRoZSBzYW1lIHN5c3RlbSBmb3IgY29uc2lzdGVudCBsaWZlY3ljbGUgbWFuYWdlbWVudC5cbiAqXG4gKiA0LiAqKlVzYWdlKio6IFVzZXJzIGNhbiBub3cgdHlwZSBgL215Y29tbWFuZGAgb3IgYC9tY2AgdG8gdXNlIHlvdXIgY29tbWFuZFxuICpcbiAqICMjIENvbW1hbmQgU3lzdGVtIEFyY2hpdGVjdHVyZVxuICogLSBDb21tYW5kcyBhcmUgcmVnaXN0ZXJlZCB2aWEgYFNsYXNoQ29tbWFuZFJlZ2lzdHJ5YFxuICogLSBFYWNoIGNvbW1hbmQgaXMgc2VsZi1jb250YWluZWQgd2l0aCBpdHMgb3duIGRlcGVuZGVuY2llc1xuICogLSBDb21tYW5kcyBzdXBwb3J0IGFsaWFzZXMgZm9yIGVhc2llciBhY2Nlc3NcbiAqIC0gQ29tbWFuZCBleGVjdXRpb24gaXMgaGFuZGxlZCBieSB0aGUgY29tbWFuZCBidXMgc3lzdGVtXG4gKiAtIEFsbCBjb21tYW5kcyBzaG91bGQgYmUgcmVnaXN0ZXJlZCB0aHJvdWdoIGBTbGFzaENvbW1hbmRQcm92aWRlcmAgZm9yIGNvbnNpc3RlbnQgbGlmZWN5Y2xlIG1hbmFnZW1lbnRcbiAqXG4gKiAjIyBDb21tYW5kIFR5cGVzXG4gKiAqKkNvbW1hbmRzIHdpdGggRXh0ZXJuYWwgRGVwZW5kZW5jaWVzOioqXG4gKiAtIFJlcXVpcmUgZXh0ZXJuYWwgc2VydmljZXMsIEFQSXMsIG9yIFJlYWN0IGhvb2tzXG4gKiAtIE11c3QgcHJvdmlkZSBkZXBlbmRlbmNpZXMgaW4gYFNsYXNoQ29tbWFuZFByb3ZpZGVyYFxuICogLSBFeGFtcGxlOiB0aGVtZSBjb21tYW5kcyAobmVlZHMgdXNlVGhlbWUpLCBBUEkgY29tbWFuZHMgKG5lZWRzIHNlcnZpY2UpXG4gKlxuICogKipTZWxmLUNvbnRhaW5lZCBDb21tYW5kczoqKlxuICogLSBQdXJlIGxvZ2ljIG9wZXJhdGlvbnMsIG5vIGV4dGVybmFsIGRlcGVuZGVuY2llc1xuICogLSBTdGlsbCByZWNvbW1lbmRlZCB0byByZWdpc3RlciB0aHJvdWdoIGBTbGFzaENvbW1hbmRQcm92aWRlcmAgZm9yIGNvbnNpc3RlbmN5XG4gKiAtIEV4YW1wbGU6IGNhbGN1bGF0b3IsIHRleHQgbWFuaXB1bGF0aW9uIGNvbW1hbmRzXG4gKlxuICogIyMgQXZhaWxhYmxlIEFjdGlvbnNcbiAqIC0gYEBhcHBgIC0gU2VhcmNoIGFwcGxpY2F0aW9uc1xuICogLSBgQGtub3dsZWRnZWAgLyBgQGtiYCAtIFNlYXJjaCBrbm93bGVkZ2UgYmFzZXNcbiAqIC0gYEBwbHVnaW5gIC0gU2VhcmNoIHBsdWdpbnNcbiAqIC0gYEBub2RlYCAtIFNlYXJjaCB3b3JrZmxvdyBub2RlcyAod29ya2Zsb3cgcGFnZXMgb25seSlcbiAqIC0gYC9gIC0gRXhlY3V0ZSBzbGFzaCBjb21tYW5kcyAodGhlbWUsIGxhbmd1YWdlLCBldGMuKVxuICovXG5cbmltcG9ydCB0eXBlIHsgQWN0aW9uSXRlbSwgU2VhcmNoUmVzdWx0IH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGFwcEFjdGlvbiB9IGZyb20gJy4vYXBwJ1xuaW1wb3J0IHsgc2xhc2hBY3Rpb24gfSBmcm9tICcuL2NvbW1hbmRzJ1xuaW1wb3J0IHsgc2xhc2hDb21tYW5kUmVnaXN0cnkgfSBmcm9tICcuL2NvbW1hbmRzL3JlZ2lzdHJ5J1xuaW1wb3J0IHsga25vd2xlZGdlQWN0aW9uIH0gZnJvbSAnLi9rbm93bGVkZ2UnXG5pbXBvcnQgeyBwbHVnaW5BY3Rpb24gfSBmcm9tICcuL3BsdWdpbidcbmltcG9ydCB7IHJhZ1BpcGVsaW5lTm9kZXNBY3Rpb24gfSBmcm9tICcuL3JhZy1waXBlbGluZS1ub2RlcydcbmltcG9ydCB7IHdvcmtmbG93Tm9kZXNBY3Rpb24gfSBmcm9tICcuL3dvcmtmbG93LW5vZGVzJ1xuXG4vLyBDcmVhdGUgZHluYW1pYyBBY3Rpb25zIGJhc2VkIG9uIGNvbnRleHRcbmV4cG9ydCBjb25zdCBjcmVhdGVBY3Rpb25zID0gKGlzV29ya2Zsb3dQYWdlOiBib29sZWFuLCBpc1JhZ1BpcGVsaW5lUGFnZTogYm9vbGVhbikgPT4ge1xuICBjb25zdCBiYXNlQWN0aW9ucyA9IHtcbiAgICBzbGFzaDogc2xhc2hBY3Rpb24sXG4gICAgYXBwOiBhcHBBY3Rpb24sXG4gICAga25vd2xlZGdlOiBrbm93bGVkZ2VBY3Rpb24sXG4gICAgcGx1Z2luOiBwbHVnaW5BY3Rpb24sXG4gIH1cblxuICAvLyBBZGQgYXBwcm9wcmlhdGUgbm9kZSBzZWFyY2ggYmFzZWQgb24gY29udGV4dFxuICBpZiAoaXNSYWdQaXBlbGluZVBhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmFzZUFjdGlvbnMsXG4gICAgICBub2RlOiByYWdQaXBlbGluZU5vZGVzQWN0aW9uLFxuICAgIH1cbiAgfVxuICBlbHNlIGlmIChpc1dvcmtmbG93UGFnZSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5iYXNlQWN0aW9ucyxcbiAgICAgIG5vZGU6IHdvcmtmbG93Tm9kZXNBY3Rpb24sXG4gICAgfVxuICB9XG5cbiAgLy8gRGVmYXVsdCBhY3Rpb25zIHdpdGhvdXQgbm9kZSBzZWFyY2hcbiAgcmV0dXJuIGJhc2VBY3Rpb25zXG59XG5cbi8vIExlZ2FjeSBleHBvcnQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbmV4cG9ydCBjb25zdCBBY3Rpb25zID0ge1xuICBzbGFzaDogc2xhc2hBY3Rpb24sXG4gIGFwcDogYXBwQWN0aW9uLFxuICBrbm93bGVkZ2U6IGtub3dsZWRnZUFjdGlvbixcbiAgcGx1Z2luOiBwbHVnaW5BY3Rpb24sXG4gIG5vZGU6IHdvcmtmbG93Tm9kZXNBY3Rpb24sXG59XG5cbmV4cG9ydCBjb25zdCBzZWFyY2hBbnl0aGluZyA9IGFzeW5jIChcbiAgbG9jYWxlOiBzdHJpbmcsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIGFjdGlvbkl0ZW0/OiBBY3Rpb25JdGVtLFxuICBkeW5hbWljQWN0aW9ucz86IFJlY29yZDxzdHJpbmcsIEFjdGlvbkl0ZW0+LFxuKTogUHJvbWlzZTxTZWFyY2hSZXN1bHRbXT4gPT4ge1xuICBjb25zdCB0cmltbWVkUXVlcnkgPSBxdWVyeS50cmltKClcblxuICBpZiAoYWN0aW9uSXRlbSkge1xuICAgIGNvbnN0IGVzY2FwZVJlZ0V4cCA9ICh2YWx1ZTogc3RyaW5nKSA9PiB2YWx1ZS5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgY29uc3QgcHJlZml4UGF0dGVybiA9IG5ldyBSZWdFeHAoYF4oJHtlc2NhcGVSZWdFeHAoYWN0aW9uSXRlbS5rZXkpfXwke2VzY2FwZVJlZ0V4cChhY3Rpb25JdGVtLnNob3J0Y3V0KX0pXFxcXHMqYClcbiAgICBjb25zdCBzZWFyY2hUZXJtID0gdHJpbW1lZFF1ZXJ5LnJlcGxhY2UocHJlZml4UGF0dGVybiwgJycpLnRyaW0oKVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgYWN0aW9uSXRlbS5zZWFyY2gocXVlcnksIHNlYXJjaFRlcm0sIGxvY2FsZSlcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFNlYXJjaCBmYWlsZWQgZm9yICR7YWN0aW9uSXRlbS5rZXl9OmAsIGVycm9yKVxuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9XG5cbiAgaWYgKHRyaW1tZWRRdWVyeS5zdGFydHNXaXRoKCdAJykgfHwgdHJpbW1lZFF1ZXJ5LnN0YXJ0c1dpdGgoJy8nKSlcbiAgICByZXR1cm4gW11cblxuICBjb25zdCBnbG9iYWxTZWFyY2hBY3Rpb25zID0gT2JqZWN0LnZhbHVlcyhkeW5hbWljQWN0aW9ucyB8fCBBY3Rpb25zKVxuICAgIC8vIEV4Y2x1ZGUgc2xhc2ggY29tbWFuZHMgZnJvbSBnZW5lcmFsIHNlYXJjaCByZXN1bHRzXG4gICAgLmZpbHRlcihhY3Rpb24gPT4gYWN0aW9uLmtleSAhPT0gJy8nKVxuXG4gIC8vIFVzZSBQcm9taXNlLmFsbFNldHRsZWQgdG8gaGFuZGxlIHBhcnRpYWwgZmFpbHVyZXMgZ3JhY2VmdWxseVxuICBjb25zdCBzZWFyY2hQcm9taXNlcyA9IGdsb2JhbFNlYXJjaEFjdGlvbnMubWFwKGFzeW5jIChhY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IGFjdGlvbi5zZWFyY2gocXVlcnksIHF1ZXJ5LCBsb2NhbGUpXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHRzLCBhY3Rpb25UeXBlOiBhY3Rpb24ua2V5IH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFNlYXJjaCBmYWlsZWQgZm9yICR7YWN0aW9uLmtleX06YCwgZXJyb3IpXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZGF0YTogW10sIGFjdGlvblR5cGU6IGFjdGlvbi5rZXksIGVycm9yIH1cbiAgICB9XG4gIH0pXG5cbiAgY29uc3Qgc2V0dGxlZFJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQoc2VhcmNoUHJvbWlzZXMpXG5cbiAgY29uc3QgYWxsUmVzdWx0czogU2VhcmNoUmVzdWx0W10gPSBbXVxuICBjb25zdCBmYWlsZWRBY3Rpb25zOiBzdHJpbmdbXSA9IFtdXG5cbiAgc2V0dGxlZFJlc3VsdHMuZm9yRWFjaCgocmVzdWx0LCBpbmRleCkgPT4ge1xuICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAnZnVsZmlsbGVkJyAmJiByZXN1bHQudmFsdWUuc3VjY2Vzcykge1xuICAgICAgYWxsUmVzdWx0cy5wdXNoKC4uLnJlc3VsdC52YWx1ZS5kYXRhKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IGFjdGlvbktleSA9IGdsb2JhbFNlYXJjaEFjdGlvbnNbaW5kZXhdPy5rZXkgfHwgJ3Vua25vd24nXG4gICAgICBmYWlsZWRBY3Rpb25zLnB1c2goYWN0aW9uS2V5KVxuICAgIH1cbiAgfSlcblxuICBpZiAoZmFpbGVkQWN0aW9ucy5sZW5ndGggPiAwKVxuICAgIGNvbnNvbGUud2FybihgU29tZSBzZWFyY2ggYWN0aW9ucyBmYWlsZWQ6ICR7ZmFpbGVkQWN0aW9ucy5qb2luKCcsICcpfWApXG5cbiAgcmV0dXJuIGFsbFJlc3VsdHNcbn1cblxuZXhwb3J0IGNvbnN0IG1hdGNoQWN0aW9uID0gKHF1ZXJ5OiBzdHJpbmcsIGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEFjdGlvbkl0ZW0+KSA9PiB7XG4gIHJldHVybiBPYmplY3QudmFsdWVzKGFjdGlvbnMpLmZpbmQoKGFjdGlvbikgPT4ge1xuICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIHNsYXNoIGNvbW1hbmRzXG4gICAgaWYgKGFjdGlvbi5rZXkgPT09ICcvJykge1xuICAgICAgLy8gR2V0IGFsbCByZWdpc3RlcmVkIGNvbW1hbmRzIGZyb20gdGhlIHJlZ2lzdHJ5XG4gICAgICBjb25zdCBhbGxDb21tYW5kcyA9IHNsYXNoQ29tbWFuZFJlZ2lzdHJ5LmdldEFsbENvbW1hbmRzKClcblxuICAgICAgLy8gQ2hlY2sgaWYgcXVlcnkgbWF0Y2hlcyBhbnkgcmVnaXN0ZXJlZCBjb21tYW5kXG4gICAgICByZXR1cm4gYWxsQ29tbWFuZHMuc29tZSgoY21kKSA9PiB7XG4gICAgICAgIGNvbnN0IGNtZFBhdHRlcm4gPSBgLyR7Y21kLm5hbWV9YFxuXG4gICAgICAgIC8vIEZvciBkaXJlY3QgbW9kZSBjb21tYW5kcywgZG9uJ3QgbWF0Y2ggKGtlZXAgaW4gY29tbWFuZCBzZWxlY3RvcilcbiAgICAgICAgaWYgKGNtZC5tb2RlID09PSAnZGlyZWN0JylcbiAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICAvLyBGb3Igc3VibWVudSBtb2RlIGNvbW1hbmRzLCBtYXRjaCB3aGVuIGNvbXBsZXRlIGNvbW1hbmQgaXMgZW50ZXJlZFxuICAgICAgICByZXR1cm4gcXVlcnkgPT09IGNtZFBhdHRlcm4gfHwgcXVlcnkuc3RhcnRzV2l0aChgJHtjbWRQYXR0ZXJufSBgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCByZWcgPSBuZXcgUmVnRXhwKGBeKCR7YWN0aW9uLmtleX18JHthY3Rpb24uc2hvcnRjdXR9KSg/OlxcXFxzfCQpYClcbiAgICByZXR1cm4gcmVnLnRlc3QocXVlcnkpXG4gIH0pXG59XG5cbmV4cG9ydCAqIGZyb20gJy4vY29tbWFuZHMnXG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJ1xuZXhwb3J0IHsgYXBwQWN0aW9uLCBrbm93bGVkZ2VBY3Rpb24sIHBsdWdpbkFjdGlvbiwgd29ya2Zsb3dOb2Rlc0FjdGlvbiB9XG4iXX0=