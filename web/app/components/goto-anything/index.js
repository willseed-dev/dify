"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_query_1 = require("@tanstack/react-query");
const ahooks_1 = require("ahooks");
const cmdk_1 = require("cmdk");
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const input_1 = require("@/app/components/base/input");
const modal_1 = require("@/app/components/base/modal");
const common_1 = require("@/app/components/workflow/utils/common");
const node_navigation_1 = require("@/app/components/workflow/utils/node-navigation");
const i18n_1 = require("@/context/i18n");
const install_from_marketplace_1 = require("../plugins/install-plugin/install-from-marketplace");
const actions_1 = require("./actions");
const commands_1 = require("./actions/commands");
const registry_1 = require("./actions/commands/registry");
const command_selector_1 = require("./command-selector");
const context_1 = require("./context");
const GotoAnything = ({ onHide, }) => {
    const router = (0, navigation_1.useRouter)();
    const defaultLocale = (0, i18n_1.useGetLanguage)();
    const { isWorkflowPage, isRagPipelinePage } = (0, context_1.useGotoAnythingContext)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [show, setShow] = (0, react_2.useState)(false);
    const [searchQuery, setSearchQuery] = (0, react_2.useState)('');
    const [cmdVal, setCmdVal] = (0, react_2.useState)('_');
    const inputRef = (0, react_2.useRef)(null);
    // Filter actions based on context
    const Actions = (0, react_2.useMemo)(() => {
        // Create actions based on current page context
        return (0, actions_1.createActions)(isWorkflowPage, isRagPipelinePage);
    }, [isWorkflowPage, isRagPipelinePage]);
    const [activePlugin, setActivePlugin] = (0, react_2.useState)();
    // Handle keyboard shortcuts
    const handleToggleModal = (0, react_2.useCallback)((e) => {
        // Allow closing when modal is open, even if focus is in the search input
        if (!show && (0, common_1.isEventTargetInputArea)(e.target))
            return;
        e.preventDefault();
        setShow((prev) => {
            if (!prev) {
                // Opening modal - reset search state
                setSearchQuery('');
            }
            return !prev;
        });
    }, [show]);
    (0, ahooks_1.useKeyPress)(`${(0, common_1.getKeyboardKeyCodeBySystem)('ctrl')}.k`, handleToggleModal, {
        exactMatch: true,
        useCapture: true,
    });
    (0, ahooks_1.useKeyPress)(['esc'], (e) => {
        if (show) {
            e.preventDefault();
            setShow(false);
            setSearchQuery('');
        }
    });
    const searchQueryDebouncedValue = (0, ahooks_1.useDebounce)(searchQuery.trim(), {
        wait: 300,
    });
    const isCommandsMode = searchQuery.trim() === '@' || searchQuery.trim() === '/'
        || (searchQuery.trim().startsWith('@') && !(0, actions_1.matchAction)(searchQuery.trim(), Actions))
        || (searchQuery.trim().startsWith('/') && !(0, actions_1.matchAction)(searchQuery.trim(), Actions));
    const searchMode = (0, react_2.useMemo)(() => {
        if (isCommandsMode) {
            // Distinguish between @ (scopes) and / (commands) mode
            if (searchQuery.trim().startsWith('@'))
                return 'scopes';
            else if (searchQuery.trim().startsWith('/'))
                return 'commands';
            return 'commands'; // default fallback
        }
        const query = searchQueryDebouncedValue.toLowerCase();
        const action = (0, actions_1.matchAction)(query, Actions);
        if (!action)
            return 'general';
        return action.key === '/' ? '@command' : action.key;
    }, [searchQueryDebouncedValue, Actions, isCommandsMode, searchQuery]);
    const { data: searchResults = [], isLoading, isError, error } = (0, react_query_1.useQuery)({
        queryKey: [
            'goto-anything',
            'search-result',
            searchQueryDebouncedValue,
            searchMode,
            isWorkflowPage,
            isRagPipelinePage,
            defaultLocale,
            Actions,
        ],
        queryFn: async () => {
            const query = searchQueryDebouncedValue.toLowerCase();
            const action = (0, actions_1.matchAction)(query, Actions);
            return await (0, actions_1.searchAnything)(defaultLocale, query, action, Actions);
        },
        enabled: !!searchQueryDebouncedValue && !isCommandsMode,
        staleTime: 30000,
        gcTime: 300000,
    });
    // Prevent automatic selection of the first option when cmdVal is not set
    const clearSelection = () => {
        setCmdVal('_');
    };
    const handleCommandSelect = (0, react_2.useCallback)((commandKey) => {
        // Check if it's a slash command
        if (commandKey.startsWith('/')) {
            const commandName = commandKey.substring(1);
            const handler = registry_1.slashCommandRegistry.findCommand(commandName);
            // If it's a direct mode command, execute immediately
            if (handler?.mode === 'direct' && handler.execute) {
                handler.execute();
                setShow(false);
                setSearchQuery('');
                return;
            }
        }
        // Otherwise, proceed with the normal flow (submenu mode)
        setSearchQuery(`${commandKey} `);
        clearSelection();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, []);
    // Handle navigation to selected result
    const handleNavigate = (0, react_2.useCallback)((result) => {
        setShow(false);
        setSearchQuery('');
        switch (result.type) {
            case 'command': {
                // Execute slash commands
                const action = Actions.slash;
                action?.action?.(result);
                break;
            }
            case 'plugin':
                setActivePlugin(result.data);
                break;
            case 'workflow-node':
                // Handle workflow node selection and navigation
                if (result.metadata?.nodeId)
                    (0, node_navigation_1.selectWorkflowNode)(result.metadata.nodeId, true);
                break;
            default:
                if (result.path)
                    router.push(result.path);
        }
    }, [router]);
    const dedupedResults = (0, react_2.useMemo)(() => {
        const seen = new Set();
        return searchResults.filter((result) => {
            const key = `${result.type}-${result.id}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
    }, [searchResults]);
    // Group results by type
    const groupedResults = (0, react_2.useMemo)(() => dedupedResults.reduce((acc, result) => {
        if (!acc[result.type])
            acc[result.type] = [];
        acc[result.type].push(result);
        return acc;
    }, {}), [dedupedResults]);
    (0, react_2.useEffect)(() => {
        if (isCommandsMode)
            return;
        if (!dedupedResults.length)
            return;
        const currentValueExists = dedupedResults.some(result => `${result.type}-${result.id}` === cmdVal);
        if (!currentValueExists)
            setCmdVal(`${dedupedResults[0].type}-${dedupedResults[0].id}`);
    }, [isCommandsMode, dedupedResults, cmdVal]);
    const emptyResult = (0, react_2.useMemo)(() => {
        if (dedupedResults.length || !searchQuery.trim() || isLoading || isCommandsMode)
            return null;
        const isCommandSearch = searchMode !== 'general';
        const commandType = isCommandSearch ? searchMode.replace('@', '') : '';
        if (isError) {
            return (<div className="flex items-center justify-center py-8 text-center text-text-tertiary">
          <div>
            <div className="text-sm font-medium text-red-500">{t('gotoAnything.searchTemporarilyUnavailable', { ns: 'app' })}</div>
            <div className="mt-1 text-xs text-text-quaternary">
              {t('gotoAnything.servicesUnavailableMessage', { ns: 'app' })}
            </div>
          </div>
        </div>);
        }
        return (<div className="flex items-center justify-center py-8 text-center text-text-tertiary">
        <div>
          <div className="text-sm font-medium">
            {isCommandSearch
                ? (() => {
                    const keyMap = {
                        app: 'gotoAnything.emptyState.noAppsFound',
                        plugin: 'gotoAnything.emptyState.noPluginsFound',
                        knowledge: 'gotoAnything.emptyState.noKnowledgeBasesFound',
                        node: 'gotoAnything.emptyState.noWorkflowNodesFound',
                    };
                    return t(keyMap[commandType] || 'gotoAnything.noResults', { ns: 'app' });
                })()
                : t('gotoAnything.noResults', { ns: 'app' })}
          </div>
          <div className="mt-1 text-xs text-text-quaternary">
            {isCommandSearch
                ? t('gotoAnything.emptyState.tryDifferentTerm', { ns: 'app' })
                : t('gotoAnything.emptyState.trySpecificSearch', { ns: 'app', shortcuts: Object.values(Actions).map(action => action.shortcut).join(', ') })}
          </div>
        </div>
      </div>);
    }, [dedupedResults, searchQuery, Actions, searchMode, isLoading, isError, isCommandsMode]);
    const defaultUI = (0, react_2.useMemo)(() => {
        if (searchQuery.trim())
            return null;
        return (<div className="flex items-center justify-center py-8 text-center text-text-tertiary">
        <div>
          <div className="text-sm font-medium">{t('gotoAnything.searchTitle', { ns: 'app' })}</div>
          <div className="mt-3 space-y-1 text-xs text-text-quaternary">
            <div>{t('gotoAnything.searchHint', { ns: 'app' })}</div>
            <div>{t('gotoAnything.commandHint', { ns: 'app' })}</div>
            <div>{t('gotoAnything.slashHint', { ns: 'app' })}</div>
          </div>
        </div>
      </div>);
    }, [searchQuery, Actions]);
    (0, react_2.useEffect)(() => {
        if (show) {
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [show]);
    return (<>
      <commands_1.SlashCommandProvider />
      <modal_1.default isShow={show} onClose={() => {
            setShow(false);
            setSearchQuery('');
            clearSelection();
            onHide?.();
        }} closable={false} className="!w-[480px] !p-0" highPriority={true}>
        <div className="flex flex-col rounded-2xl border border-components-panel-border bg-components-panel-bg shadow-xl">
          <cmdk_1.Command className="outline-none" value={cmdVal} onValueChange={setCmdVal} disablePointerSelection loop>
            <div className="flex items-center gap-3 border-b border-divider-subtle bg-components-panel-bg-blur px-4 py-3">
              <react_1.RiSearchLine className="h-4 w-4 text-text-quaternary"/>
              <div className="flex flex-1 items-center gap-2">
                <input_1.default ref={inputRef} value={searchQuery} placeholder={t('gotoAnything.searchPlaceholder', { ns: 'app' })} onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.startsWith('@') && !e.target.value.startsWith('/'))
                clearSelection();
        }} onKeyDown={(e) => {
            if (e.key === 'Enter') {
                const query = searchQuery.trim();
                // Check if it's a complete slash command
                if (query.startsWith('/')) {
                    const commandName = query.substring(1).split(' ')[0];
                    const handler = registry_1.slashCommandRegistry.findCommand(commandName);
                    // If it's a direct mode command, execute immediately
                    const isAvailable = handler?.isAvailable?.() ?? true;
                    if (handler?.mode === 'direct' && handler.execute && isAvailable) {
                        e.preventDefault();
                        handler.execute();
                        setShow(false);
                        setSearchQuery('');
                    }
                }
            }
        }} className="flex-1 !border-0 !bg-transparent !shadow-none" wrapperClassName="flex-1 !border-0 !bg-transparent" autoFocus/>
                {searchMode !== 'general' && (<div className="flex items-center gap-1 rounded bg-gray-100 px-2 py-[2px] text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <span>
                      {(() => {
                if (searchMode === 'scopes')
                    return 'SCOPES';
                else if (searchMode === 'commands')
                    return 'COMMANDS';
                else
                    return searchMode.replace('@', '').toUpperCase();
            })()}
                    </span>
                  </div>)}
              </div>
              <div className="text-xs text-text-quaternary">
                <span className="system-kbd rounded bg-gray-200 px-1 py-[2px] font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  {(0, common_1.isMac)() ? '⌘' : 'Ctrl'}
                </span>
                <span className="system-kbd ml-1 rounded bg-gray-200 px-1 py-[2px] font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  K
                </span>
              </div>
            </div>

            <cmdk_1.Command.List className="h-[240px] overflow-y-auto">
              {isLoading && (<div className="flex items-center justify-center py-8 text-center text-text-tertiary">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                    <span className="text-sm">{t('gotoAnything.searching', { ns: 'app' })}</span>
                  </div>
                </div>)}
              {isError && (<div className="flex items-center justify-center py-8 text-center text-text-tertiary">
                  <div>
                    <div className="text-sm font-medium text-red-500">{t('gotoAnything.searchFailed', { ns: 'app' })}</div>
                    <div className="mt-1 text-xs text-text-quaternary">
                      {error.message}
                    </div>
                  </div>
                </div>)}
              {!isLoading && !isError && (<>
                  {isCommandsMode
                ? (<command_selector_1.default actions={Actions} onCommandSelect={handleCommandSelect} searchFilter={searchQuery.trim().substring(1)} commandValue={cmdVal} onCommandValueChange={setCmdVal} originalQuery={searchQuery.trim()}/>)
                : (Object.entries(groupedResults).map(([type, results], groupIndex) => (<cmdk_1.Command.Group key={groupIndex} heading={(() => {
                        const typeMap = {
                            'app': 'gotoAnything.groups.apps',
                            'plugin': 'gotoAnything.groups.plugins',
                            'knowledge': 'gotoAnything.groups.knowledgeBases',
                            'workflow-node': 'gotoAnything.groups.workflowNodes',
                            'command': 'gotoAnything.groups.commands',
                        };
                        return t(typeMap[type] || `${type}s`, { ns: 'app' });
                    })()} className="p-2 capitalize text-text-secondary">
                            {results.map(result => (<cmdk_1.Command.Item key={`${result.type}-${result.id}`} value={`${result.type}-${result.id}`} className="flex cursor-pointer items-center gap-3 rounded-md p-3 will-change-[background-color] hover:bg-state-base-hover aria-[selected=true]:bg-state-base-hover-alt data-[selected=true]:bg-state-base-hover-alt" onSelect={() => handleNavigate(result)}>
                                {result.icon}
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium text-text-secondary">
                                    {result.title}
                                  </div>
                                  {result.description && (<div className="mt-0.5 truncate text-xs text-text-quaternary">
                                      {result.description}
                                    </div>)}
                                </div>
                                <div className="text-xs capitalize text-text-quaternary">
                                  {result.type}
                                </div>
                              </cmdk_1.Command.Item>))}
                          </cmdk_1.Command.Group>)))}
                  {!isCommandsMode && emptyResult}
                  {!isCommandsMode && defaultUI}
                </>)}
            </cmdk_1.Command.List>

            {/* Always show footer to prevent height jumping */}
            <div className="border-t border-divider-subtle bg-components-panel-bg-blur px-4 py-2 text-xs text-text-tertiary">
              <div className="flex min-h-[16px] items-center justify-between">
                {(!!dedupedResults.length || isError)
            ? (<>
                        <span>
                          {isError
                    ? (<span className="text-red-500">{t('gotoAnything.someServicesUnavailable', { ns: 'app' })}</span>)
                    : (<>
                                  {t('gotoAnything.resultCount', { ns: 'app', count: dedupedResults.length })}
                                  {searchMode !== 'general' && (<span className="ml-2 opacity-60">
                                      {t('gotoAnything.inScope', { ns: 'app', scope: searchMode.replace('@', '') })}
                                    </span>)}
                                </>)}
                        </span>
                        <span className="opacity-60">
                          {searchMode !== 'general'
                    ? t('gotoAnything.clearToSearchAll', { ns: 'app' })
                    : t('gotoAnything.useAtForSpecific', { ns: 'app' })}
                        </span>
                      </>)
            : (<>
                        <span className="opacity-60">
                          {(() => {
                    if (isCommandsMode)
                        return t('gotoAnything.selectToNavigate', { ns: 'app' });
                    if (searchQuery.trim())
                        return t('gotoAnything.searching', { ns: 'app' });
                    return t('gotoAnything.startTyping', { ns: 'app' });
                })()}
                        </span>
                        <span className="opacity-60">
                          {searchQuery.trim() || isCommandsMode
                    ? t('gotoAnything.tips', { ns: 'app' })
                    : t('gotoAnything.pressEscToClose', { ns: 'app' })}
                        </span>
                      </>)}
              </div>
            </div>
          </cmdk_1.Command>
        </div>

      </modal_1.default>
      {activePlugin && (<install_from_marketplace_1.default manifest={activePlugin} uniqueIdentifier={activePlugin.latest_package_identifier} onClose={() => setActivePlugin(undefined)} onSuccess={() => setActivePlugin(undefined)}/>)}
    </>);
};
/**
 * GotoAnything component with context provider
 */
const GotoAnythingWithContext = (props) => {
    return (<context_1.GotoAnythingProvider>
      <GotoAnything {...props}/>
    </context_1.GotoAnythingProvider>);
};
exports.default = GotoAnythingWithContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFLWiw0Q0FBK0M7QUFDL0MsdURBQWdEO0FBQ2hELG1DQUFpRDtBQUNqRCwrQkFBOEI7QUFDOUIsZ0RBQTJDO0FBQzNDLGlDQUF5RTtBQUN6RSxpREFBOEM7QUFDOUMsdURBQStDO0FBQy9DLHVEQUErQztBQUMvQyxtRUFBa0g7QUFDbEgscUZBQW9GO0FBQ3BGLHlDQUErQztBQUMvQyxpR0FBdUY7QUFDdkYsdUNBQXNFO0FBQ3RFLGlEQUF5RDtBQUN6RCwwREFBa0U7QUFDbEUseURBQWdEO0FBQ2hELHVDQUF3RTtBQUt4RSxNQUFNLFlBQVksR0FBYyxDQUFDLEVBQy9CLE1BQU0sR0FDUCxFQUFFLEVBQUU7SUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUMxQixNQUFNLGFBQWEsR0FBRyxJQUFBLHFCQUFjLEdBQUUsQ0FBQTtJQUN0QyxNQUFNLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBQSxnQ0FBc0IsR0FBRSxDQUFBO0lBQ3RFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBVSxLQUFLLENBQUMsQ0FBQTtJQUNoRCxNQUFNLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBUyxFQUFFLENBQUMsQ0FBQTtJQUMxRCxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBUyxHQUFHLENBQUMsQ0FBQTtJQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFBLGNBQU0sRUFBbUIsSUFBSSxDQUFDLENBQUE7SUFFL0Msa0NBQWtDO0lBQ2xDLE1BQU0sT0FBTyxHQUFHLElB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LEVBQUUsSUFBSSxDQUNSO3NCQUFBLEdBQUcsQ0FDSixDQUNQO2NBQUEsRUFBRSxHQUFHLENBQ1A7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsY0FBTyxDQUNYO1FBQUEsRUFBRSxHQUFHLENBRVA7O01BQUEsRUFBRSxlQUFLLENBQ1A7TUFBQSxDQUNFLFlBQVksSUFBSSxDQUNkLENBQUMsa0NBQXNCLENBQ3JCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUN2QixnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUN6RCxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FDMUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQzVDLENBRU4sQ0FDRjtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLHVCQUF1QixHQUFjLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDbkQsT0FBTyxDQUNMLENBQUMsOEJBQW9CLENBQ25CO01BQUEsQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDMUI7SUFBQSxFQUFFLDhCQUFvQixDQUFDLENBQ3hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSx1QkFBdUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJy4uL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFNlYXJjaFJlc3VsdCB9IGZyb20gJy4vYWN0aW9ucydcbmltcG9ydCB7IFJpU2VhcmNoTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VRdWVyeSB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IHVzZURlYm91bmNlLCB1c2VLZXlQcmVzcyB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdjbWRrJ1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IElucHV0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pbnB1dCdcbmltcG9ydCBNb2RhbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwnXG5pbXBvcnQgeyBnZXRLZXlib2FyZEtleUNvZGVCeVN5c3RlbSwgaXNFdmVudFRhcmdldElucHV0QXJlYSwgaXNNYWMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzL2NvbW1vbidcbmltcG9ydCB7IHNlbGVjdFdvcmtmbG93Tm9kZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMvbm9kZS1uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgdXNlR2V0TGFuZ3VhZ2UgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCBJbnN0YWxsRnJvbU1hcmtldHBsYWNlIGZyb20gJy4uL3BsdWdpbnMvaW5zdGFsbC1wbHVnaW4vaW5zdGFsbC1mcm9tLW1hcmtldHBsYWNlJ1xuaW1wb3J0IHsgY3JlYXRlQWN0aW9ucywgbWF0Y2hBY3Rpb24sIHNlYXJjaEFueXRoaW5nIH0gZnJvbSAnLi9hY3Rpb25zJ1xuaW1wb3J0IHsgU2xhc2hDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2FjdGlvbnMvY29tbWFuZHMnXG5pbXBvcnQgeyBzbGFzaENvbW1hbmRSZWdpc3RyeSB9IGZyb20gJy4vYWN0aW9ucy9jb21tYW5kcy9yZWdpc3RyeSdcbmltcG9ydCBDb21tYW5kU2VsZWN0b3IgZnJvbSAnLi9jb21tYW5kLXNlbGVjdG9yJ1xuaW1wb3J0IHsgR290b0FueXRoaW5nUHJvdmlkZXIsIHVzZUdvdG9Bbnl0aGluZ0NvbnRleHQgfSBmcm9tICcuL2NvbnRleHQnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9uSGlkZT86ICgpID0+IHZvaWRcbn1cbmNvbnN0IEdvdG9Bbnl0aGluZzogRkM8UHJvcHM+ID0gKHtcbiAgb25IaWRlLFxufSkgPT4ge1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuICBjb25zdCBkZWZhdWx0TG9jYWxlID0gdXNlR2V0TGFuZ3VhZ2UoKVxuICBjb25zdCB7IGlzV29ya2Zsb3dQYWdlLCBpc1JhZ1BpcGVsaW5lUGFnZSB9ID0gdXNlR290b0FueXRoaW5nQ29udGV4dCgpXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBbc2hvdywgc2V0U2hvd10gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSlcbiAgY29uc3QgW3NlYXJjaFF1ZXJ5LCBzZXRTZWFyY2hRdWVyeV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKVxuICBjb25zdCBbY21kVmFsLCBzZXRDbWRWYWxdID0gdXNlU3RhdGU8c3RyaW5nPignXycpXG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpXG5cbiAgLy8gRmlsdGVyIGFjdGlvbnMgYmFzZWQgb24gY29udGV4dFxuICBjb25zdCBBY3Rpb25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgLy8gQ3JlYXRlIGFjdGlvbnMgYmFzZWQgb24gY3VycmVudCBwYWdlIGNvbnRleHRcbiAgICByZXR1cm4gY3JlYXRlQWN0aW9ucyhpc1dvcmtmbG93UGFnZSwgaXNSYWdQaXBlbGluZVBhZ2UpXG4gIH0sIFtpc1dvcmtmbG93UGFnZSwgaXNSYWdQaXBlbGluZVBhZ2VdKVxuXG4gIGNvbnN0IFthY3RpdmVQbHVnaW4sIHNldEFjdGl2ZVBsdWdpbl0gPSB1c2VTdGF0ZTxQbHVnaW4+KClcblxuICAvLyBIYW5kbGUga2V5Ym9hcmQgc2hvcnRjdXRzXG4gIGNvbnN0IGhhbmRsZVRvZ2dsZU1vZGFsID0gdXNlQ2FsbGJhY2soKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAvLyBBbGxvdyBjbG9zaW5nIHdoZW4gbW9kYWwgaXMgb3BlbiwgZXZlbiBpZiBmb2N1cyBpcyBpbiB0aGUgc2VhcmNoIGlucHV0XG4gICAgaWYgKCFzaG93ICYmIGlzRXZlbnRUYXJnZXRJbnB1dEFyZWEoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKVxuICAgICAgcmV0dXJuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0U2hvdygocHJldikgPT4ge1xuICAgICAgaWYgKCFwcmV2KSB7XG4gICAgICAgIC8vIE9wZW5pbmcgbW9kYWwgLSByZXNldCBzZWFyY2ggc3RhdGVcbiAgICAgICAgc2V0U2VhcmNoUXVlcnkoJycpXG4gICAgICB9XG4gICAgICByZXR1cm4gIXByZXZcbiAgICB9KVxuICB9LCBbc2hvd10pXG5cbiAgdXNlS2V5UHJlc3MoYCR7Z2V0S2V5Ym9hcmRLZXlDb2RlQnlTeXN0ZW0oJ2N0cmwnKX0ua2AsIGhhbmRsZVRvZ2dsZU1vZGFsLCB7XG4gICAgZXhhY3RNYXRjaDogdHJ1ZSxcbiAgICB1c2VDYXB0dXJlOiB0cnVlLFxuICB9KVxuXG4gIHVzZUtleVByZXNzKFsnZXNjJ10sIChlKSA9PiB7XG4gICAgaWYgKHNob3cpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgc2V0U2hvdyhmYWxzZSlcbiAgICAgIHNldFNlYXJjaFF1ZXJ5KCcnKVxuICAgIH1cbiAgfSlcblxuICBjb25zdCBzZWFyY2hRdWVyeURlYm91bmNlZFZhbHVlID0gdXNlRGVib3VuY2Uoc2VhcmNoUXVlcnkudHJpbSgpLCB7XG4gICAgd2FpdDogMzAwLFxuICB9KVxuXG4gIGNvbnN0IGlzQ29tbWFuZHNNb2RlID0gc2VhcmNoUXVlcnkudHJpbSgpID09PSAnQCcgfHwgc2VhcmNoUXVlcnkudHJpbSgpID09PSAnLydcbiAgICB8fCAoc2VhcmNoUXVlcnkudHJpbSgpLnN0YXJ0c1dpdGgoJ0AnKSAmJiAhbWF0Y2hBY3Rpb24oc2VhcmNoUXVlcnkudHJpbSgpLCBBY3Rpb25zKSlcbiAgICB8fCAoc2VhcmNoUXVlcnkudHJpbSgpLnN0YXJ0c1dpdGgoJy8nKSAmJiAhbWF0Y2hBY3Rpb24oc2VhcmNoUXVlcnkudHJpbSgpLCBBY3Rpb25zKSlcblxuICBjb25zdCBzZWFyY2hNb2RlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGlzQ29tbWFuZHNNb2RlKSB7XG4gICAgICAvLyBEaXN0aW5ndWlzaCBiZXR3ZWVuIEAgKHNjb3BlcykgYW5kIC8gKGNvbW1hbmRzKSBtb2RlXG4gICAgICBpZiAoc2VhcmNoUXVlcnkudHJpbSgpLnN0YXJ0c1dpdGgoJ0AnKSlcbiAgICAgICAgcmV0dXJuICdzY29wZXMnXG4gICAgICBlbHNlIGlmIChzZWFyY2hRdWVyeS50cmltKCkuc3RhcnRzV2l0aCgnLycpKVxuICAgICAgICByZXR1cm4gJ2NvbW1hbmRzJ1xuICAgICAgcmV0dXJuICdjb21tYW5kcycgLy8gZGVmYXVsdCBmYWxsYmFja1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXJ5ID0gc2VhcmNoUXVlcnlEZWJvdW5jZWRWYWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgY29uc3QgYWN0aW9uID0gbWF0Y2hBY3Rpb24ocXVlcnksIEFjdGlvbnMpXG5cbiAgICBpZiAoIWFjdGlvbilcbiAgICAgIHJldHVybiAnZ2VuZXJhbCdcblxuICAgIHJldHVybiBhY3Rpb24ua2V5ID09PSAnLycgPyAnQGNvbW1hbmQnIDogYWN0aW9uLmtleVxuICB9LCBbc2VhcmNoUXVlcnlEZWJvdW5jZWRWYWx1ZSwgQWN0aW9ucywgaXNDb21tYW5kc01vZGUsIHNlYXJjaFF1ZXJ5XSlcblxuICBjb25zdCB7IGRhdGE6IHNlYXJjaFJlc3VsdHMgPSBbXSwgaXNMb2FkaW5nLCBpc0Vycm9yLCBlcnJvciB9ID0gdXNlUXVlcnkoXG4gICAge1xuICAgICAgcXVlcnlLZXk6IFtcbiAgICAgICAgJ2dvdG8tYW55dGhpbmcnLFxuICAgICAgICAnc2VhcmNoLXJlc3VsdCcsXG4gICAgICAgIHNlYXJjaFF1ZXJ5RGVib3VuY2VkVmFsdWUsXG4gICAgICAgIHNlYXJjaE1vZGUsXG4gICAgICAgIGlzV29ya2Zsb3dQYWdlLFxuICAgICAgICBpc1JhZ1BpcGVsaW5lUGFnZSxcbiAgICAgICAgZGVmYXVsdExvY2FsZSxcbiAgICAgICAgQWN0aW9ucyxcbiAgICAgIF0sXG4gICAgICBxdWVyeUZuOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gc2VhcmNoUXVlcnlEZWJvdW5jZWRWYWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG1hdGNoQWN0aW9uKHF1ZXJ5LCBBY3Rpb25zKVxuICAgICAgICByZXR1cm4gYXdhaXQgc2VhcmNoQW55dGhpbmcoZGVmYXVsdExvY2FsZSwgcXVlcnksIGFjdGlvbiwgQWN0aW9ucylcbiAgICAgIH0sXG4gICAgICBlbmFibGVkOiAhIXNlYXJjaFF1ZXJ5RGVib3VuY2VkVmFsdWUgJiYgIWlzQ29tbWFuZHNNb2RlLFxuICAgICAgc3RhbGVUaW1lOiAzMDAwMCxcbiAgICAgIGdjVGltZTogMzAwMDAwLFxuICAgIH0sXG4gIClcblxuICAvLyBQcmV2ZW50IGF1dG9tYXRpYyBzZWxlY3Rpb24gb2YgdGhlIGZpcnN0IG9wdGlvbiB3aGVuIGNtZFZhbCBpcyBub3Qgc2V0XG4gIGNvbnN0IGNsZWFyU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgIHNldENtZFZhbCgnXycpXG4gIH1cblxuICBjb25zdCBoYW5kbGVDb21tYW5kU2VsZWN0ID0gdXNlQ2FsbGJhY2soKGNvbW1hbmRLZXk6IHN0cmluZykgPT4ge1xuICAgIC8vIENoZWNrIGlmIGl0J3MgYSBzbGFzaCBjb21tYW5kXG4gICAgaWYgKGNvbW1hbmRLZXkuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGNvbW1hbmRLZXkuc3Vic3RyaW5nKDEpXG4gICAgICBjb25zdCBoYW5kbGVyID0gc2xhc2hDb21tYW5kUmVnaXN0cnkuZmluZENvbW1hbmQoY29tbWFuZE5hbWUpXG5cbiAgICAgIC8vIElmIGl0J3MgYSBkaXJlY3QgbW9kZSBjb21tYW5kLCBleGVjdXRlIGltbWVkaWF0ZWx5XG4gICAgICBpZiAoaGFuZGxlcj8ubW9kZSA9PT0gJ2RpcmVjdCcgJiYgaGFuZGxlci5leGVjdXRlKSB7XG4gICAgICAgIGhhbmRsZXIuZXhlY3V0ZSgpXG4gICAgICAgIHNldFNob3coZmFsc2UpXG4gICAgICAgIHNldFNlYXJjaFF1ZXJ5KCcnKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHByb2NlZWQgd2l0aCB0aGUgbm9ybWFsIGZsb3cgKHN1Ym1lbnUgbW9kZSlcbiAgICBzZXRTZWFyY2hRdWVyeShgJHtjb21tYW5kS2V5fSBgKVxuICAgIGNsZWFyU2VsZWN0aW9uKClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQ/LmZvY3VzKClcbiAgICB9LCAwKVxuICB9LCBbXSlcblxuICAvLyBIYW5kbGUgbmF2aWdhdGlvbiB0byBzZWxlY3RlZCByZXN1bHRcbiAgY29uc3QgaGFuZGxlTmF2aWdhdGUgPSB1c2VDYWxsYmFjaygocmVzdWx0OiBTZWFyY2hSZXN1bHQpID0+IHtcbiAgICBzZXRTaG93KGZhbHNlKVxuICAgIHNldFNlYXJjaFF1ZXJ5KCcnKVxuXG4gICAgc3dpdGNoIChyZXN1bHQudHlwZSkge1xuICAgICAgY2FzZSAnY29tbWFuZCc6IHtcbiAgICAgICAgLy8gRXhlY3V0ZSBzbGFzaCBjb21tYW5kc1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBBY3Rpb25zLnNsYXNoXG4gICAgICAgIGFjdGlvbj8uYWN0aW9uPy4ocmVzdWx0KVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSAncGx1Z2luJzpcbiAgICAgICAgc2V0QWN0aXZlUGx1Z2luKHJlc3VsdC5kYXRhKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnd29ya2Zsb3ctbm9kZSc6XG4gICAgICAgIC8vIEhhbmRsZSB3b3JrZmxvdyBub2RlIHNlbGVjdGlvbiBhbmQgbmF2aWdhdGlvblxuICAgICAgICBpZiAocmVzdWx0Lm1ldGFkYXRhPy5ub2RlSWQpXG4gICAgICAgICAgc2VsZWN0V29ya2Zsb3dOb2RlKHJlc3VsdC5tZXRhZGF0YS5ub2RlSWQsIHRydWUpXG5cbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChyZXN1bHQucGF0aClcbiAgICAgICAgICByb3V0ZXIucHVzaChyZXN1bHQucGF0aClcbiAgICB9XG4gIH0sIFtyb3V0ZXJdKVxuXG4gIGNvbnN0IGRlZHVwZWRSZXN1bHRzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpXG4gICAgcmV0dXJuIHNlYXJjaFJlc3VsdHMuZmlsdGVyKChyZXN1bHQpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IGAke3Jlc3VsdC50eXBlfS0ke3Jlc3VsdC5pZH1gXG4gICAgICBpZiAoc2Vlbi5oYXMoa2V5KSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBzZWVuLmFkZChrZXkpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG4gIH0sIFtzZWFyY2hSZXN1bHRzXSlcblxuICAvLyBHcm91cCByZXN1bHRzIGJ5IHR5cGVcbiAgY29uc3QgZ3JvdXBlZFJlc3VsdHMgPSB1c2VNZW1vKCgpID0+IGRlZHVwZWRSZXN1bHRzLnJlZHVjZSgoYWNjLCByZXN1bHQpID0+IHtcbiAgICBpZiAoIWFjY1tyZXN1bHQudHlwZV0pXG4gICAgICBhY2NbcmVzdWx0LnR5cGVdID0gW11cblxuICAgIGFjY1tyZXN1bHQudHlwZV0ucHVzaChyZXN1bHQpXG4gICAgcmV0dXJuIGFjY1xuICB9LCB7fSBhcyB7IFtrZXk6IHN0cmluZ106IFNlYXJjaFJlc3VsdFtdIH0pLCBbZGVkdXBlZFJlc3VsdHNdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQ29tbWFuZHNNb2RlKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAoIWRlZHVwZWRSZXN1bHRzLmxlbmd0aClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgY3VycmVudFZhbHVlRXhpc3RzID0gZGVkdXBlZFJlc3VsdHMuc29tZShyZXN1bHQgPT4gYCR7cmVzdWx0LnR5cGV9LSR7cmVzdWx0LmlkfWAgPT09IGNtZFZhbClcblxuICAgIGlmICghY3VycmVudFZhbHVlRXhpc3RzKVxuICAgICAgc2V0Q21kVmFsKGAke2RlZHVwZWRSZXN1bHRzWzBdLnR5cGV9LSR7ZGVkdXBlZFJlc3VsdHNbMF0uaWR9YClcbiAgfSwgW2lzQ29tbWFuZHNNb2RlLCBkZWR1cGVkUmVzdWx0cywgY21kVmFsXSlcblxuICBjb25zdCBlbXB0eVJlc3VsdCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChkZWR1cGVkUmVzdWx0cy5sZW5ndGggfHwgIXNlYXJjaFF1ZXJ5LnRyaW0oKSB8fCBpc0xvYWRpbmcgfHwgaXNDb21tYW5kc01vZGUpXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgY29uc3QgaXNDb21tYW5kU2VhcmNoID0gc2VhcmNoTW9kZSAhPT0gJ2dlbmVyYWwnXG4gICAgY29uc3QgY29tbWFuZFR5cGUgPSBpc0NvbW1hbmRTZWFyY2ggPyBzZWFyY2hNb2RlLnJlcGxhY2UoJ0AnLCAnJykgOiAnJ1xuXG4gICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHktOCB0ZXh0LWNlbnRlciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtcmVkLTUwMFwiPnt0KCdnb3RvQW55dGhpbmcuc2VhcmNoVGVtcG9yYXJpbHlVbmF2YWlsYWJsZScsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIHRleHQteHMgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIj5cbiAgICAgICAgICAgICAge3QoJ2dvdG9Bbnl0aGluZy5zZXJ2aWNlc1VuYXZhaWxhYmxlTWVzc2FnZScsIHsgbnM6ICdhcHAnIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB5LTggdGV4dC1jZW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtXCI+XG4gICAgICAgICAgICB7aXNDb21tYW5kU2VhcmNoXG4gICAgICAgICAgICAgID8gKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGtleU1hcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXBwOiAnZ290b0FueXRoaW5nLmVtcHR5U3RhdGUubm9BcHBzRm91bmQnLFxuICAgICAgICAgICAgICAgICAgICBwbHVnaW46ICdnb3RvQW55dGhpbmcuZW1wdHlTdGF0ZS5ub1BsdWdpbnNGb3VuZCcsXG4gICAgICAgICAgICAgICAgICAgIGtub3dsZWRnZTogJ2dvdG9Bbnl0aGluZy5lbXB0eVN0YXRlLm5vS25vd2xlZGdlQmFzZXNGb3VuZCcsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6ICdnb3RvQW55dGhpbmcuZW1wdHlTdGF0ZS5ub1dvcmtmbG93Tm9kZXNGb3VuZCcsXG4gICAgICAgICAgICAgICAgICB9IGFzIGNvbnN0XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdChrZXlNYXBbY29tbWFuZFR5cGUgYXMga2V5b2YgdHlwZW9mIGtleU1hcF0gfHwgJ2dvdG9Bbnl0aGluZy5ub1Jlc3VsdHMnLCB7IG5zOiAnYXBwJyB9KVxuICAgICAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgICAgOiB0KCdnb3RvQW55dGhpbmcubm9SZXN1bHRzJywgeyBuczogJ2FwcCcgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIHRleHQteHMgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIj5cbiAgICAgICAgICAgIHtpc0NvbW1hbmRTZWFyY2hcbiAgICAgICAgICAgICAgPyB0KCdnb3RvQW55dGhpbmcuZW1wdHlTdGF0ZS50cnlEaWZmZXJlbnRUZXJtJywgeyBuczogJ2FwcCcgfSlcbiAgICAgICAgICAgICAgOiB0KCdnb3RvQW55dGhpbmcuZW1wdHlTdGF0ZS50cnlTcGVjaWZpY1NlYXJjaCcsIHsgbnM6ICdhcHAnLCBzaG9ydGN1dHM6IE9iamVjdC52YWx1ZXMoQWN0aW9ucykubWFwKGFjdGlvbiA9PiBhY3Rpb24uc2hvcnRjdXQpLmpvaW4oJywgJykgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LCBbZGVkdXBlZFJlc3VsdHMsIHNlYXJjaFF1ZXJ5LCBBY3Rpb25zLCBzZWFyY2hNb2RlLCBpc0xvYWRpbmcsIGlzRXJyb3IsIGlzQ29tbWFuZHNNb2RlXSlcblxuICBjb25zdCBkZWZhdWx0VUkgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoc2VhcmNoUXVlcnkudHJpbSgpKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB5LTggdGV4dC1jZW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtXCI+e3QoJ2dvdG9Bbnl0aGluZy5zZWFyY2hUaXRsZScsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMyBzcGFjZS15LTEgdGV4dC14cyB0ZXh0LXRleHQtcXVhdGVybmFyeVwiPlxuICAgICAgICAgICAgPGRpdj57dCgnZ290b0FueXRoaW5nLnNlYXJjaEhpbnQnLCB7IG5zOiAnYXBwJyB9KX08L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+e3QoJ2dvdG9Bbnl0aGluZy5jb21tYW5kSGludCcsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPGRpdj57dCgnZ290b0FueXRoaW5nLnNsYXNoSGludCcsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSwgW3NlYXJjaFF1ZXJ5LCBBY3Rpb25zXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzaG93KSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpbnB1dFJlZi5jdXJyZW50Py5mb2N1cygpXG4gICAgICB9KVxuICAgIH1cbiAgfSwgW3Nob3ddKVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTbGFzaENvbW1hbmRQcm92aWRlciAvPlxuICAgICAgPE1vZGFsXG4gICAgICAgIGlzU2hvdz17c2hvd31cbiAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgIHNldFNob3coZmFsc2UpXG4gICAgICAgICAgc2V0U2VhcmNoUXVlcnkoJycpXG4gICAgICAgICAgY2xlYXJTZWxlY3Rpb24oKVxuICAgICAgICAgIG9uSGlkZT8uKClcbiAgICAgICAgfX1cbiAgICAgICAgY2xvc2FibGU9e2ZhbHNlfVxuICAgICAgICBjbGFzc05hbWU9XCIhdy1bNDgwcHhdICFwLTBcIlxuICAgICAgICBoaWdoUHJpb3JpdHk9e3RydWV9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgc2hhZG93LXhsXCI+XG4gICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICB2YWx1ZT17Y21kVmFsfVxuICAgICAgICAgICAgb25WYWx1ZUNoYW5nZT17c2V0Q21kVmFsfVxuICAgICAgICAgICAgZGlzYWJsZVBvaW50ZXJTZWxlY3Rpb25cbiAgICAgICAgICAgIGxvb3BcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIGJvcmRlci1iIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnLWJsdXIgcHgtNCBweS0zXCI+XG4gICAgICAgICAgICAgIDxSaVNlYXJjaExpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtcXVhdGVybmFyeVwiIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LTEgaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICByZWY9e2lucHV0UmVmfVxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF1ZXJ5fVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2dvdG9Bbnl0aGluZy5zZWFyY2hQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHAnIH0pfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNlYXJjaFF1ZXJ5KGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWUudGFyZ2V0LnZhbHVlLnN0YXJ0c1dpdGgoJ0AnKSAmJiAhZS50YXJnZXQudmFsdWUuc3RhcnRzV2l0aCgnLycpKVxuICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gc2VhcmNoUXVlcnkudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBhIGNvbXBsZXRlIHNsYXNoIGNvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocXVlcnkuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kTmFtZSA9IHF1ZXJ5LnN1YnN0cmluZygxKS5zcGxpdCgnICcpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gc2xhc2hDb21tYW5kUmVnaXN0cnkuZmluZENvbW1hbmQoY29tbWFuZE5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgYSBkaXJlY3QgbW9kZSBjb21tYW5kLCBleGVjdXRlIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0F2YWlsYWJsZSA9IGhhbmRsZXI/LmlzQXZhaWxhYmxlPy4oKSA/PyB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcj8ubW9kZSA9PT0gJ2RpcmVjdCcgJiYgaGFuZGxlci5leGVjdXRlICYmIGlzQXZhaWxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmV4ZWN1dGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTaG93KGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTZWFyY2hRdWVyeSgnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgIWJvcmRlci0wICFiZy10cmFuc3BhcmVudCAhc2hhZG93LW5vbmVcIlxuICAgICAgICAgICAgICAgICAgd3JhcHBlckNsYXNzTmFtZT1cImZsZXgtMSAhYm9yZGVyLTAgIWJnLXRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAge3NlYXJjaE1vZGUgIT09ICdnZW5lcmFsJyAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHJvdW5kZWQgYmctZ3JheS0xMDAgcHgtMiBweS1bMnB4XSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDAgZGFyazpiZy1ncmF5LTgwMCBkYXJrOnRleHQtZ3JheS0zMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoTW9kZSA9PT0gJ3Njb3BlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnU0NPUEVTJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VhcmNoTW9kZSA9PT0gJ2NvbW1hbmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDT01NQU5EUydcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXJjaE1vZGUucmVwbGFjZSgnQCcsICcnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXRleHQtcXVhdGVybmFyeVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1rYmQgcm91bmRlZCBiZy1ncmF5LTIwMCBweC0xIHB5LVsycHhdIGZvbnQtbW9ubyB0ZXh0LWdyYXktNzAwIGRhcms6YmctZ3JheS04MDAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICAgICAgICB7aXNNYWMoKSA/ICfijJgnIDogJ0N0cmwnfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0ta2JkIG1sLTEgcm91bmRlZCBiZy1ncmF5LTIwMCBweC0xIHB5LVsycHhdIGZvbnQtbW9ubyB0ZXh0LWdyYXktNzAwIGRhcms6YmctZ3JheS04MDAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICAgICAgICBLXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8Q29tbWFuZC5MaXN0IGNsYXNzTmFtZT1cImgtWzI0MHB4XSBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICAgICAge2lzTG9hZGluZyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweS04IHRleHQtY2VudGVyIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtNCB3LTQgYW5pbWF0ZS1zcGluIHJvdW5kZWQtZnVsbCBib3JkZXItMiBib3JkZXItZ3JheS0zMDAgYm9yZGVyLXQtZ3JheS02MDBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbVwiPnt0KCdnb3RvQW55dGhpbmcuc2VhcmNoaW5nJywgeyBuczogJ2FwcCcgfSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtpc0Vycm9yICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB5LTggdGV4dC1jZW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1yZWQtNTAwXCI+e3QoJ2dvdG9Bbnl0aGluZy5zZWFyY2hGYWlsZWQnLCB7IG5zOiAnYXBwJyB9KX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIHRleHQteHMgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7ZXJyb3IubWVzc2FnZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgeyFpc0xvYWRpbmcgJiYgIWlzRXJyb3IgJiYgKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICB7aXNDb21tYW5kc01vZGVcbiAgICAgICAgICAgICAgICAgICAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWFuZFNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnM9e0FjdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tbWFuZFNlbGVjdD17aGFuZGxlQ29tbWFuZFNlbGVjdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoRmlsdGVyPXtzZWFyY2hRdWVyeS50cmltKCkuc3Vic3RyaW5nKDEpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kVmFsdWU9e2NtZFZhbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25Db21tYW5kVmFsdWVDaGFuZ2U9e3NldENtZFZhbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxRdWVyeT17c2VhcmNoUXVlcnkudHJpbSgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoZ3JvdXBlZFJlc3VsdHMpLm1hcCgoW3R5cGUsIHJlc3VsdHNdLCBncm91cEluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tYW5kLkdyb3VwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtncm91cEluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRpbmc9eygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlTWFwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXBwJzogJ2dvdG9Bbnl0aGluZy5ncm91cHMuYXBwcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbHVnaW4nOiAnZ290b0FueXRoaW5nLmdyb3Vwcy5wbHVnaW5zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2tub3dsZWRnZSc6ICdnb3RvQW55dGhpbmcuZ3JvdXBzLmtub3dsZWRnZUJhc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dvcmtmbG93LW5vZGUnOiAnZ290b0FueXRoaW5nLmdyb3Vwcy53b3JrZmxvd05vZGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbW1hbmQnOiAnZ290b0FueXRoaW5nLmdyb3Vwcy5jb21tYW5kcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIGNvbnN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdCh0eXBlTWFwW3R5cGUgYXMga2V5b2YgdHlwZW9mIHR5cGVNYXBdIHx8IGAke3R5cGV9c2AsIHsgbnM6ICdhcHAnIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTIgY2FwaXRhbGl6ZSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZXN1bHRzLm1hcChyZXN1bHQgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1hbmQuSXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2Ake3Jlc3VsdC50eXBlfS0ke3Jlc3VsdC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17YCR7cmVzdWx0LnR5cGV9LSR7cmVzdWx0LmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGdhcC0zIHJvdW5kZWQtbWQgcC0zIHdpbGwtY2hhbmdlLVtiYWNrZ3JvdW5kLWNvbG9yXSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyIGFyaWEtW3NlbGVjdGVkPXRydWVdOmJnLXN0YXRlLWJhc2UtaG92ZXItYWx0IGRhdGEtW3NlbGVjdGVkPXRydWVdOmJnLXN0YXRlLWJhc2UtaG92ZXItYWx0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9eygpID0+IGhhbmRsZU5hdmlnYXRlKHJlc3VsdCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZXN1bHQuaWNvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4tdy0wIGZsZXgtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJ1bmNhdGUgZm9udC1tZWRpdW0gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Jlc3VsdC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmVzdWx0LmRlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMC41IHRydW5jYXRlIHRleHQteHMgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Jlc3VsdC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgY2FwaXRhbGl6ZSB0ZXh0LXRleHQtcXVhdGVybmFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZXN1bHQudHlwZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbW1hbmQuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db21tYW5kLkdyb3VwPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgeyFpc0NvbW1hbmRzTW9kZSAmJiBlbXB0eVJlc3VsdH1cbiAgICAgICAgICAgICAgICAgIHshaXNDb21tYW5kc01vZGUgJiYgZGVmYXVsdFVJfVxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9Db21tYW5kLkxpc3Q+XG5cbiAgICAgICAgICAgIHsvKiBBbHdheXMgc2hvdyBmb290ZXIgdG8gcHJldmVudCBoZWlnaHQganVtcGluZyAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYmx1ciBweC00IHB5LTIgdGV4dC14cyB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi1oLVsxNnB4XSBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgeyghIWRlZHVwZWRSZXN1bHRzLmxlbmd0aCB8fCBpc0Vycm9yKVxuICAgICAgICAgICAgICAgICAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj57dCgnZ290b0FueXRoaW5nLnNvbWVTZXJ2aWNlc1VuYXZhaWxhYmxlJywgeyBuczogJ2FwcCcgfSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdnb3RvQW55dGhpbmcucmVzdWx0Q291bnQnLCB7IG5zOiAnYXBwJywgY291bnQ6IGRlZHVwZWRSZXN1bHRzLmxlbmd0aCB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoTW9kZSAhPT0gJ2dlbmVyYWwnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgb3BhY2l0eS02MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnZ290b0FueXRoaW5nLmluU2NvcGUnLCB7IG5zOiAnYXBwJywgc2NvcGU6IHNlYXJjaE1vZGUucmVwbGFjZSgnQCcsICcnKSB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcGFjaXR5LTYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hNb2RlICE9PSAnZ2VuZXJhbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHQoJ2dvdG9Bbnl0aGluZy5jbGVhclRvU2VhcmNoQWxsJywgeyBuczogJ2FwcCcgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHQoJ2dvdG9Bbnl0aGluZy51c2VBdEZvclNwZWNpZmljJywgeyBuczogJ2FwcCcgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcGFjaXR5LTYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbW1hbmRzTW9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0KCdnb3RvQW55dGhpbmcuc2VsZWN0VG9OYXZpZ2F0ZScsIHsgbnM6ICdhcHAnIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoUXVlcnkudHJpbSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQoJ2dvdG9Bbnl0aGluZy5zZWFyY2hpbmcnLCB7IG5zOiAnYXBwJyB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQoJ2dvdG9Bbnl0aGluZy5zdGFydFR5cGluZycsIHsgbnM6ICdhcHAnIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcGFjaXR5LTYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hRdWVyeS50cmltKCkgfHwgaXNDb21tYW5kc01vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHQoJ2dvdG9Bbnl0aGluZy50aXBzJywgeyBuczogJ2FwcCcgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHQoJ2dvdG9Bbnl0aGluZy5wcmVzc0VzY1RvQ2xvc2UnLCB7IG5zOiAnYXBwJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L0NvbW1hbmQ+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L01vZGFsPlxuICAgICAge1xuICAgICAgICBhY3RpdmVQbHVnaW4gJiYgKFxuICAgICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBtYW5pZmVzdD17YWN0aXZlUGx1Z2lufVxuICAgICAgICAgICAgdW5pcXVlSWRlbnRpZmllcj17YWN0aXZlUGx1Z2luLmxhdGVzdF9wYWNrYWdlX2lkZW50aWZpZXJ9XG4gICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRBY3RpdmVQbHVnaW4odW5kZWZpbmVkKX1cbiAgICAgICAgICAgIG9uU3VjY2Vzcz17KCkgPT4gc2V0QWN0aXZlUGx1Z2luKHVuZGVmaW5lZCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgIDwvPlxuICApXG59XG5cbi8qKlxuICogR290b0FueXRoaW5nIGNvbXBvbmVudCB3aXRoIGNvbnRleHQgcHJvdmlkZXJcbiAqL1xuY29uc3QgR290b0FueXRoaW5nV2l0aENvbnRleHQ6IEZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICByZXR1cm4gKFxuICAgIDxHb3RvQW55dGhpbmdQcm92aWRlcj5cbiAgICAgIDxHb3RvQW55dGhpbmcgey4uLnByb3BzfSAvPlxuICAgIDwvR290b0FueXRoaW5nUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgR290b0FueXRoaW5nV2l0aENvbnRleHRcbiJdfQ==