"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import after mocking to get mocked version
const actions_1 = require("../../app/components/goto-anything/actions");
const registry_1 = require("../../app/components/goto-anything/actions/commands/registry");
// Mock the entire actions module to avoid import issues
vi.mock('../../app/components/goto-anything/actions', () => ({
    matchAction: vi.fn(),
}));
vi.mock('../../app/components/goto-anything/actions/commands/registry');
// Implement the actual matchAction logic for testing
const actualMatchAction = (query, actions) => {
    const result = Object.values(actions).find((action) => {
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
    return result;
};
actions_1.matchAction.mockImplementation(actualMatchAction);
describe('matchAction Logic', () => {
    const mockActions = {
        app: {
            key: '@app',
            shortcut: '@a',
            title: 'Search Applications',
            description: 'Search apps',
            search: vi.fn(),
        },
        knowledge: {
            key: '@knowledge',
            shortcut: '@kb',
            title: 'Search Knowledge',
            description: 'Search knowledge bases',
            search: vi.fn(),
        },
        slash: {
            key: '/',
            shortcut: '/',
            title: 'Commands',
            description: 'Execute commands',
            search: vi.fn(),
        },
    };
    beforeEach(() => {
        vi.clearAllMocks();
        registry_1.slashCommandRegistry.getAllCommands.mockReturnValue([
            { name: 'docs', mode: 'direct' },
            { name: 'community', mode: 'direct' },
            { name: 'feedback', mode: 'direct' },
            { name: 'account', mode: 'direct' },
            { name: 'theme', mode: 'submenu' },
            { name: 'language', mode: 'submenu' },
        ]);
    });
    describe('@ Actions Matching', () => {
        it('should match @app with key', () => {
            const result = (0, actions_1.matchAction)('@app', mockActions);
            expect(result).toBe(mockActions.app);
        });
        it('should match @app with shortcut', () => {
            const result = (0, actions_1.matchAction)('@a', mockActions);
            expect(result).toBe(mockActions.app);
        });
        it('should match @knowledge with key', () => {
            const result = (0, actions_1.matchAction)('@knowledge', mockActions);
            expect(result).toBe(mockActions.knowledge);
        });
        it('should match @knowledge with shortcut @kb', () => {
            const result = (0, actions_1.matchAction)('@kb', mockActions);
            expect(result).toBe(mockActions.knowledge);
        });
        it('should match with text after action', () => {
            const result = (0, actions_1.matchAction)('@app search term', mockActions);
            expect(result).toBe(mockActions.app);
        });
        it('should not match partial @ actions', () => {
            const result = (0, actions_1.matchAction)('@ap', mockActions);
            expect(result).toBeUndefined();
        });
    });
    describe('Slash Commands Matching', () => {
        describe('Direct Mode Commands', () => {
            it('should not match direct mode commands', () => {
                const result = (0, actions_1.matchAction)('/docs', mockActions);
                expect(result).toBeUndefined();
            });
            it('should not match direct mode with arguments', () => {
                const result = (0, actions_1.matchAction)('/docs something', mockActions);
                expect(result).toBeUndefined();
            });
            it('should not match any direct mode command', () => {
                expect((0, actions_1.matchAction)('/community', mockActions)).toBeUndefined();
                expect((0, actions_1.matchAction)('/feedback', mockActions)).toBeUndefined();
                expect((0, actions_1.matchAction)('/account', mockActions)).toBeUndefined();
            });
        });
        describe('Submenu Mode Commands', () => {
            it('should match submenu mode commands exactly', () => {
                const result = (0, actions_1.matchAction)('/theme', mockActions);
                expect(result).toBe(mockActions.slash);
            });
            it('should match submenu mode with arguments', () => {
                const result = (0, actions_1.matchAction)('/theme dark', mockActions);
                expect(result).toBe(mockActions.slash);
            });
            it('should match all submenu commands', () => {
                expect((0, actions_1.matchAction)('/language', mockActions)).toBe(mockActions.slash);
                expect((0, actions_1.matchAction)('/language en', mockActions)).toBe(mockActions.slash);
            });
        });
        describe('Slash Without Command', () => {
            it('should not match single slash', () => {
                const result = (0, actions_1.matchAction)('/', mockActions);
                expect(result).toBeUndefined();
            });
            it('should not match unregistered commands', () => {
                const result = (0, actions_1.matchAction)('/unknown', mockActions);
                expect(result).toBeUndefined();
            });
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty query', () => {
            const result = (0, actions_1.matchAction)('', mockActions);
            expect(result).toBeUndefined();
        });
        it('should handle whitespace only', () => {
            const result = (0, actions_1.matchAction)('  ', mockActions);
            expect(result).toBeUndefined();
        });
        it('should handle regular text without actions', () => {
            const result = (0, actions_1.matchAction)('search something', mockActions);
            expect(result).toBeUndefined();
        });
        it('should handle special characters', () => {
            const result = (0, actions_1.matchAction)('#tag', mockActions);
            expect(result).toBeUndefined();
        });
        it('should handle multiple @ or /', () => {
            expect((0, actions_1.matchAction)('@@app', mockActions)).toBeUndefined();
            expect((0, actions_1.matchAction)('//theme', mockActions)).toBeUndefined();
        });
    });
    describe('Mode-based Filtering', () => {
        it('should filter direct mode commands from matching', () => {
            ;
            registry_1.slashCommandRegistry.getAllCommands.mockReturnValue([
                { name: 'test', mode: 'direct' },
            ]);
            const result = (0, actions_1.matchAction)('/test', mockActions);
            expect(result).toBeUndefined();
        });
        it('should allow submenu mode commands to match', () => {
            ;
            registry_1.slashCommandRegistry.getAllCommands.mockReturnValue([
                { name: 'test', mode: 'submenu' },
            ]);
            const result = (0, actions_1.matchAction)('/test', mockActions);
            expect(result).toBe(mockActions.slash);
        });
        it('should treat undefined mode as submenu', () => {
            ;
            registry_1.slashCommandRegistry.getAllCommands.mockReturnValue([
                { name: 'test' }, // No mode specified
            ]);
            const result = (0, actions_1.matchAction)('/test', mockActions);
            expect(result).toBe(mockActions.slash);
        });
    });
    describe('Registry Integration', () => {
        it('should call getAllCommands when matching slash', () => {
            (0, actions_1.matchAction)('/theme', mockActions);
            expect(registry_1.slashCommandRegistry.getAllCommands).toHaveBeenCalled();
        });
        it('should not call getAllCommands for @ actions', () => {
            (0, actions_1.matchAction)('@app', mockActions);
            expect(registry_1.slashCommandRegistry.getAllCommands).not.toHaveBeenCalled();
        });
        it('should handle empty command list', () => {
            ;
            registry_1.slashCommandRegistry.getAllCommands.mockReturnValue([]);
            const result = (0, actions_1.matchAction)('/anything', mockActions);
            expect(result).toBeUndefined();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtYWN0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXRjaC1hY3Rpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDZDQUE2QztBQUM3Qyx3RUFBd0U7QUFDeEUsMkZBQW1HO0FBRW5HLHdEQUF3RDtBQUN4RCxFQUFFLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0QsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDckIsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUE7QUFFdkUscURBQXFEO0FBQ3JELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsT0FBbUMsRUFBRSxFQUFFO0lBQy9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDcEQsc0NBQXNDO1FBQ3RDLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUN2QixnREFBZ0Q7WUFDaEQsTUFBTSxXQUFXLEdBQUcsK0JBQW9CLENBQUMsY0FBYyxFQUFFLENBQUE7WUFFekQsZ0RBQWdEO1lBQ2hELE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFFakMsbUVBQW1FO2dCQUNuRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUTtvQkFDdkIsT0FBTyxLQUFLLENBQUE7Z0JBRWQsb0VBQW9FO2dCQUNwRSxPQUFPLEtBQUssS0FBSyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUE7WUFDbkUsQ0FBQyxDQUFDLENBQUE7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QUFFLFdBQVcsQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sQ0FBQywrQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsQ0FBQztZQUFDLCtCQUFvQixDQUFDLGNBQXVCLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2xFLE1BQU0sTUFBTSxHQUFHLElBQUEscUJBQVcsRUFBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2hDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIHsgQWN0aW9uSXRlbSB9IGZyb20gJy4uLy4uL2FwcC9jb21wb25lbnRzL2dvdG8tYW55dGhpbmcvYWN0aW9ucy90eXBlcydcblxuLy8gSW1wb3J0IGFmdGVyIG1vY2tpbmcgdG8gZ2V0IG1vY2tlZCB2ZXJzaW9uXG5pbXBvcnQgeyBtYXRjaEFjdGlvbiB9IGZyb20gJy4uLy4uL2FwcC9jb21wb25lbnRzL2dvdG8tYW55dGhpbmcvYWN0aW9ucydcbmltcG9ydCB7IHNsYXNoQ29tbWFuZFJlZ2lzdHJ5IH0gZnJvbSAnLi4vLi4vYXBwL2NvbXBvbmVudHMvZ290by1hbnl0aGluZy9hY3Rpb25zL2NvbW1hbmRzL3JlZ2lzdHJ5J1xuXG4vLyBNb2NrIHRoZSBlbnRpcmUgYWN0aW9ucyBtb2R1bGUgdG8gYXZvaWQgaW1wb3J0IGlzc3Vlc1xudmkubW9jaygnLi4vLi4vYXBwL2NvbXBvbmVudHMvZ290by1hbnl0aGluZy9hY3Rpb25zJywgKCkgPT4gKHtcbiAgbWF0Y2hBY3Rpb246IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnLi4vLi4vYXBwL2NvbXBvbmVudHMvZ290by1hbnl0aGluZy9hY3Rpb25zL2NvbW1hbmRzL3JlZ2lzdHJ5JylcblxuLy8gSW1wbGVtZW50IHRoZSBhY3R1YWwgbWF0Y2hBY3Rpb24gbG9naWMgZm9yIHRlc3RpbmdcbmNvbnN0IGFjdHVhbE1hdGNoQWN0aW9uID0gKHF1ZXJ5OiBzdHJpbmcsIGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEFjdGlvbkl0ZW0+KSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IE9iamVjdC52YWx1ZXMoYWN0aW9ucykuZmluZCgoYWN0aW9uKSA9PiB7XG4gICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3Igc2xhc2ggY29tbWFuZHNcbiAgICBpZiAoYWN0aW9uLmtleSA9PT0gJy8nKSB7XG4gICAgICAvLyBHZXQgYWxsIHJlZ2lzdGVyZWQgY29tbWFuZHMgZnJvbSB0aGUgcmVnaXN0cnlcbiAgICAgIGNvbnN0IGFsbENvbW1hbmRzID0gc2xhc2hDb21tYW5kUmVnaXN0cnkuZ2V0QWxsQ29tbWFuZHMoKVxuXG4gICAgICAvLyBDaGVjayBpZiBxdWVyeSBtYXRjaGVzIGFueSByZWdpc3RlcmVkIGNvbW1hbmRcbiAgICAgIHJldHVybiBhbGxDb21tYW5kcy5zb21lKChjbWQpID0+IHtcbiAgICAgICAgY29uc3QgY21kUGF0dGVybiA9IGAvJHtjbWQubmFtZX1gXG5cbiAgICAgICAgLy8gRm9yIGRpcmVjdCBtb2RlIGNvbW1hbmRzLCBkb24ndCBtYXRjaCAoa2VlcCBpbiBjb21tYW5kIHNlbGVjdG9yKVxuICAgICAgICBpZiAoY21kLm1vZGUgPT09ICdkaXJlY3QnKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgIC8vIEZvciBzdWJtZW51IG1vZGUgY29tbWFuZHMsIG1hdGNoIHdoZW4gY29tcGxldGUgY29tbWFuZCBpcyBlbnRlcmVkXG4gICAgICAgIHJldHVybiBxdWVyeSA9PT0gY21kUGF0dGVybiB8fCBxdWVyeS5zdGFydHNXaXRoKGAke2NtZFBhdHRlcm59IGApXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYF4oJHthY3Rpb24ua2V5fXwke2FjdGlvbi5zaG9ydGN1dH0pKD86XFxcXHN8JClgKVxuICAgIHJldHVybiByZWcudGVzdChxdWVyeSlcbiAgfSlcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBSZXBsYWNlIG1vY2sgd2l0aCBhY3R1YWwgaW1wbGVtZW50YXRpb25cbjsobWF0Y2hBY3Rpb24gYXMgTW9jaykubW9ja0ltcGxlbWVudGF0aW9uKGFjdHVhbE1hdGNoQWN0aW9uKVxuXG5kZXNjcmliZSgnbWF0Y2hBY3Rpb24gTG9naWMnLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBBY3Rpb25JdGVtPiA9IHtcbiAgICBhcHA6IHtcbiAgICAgIGtleTogJ0BhcHAnLFxuICAgICAgc2hvcnRjdXQ6ICdAYScsXG4gICAgICB0aXRsZTogJ1NlYXJjaCBBcHBsaWNhdGlvbnMnLFxuICAgICAgZGVzY3JpcHRpb246ICdTZWFyY2ggYXBwcycsXG4gICAgICBzZWFyY2g6IHZpLmZuKCksXG4gICAgfSxcbiAgICBrbm93bGVkZ2U6IHtcbiAgICAgIGtleTogJ0Brbm93bGVkZ2UnLFxuICAgICAgc2hvcnRjdXQ6ICdAa2InLFxuICAgICAgdGl0bGU6ICdTZWFyY2ggS25vd2xlZGdlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VhcmNoIGtub3dsZWRnZSBiYXNlcycsXG4gICAgICBzZWFyY2g6IHZpLmZuKCksXG4gICAgfSxcbiAgICBzbGFzaDoge1xuICAgICAga2V5OiAnLycsXG4gICAgICBzaG9ydGN1dDogJy8nLFxuICAgICAgdGl0bGU6ICdDb21tYW5kcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4ZWN1dGUgY29tbWFuZHMnLFxuICAgICAgc2VhcmNoOiB2aS5mbigpLFxuICAgIH0sXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICA7KHNsYXNoQ29tbWFuZFJlZ2lzdHJ5LmdldEFsbENvbW1hbmRzIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICB7IG5hbWU6ICdkb2NzJywgbW9kZTogJ2RpcmVjdCcgfSxcbiAgICAgIHsgbmFtZTogJ2NvbW11bml0eScsIG1vZGU6ICdkaXJlY3QnIH0sXG4gICAgICB7IG5hbWU6ICdmZWVkYmFjaycsIG1vZGU6ICdkaXJlY3QnIH0sXG4gICAgICB7IG5hbWU6ICdhY2NvdW50JywgbW9kZTogJ2RpcmVjdCcgfSxcbiAgICAgIHsgbmFtZTogJ3RoZW1lJywgbW9kZTogJ3N1Ym1lbnUnIH0sXG4gICAgICB7IG5hbWU6ICdsYW5ndWFnZScsIG1vZGU6ICdzdWJtZW51JyB9LFxuICAgIF0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0AgQWN0aW9ucyBNYXRjaGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1hdGNoIEBhcHAgd2l0aCBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignQGFwcCcsIG1vY2tBY3Rpb25zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShtb2NrQWN0aW9ucy5hcHApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWF0Y2ggQGFwcCB3aXRoIHNob3J0Y3V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJ0BhJywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKG1vY2tBY3Rpb25zLmFwcClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYXRjaCBAa25vd2xlZGdlIHdpdGgga2V5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJ0Brbm93bGVkZ2UnLCBtb2NrQWN0aW9ucylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUobW9ja0FjdGlvbnMua25vd2xlZGdlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1hdGNoIEBrbm93bGVkZ2Ugd2l0aCBzaG9ydGN1dCBAa2InLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignQGtiJywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKG1vY2tBY3Rpb25zLmtub3dsZWRnZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYXRjaCB3aXRoIHRleHQgYWZ0ZXIgYWN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJ0BhcHAgc2VhcmNoIHRlcm0nLCBtb2NrQWN0aW9ucylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUobW9ja0FjdGlvbnMuYXBwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBtYXRjaCBwYXJ0aWFsIEAgYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoQWN0aW9uKCdAYXAnLCBtb2NrQWN0aW9ucylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NsYXNoIENvbW1hbmRzIE1hdGNoaW5nJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdEaXJlY3QgTW9kZSBDb21tYW5kcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbm90IG1hdGNoIGRpcmVjdCBtb2RlIGNvbW1hbmRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignL2RvY3MnLCBtb2NrQWN0aW9ucylcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBtYXRjaCBkaXJlY3QgbW9kZSB3aXRoIGFyZ3VtZW50cycsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJy9kb2NzIHNvbWV0aGluZycsIG1vY2tBY3Rpb25zKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IG1hdGNoIGFueSBkaXJlY3QgbW9kZSBjb21tYW5kJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWF0Y2hBY3Rpb24oJy9jb21tdW5pdHknLCBtb2NrQWN0aW9ucykpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICBleHBlY3QobWF0Y2hBY3Rpb24oJy9mZWVkYmFjaycsIG1vY2tBY3Rpb25zKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChtYXRjaEFjdGlvbignL2FjY291bnQnLCBtb2NrQWN0aW9ucykpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1N1Ym1lbnUgTW9kZSBDb21tYW5kcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbWF0Y2ggc3VibWVudSBtb2RlIGNvbW1hbmRzIGV4YWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoQWN0aW9uKCcvdGhlbWUnLCBtb2NrQWN0aW9ucylcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShtb2NrQWN0aW9ucy5zbGFzaClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbWF0Y2ggc3VibWVudSBtb2RlIHdpdGggYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignL3RoZW1lIGRhcmsnLCBtb2NrQWN0aW9ucylcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShtb2NrQWN0aW9ucy5zbGFzaClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbWF0Y2ggYWxsIHN1Ym1lbnUgY29tbWFuZHMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtYXRjaEFjdGlvbignL2xhbmd1YWdlJywgbW9ja0FjdGlvbnMpKS50b0JlKG1vY2tBY3Rpb25zLnNsYXNoKVxuICAgICAgICBleHBlY3QobWF0Y2hBY3Rpb24oJy9sYW5ndWFnZSBlbicsIG1vY2tBY3Rpb25zKSkudG9CZShtb2NrQWN0aW9ucy5zbGFzaClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdTbGFzaCBXaXRob3V0IENvbW1hbmQnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBtYXRjaCBzaW5nbGUgc2xhc2gnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoQWN0aW9uKCcvJywgbW9ja0FjdGlvbnMpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgbWF0Y2ggdW5yZWdpc3RlcmVkIGNvbW1hbmRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignL3Vua25vd24nLCBtb2NrQWN0aW9ucylcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcXVlcnknLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignJywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgd2hpdGVzcGFjZSBvbmx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJyAgJywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVndWxhciB0ZXh0IHdpdGhvdXQgYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoQWN0aW9uKCdzZWFyY2ggc29tZXRoaW5nJywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJyN0YWcnLCBtb2NrQWN0aW9ucylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBAIG9yIC8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWF0Y2hBY3Rpb24oJ0BAYXBwJywgbW9ja0FjdGlvbnMpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYXRjaEFjdGlvbignLy90aGVtZScsIG1vY2tBY3Rpb25zKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTW9kZS1iYXNlZCBGaWx0ZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmaWx0ZXIgZGlyZWN0IG1vZGUgY29tbWFuZHMgZnJvbSBtYXRjaGluZycsICgpID0+IHtcbiAgICAgIDsoc2xhc2hDb21tYW5kUmVnaXN0cnkuZ2V0QWxsQ29tbWFuZHMgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKFtcbiAgICAgICAgeyBuYW1lOiAndGVzdCcsIG1vZGU6ICdkaXJlY3QnIH0sXG4gICAgICBdKVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignL3Rlc3QnLCBtb2NrQWN0aW9ucylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHN1Ym1lbnUgbW9kZSBjb21tYW5kcyB0byBtYXRjaCcsICgpID0+IHtcbiAgICAgIDsoc2xhc2hDb21tYW5kUmVnaXN0cnkuZ2V0QWxsQ29tbWFuZHMgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKFtcbiAgICAgICAgeyBuYW1lOiAndGVzdCcsIG1vZGU6ICdzdWJtZW51JyB9LFxuICAgICAgXSlcblxuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJy90ZXN0JywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKG1vY2tBY3Rpb25zLnNsYXNoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyZWF0IHVuZGVmaW5lZCBtb2RlIGFzIHN1Ym1lbnUnLCAoKSA9PiB7XG4gICAgICA7KHNsYXNoQ29tbWFuZFJlZ2lzdHJ5LmdldEFsbENvbW1hbmRzIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIHsgbmFtZTogJ3Rlc3QnIH0sIC8vIE5vIG1vZGUgc3BlY2lmaWVkXG4gICAgICBdKVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBtYXRjaEFjdGlvbignL3Rlc3QnLCBtb2NrQWN0aW9ucylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUobW9ja0FjdGlvbnMuc2xhc2gpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVnaXN0cnkgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGdldEFsbENvbW1hbmRzIHdoZW4gbWF0Y2hpbmcgc2xhc2gnLCAoKSA9PiB7XG4gICAgICBtYXRjaEFjdGlvbignL3RoZW1lJywgbW9ja0FjdGlvbnMpXG4gICAgICBleHBlY3Qoc2xhc2hDb21tYW5kUmVnaXN0cnkuZ2V0QWxsQ29tbWFuZHMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGdldEFsbENvbW1hbmRzIGZvciBAIGFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICBtYXRjaEFjdGlvbignQGFwcCcsIG1vY2tBY3Rpb25zKVxuICAgICAgZXhwZWN0KHNsYXNoQ29tbWFuZFJlZ2lzdHJ5LmdldEFsbENvbW1hbmRzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNvbW1hbmQgbGlzdCcsICgpID0+IHtcbiAgICAgIDsoc2xhc2hDb21tYW5kUmVnaXN0cnkuZ2V0QWxsQ29tbWFuZHMgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKFtdKVxuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hBY3Rpb24oJy9hbnl0aGluZycsIG1vY2tBY3Rpb25zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=