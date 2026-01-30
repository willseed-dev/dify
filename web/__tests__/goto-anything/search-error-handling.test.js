"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test GotoAnything search error handling mechanisms
 *
 * Main validations:
 * 1. @plugin search error handling when API fails
 * 2. Regular search (without @prefix) error handling when API fails
 * 3. Verify consistent error handling across different search types
 * 4. Ensure errors don't propagate to UI layer causing "search failed"
 */
const actions_1 = require("@/app/components/goto-anything/actions");
const apps_1 = require("@/service/apps");
const base_1 = require("@/service/base");
const datasets_1 = require("@/service/datasets");
// Mock react-i18next before importing modules that use it
vi.mock('react-i18next', () => ({
    getI18n: () => ({
        t: (key) => key,
        language: 'en',
    }),
}));
// Mock API functions
vi.mock('@/service/base', () => ({
    postMarketplace: vi.fn(),
}));
vi.mock('@/service/apps', () => ({
    fetchAppList: vi.fn(),
}));
vi.mock('@/service/datasets', () => ({
    fetchDatasets: vi.fn(),
}));
const mockPostMarketplace = base_1.postMarketplace;
const mockFetchAppList = apps_1.fetchAppList;
const mockFetchDatasets = datasets_1.fetchDatasets;
describe('GotoAnything Search Error Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Suppress console.warn for clean test output
        vi.spyOn(console, 'warn').mockImplementation(() => {
            // Suppress console.warn for clean test output
        });
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('@plugin search error handling', () => {
        it('should return empty array when API fails instead of throwing error', async () => {
            // Mock marketplace API failure (403 permission denied)
            mockPostMarketplace.mockRejectedValue(new Error('HTTP 403: Forbidden'));
            const pluginAction = actions_1.Actions.plugin;
            // Directly call plugin action's search method
            const result = await pluginAction.search('@plugin', 'test', 'en');
            // Should return empty array instead of throwing error
            expect(result).toEqual([]);
            expect(mockPostMarketplace).toHaveBeenCalledWith('/plugins/search/advanced', {
                body: {
                    page: 1,
                    page_size: 10,
                    query: 'test',
                    type: 'plugin',
                },
            });
        });
        it('should return empty array when user has no plugin data', async () => {
            // Mock marketplace returning empty data
            mockPostMarketplace.mockResolvedValue({
                data: { plugins: [] },
            });
            const pluginAction = actions_1.Actions.plugin;
            const result = await pluginAction.search('@plugin', '', 'en');
            expect(result).toEqual([]);
        });
        it('should return empty array when API returns unexpected data structure', async () => {
            // Mock API returning unexpected data structure
            mockPostMarketplace.mockResolvedValue({
                data: null,
            });
            const pluginAction = actions_1.Actions.plugin;
            const result = await pluginAction.search('@plugin', 'test', 'en');
            expect(result).toEqual([]);
        });
    });
    describe('Other search types error handling', () => {
        it('@app search should return empty array when API fails', async () => {
            // Mock app API failure
            mockFetchAppList.mockRejectedValue(new Error('API Error'));
            const appAction = actions_1.Actions.app;
            const result = await appAction.search('@app', 'test', 'en');
            expect(result).toEqual([]);
        });
        it('@knowledge search should return empty array when API fails', async () => {
            // Mock knowledge API failure
            mockFetchDatasets.mockRejectedValue(new Error('API Error'));
            const knowledgeAction = actions_1.Actions.knowledge;
            const result = await knowledgeAction.search('@knowledge', 'test', 'en');
            expect(result).toEqual([]);
        });
    });
    describe('Unified search entry error handling', () => {
        it('regular search (without @prefix) should return successful results even when partial APIs fail', async () => {
            // Set app and knowledge success, plugin failure
            mockFetchAppList.mockResolvedValue({ data: [], has_more: false, limit: 10, page: 1, total: 0 });
            mockFetchDatasets.mockResolvedValue({ data: [], has_more: false, limit: 10, page: 1, total: 0 });
            mockPostMarketplace.mockRejectedValue(new Error('Plugin API failed'));
            const result = await (0, actions_1.searchAnything)('en', 'test');
            // Should return successful results even if plugin search fails
            expect(result).toEqual([]);
            expect(console.warn).toHaveBeenCalledWith('Plugin search failed:', expect.any(Error));
        });
        it('@plugin dedicated search should return empty array when API fails', async () => {
            // Mock plugin API failure
            mockPostMarketplace.mockRejectedValue(new Error('Plugin service unavailable'));
            const pluginAction = actions_1.Actions.plugin;
            const result = await (0, actions_1.searchAnything)('en', '@plugin test', pluginAction);
            // Should return empty array instead of throwing error
            expect(result).toEqual([]);
        });
        it('@app dedicated search should return empty array when API fails', async () => {
            // Mock app API failure
            mockFetchAppList.mockRejectedValue(new Error('App service unavailable'));
            const appAction = actions_1.Actions.app;
            const result = await (0, actions_1.searchAnything)('en', '@app test', appAction);
            expect(result).toEqual([]);
        });
    });
    describe('Error handling consistency validation', () => {
        it('all search types should return empty array when encountering errors', async () => {
            // Mock all APIs to fail
            mockPostMarketplace.mockRejectedValue(new Error('Plugin API failed'));
            mockFetchAppList.mockRejectedValue(new Error('App API failed'));
            mockFetchDatasets.mockRejectedValue(new Error('Dataset API failed'));
            const actions = [
                { name: '@plugin', action: actions_1.Actions.plugin },
                { name: '@app', action: actions_1.Actions.app },
                { name: '@knowledge', action: actions_1.Actions.knowledge },
            ];
            for (const { name, action } of actions) {
                const result = await action.search(name, 'test', 'en');
                expect(result).toEqual([]);
            }
        });
    });
    describe('Edge case testing', () => {
        it('empty search term should be handled properly', async () => {
            mockPostMarketplace.mockResolvedValue({ data: { plugins: [] } });
            const result = await (0, actions_1.searchAnything)('en', '@plugin ', actions_1.Actions.plugin);
            expect(result).toEqual([]);
        });
        it('network timeout should be handled correctly', async () => {
            const timeoutError = new Error('Network timeout');
            timeoutError.name = 'TimeoutError';
            mockPostMarketplace.mockRejectedValue(timeoutError);
            const result = await (0, actions_1.searchAnything)('en', '@plugin test', actions_1.Actions.plugin);
            expect(result).toEqual([]);
        });
        it('JSON parsing errors should be handled correctly', async () => {
            const parseError = new SyntaxError('Unexpected token in JSON');
            mockPostMarketplace.mockRejectedValue(parseError);
            const result = await (0, actions_1.searchAnything)('en', '@plugin test', actions_1.Actions.plugin);
            expect(result).toEqual([]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLWVycm9yLWhhbmRsaW5nLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWFyY2gtZXJyb3ItaGFuZGxpbmcudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBOzs7Ozs7OztHQVFHO0FBRUgsb0VBQWdGO0FBQ2hGLHlDQUE2QztBQUM3Qyx5Q0FBZ0Q7QUFDaEQsaURBQWtEO0FBRWxELDBEQUEwRDtBQUMxRCxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ3ZCLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgscUJBQXFCO0FBQ3JCLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQixlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUN6QixDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQixZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUN0QixDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUN2QixDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sbUJBQW1CLEdBQUcsc0JBQXlELENBQUE7QUFDckYsTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUQsQ0FBQTtBQUM1RSxNQUFNLGlCQUFpQixHQUFHLHdCQUFxRCxDQUFBO0FBRS9FLFFBQVEsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7SUFDbEQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQiw4Q0FBOEM7UUFDOUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFO1lBQ2hELDhDQUE4QztRQUNoRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUN0QixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDN0MsRUFBRSxDQUFDLG9FQUFvRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xGLHVEQUF1RDtZQUN2RCxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7WUFFdkUsTUFBTSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLENBQUE7WUFFbkMsOENBQThDO1lBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRWpFLHNEQUFzRDtZQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzFCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixFQUFFO2dCQUMzRSxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLENBQUM7b0JBQ1AsU0FBUyxFQUFFLEVBQUU7b0JBQ2IsS0FBSyxFQUFFLE1BQU07b0JBQ2IsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN0RSx3Q0FBd0M7WUFDeEMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7YUFDdEIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLENBQUE7WUFDbkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFN0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzRUFBc0UsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNwRiwrQ0FBK0M7WUFDL0MsbUJBQW1CLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQyxDQUFBO1lBRUYsTUFBTSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLENBQUE7WUFDbkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFakUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxFQUFFLENBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEUsdUJBQXVCO1lBQ3ZCLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7WUFFMUQsTUFBTSxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUE7WUFDN0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFM0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRSw2QkFBNkI7WUFDN0IsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtZQUUzRCxNQUFNLGVBQWUsR0FBRyxpQkFBTyxDQUFDLFNBQVMsQ0FBQTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQWUsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUV2RSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELEVBQUUsQ0FBQywrRkFBK0YsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM3RyxnREFBZ0Q7WUFDaEQsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQy9GLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNoRyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7WUFFckUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBRWpELCtEQUErRDtZQUMvRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsb0JBQW9CLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ3ZGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pGLDBCQUEwQjtZQUMxQixtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUE7WUFFOUUsTUFBTSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLENBQUE7WUFDbkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQTtZQUV2RSxzREFBc0Q7WUFDdEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5RSx1QkFBdUI7WUFDdkIsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFBO1lBRXhFLE1BQU0sU0FBUyxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFBO1lBQzdCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSx3QkFBYyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUE7WUFFakUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNyRCxFQUFFLENBQUMscUVBQXFFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbkYsd0JBQXdCO1lBQ3hCLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtZQUNyRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFDL0QsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO1lBRXBFLE1BQU0sT0FBTyxHQUFHO2dCQUNkLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQzNDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsaUJBQU8sQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsaUJBQU8sQ0FBQyxTQUFTLEVBQUU7YUFDbEQsQ0FBQTtZQUVELEtBQUssTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ3RELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RCxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFaEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDM0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUNqRCxZQUFZLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQTtZQUVsQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUVuRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsd0JBQWMsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDekUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMvRCxNQUFNLFVBQVUsR0FBRyxJQUFJLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1lBQzlELG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBRWpELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSx3QkFBYyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN6RSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9ja2VkRnVuY3Rpb24gfSBmcm9tICd2aXRlc3QnXG4vKipcbiAqIFRlc3QgR290b0FueXRoaW5nIHNlYXJjaCBlcnJvciBoYW5kbGluZyBtZWNoYW5pc21zXG4gKlxuICogTWFpbiB2YWxpZGF0aW9uczpcbiAqIDEuIEBwbHVnaW4gc2VhcmNoIGVycm9yIGhhbmRsaW5nIHdoZW4gQVBJIGZhaWxzXG4gKiAyLiBSZWd1bGFyIHNlYXJjaCAod2l0aG91dCBAcHJlZml4KSBlcnJvciBoYW5kbGluZyB3aGVuIEFQSSBmYWlsc1xuICogMy4gVmVyaWZ5IGNvbnNpc3RlbnQgZXJyb3IgaGFuZGxpbmcgYWNyb3NzIGRpZmZlcmVudCBzZWFyY2ggdHlwZXNcbiAqIDQuIEVuc3VyZSBlcnJvcnMgZG9uJ3QgcHJvcGFnYXRlIHRvIFVJIGxheWVyIGNhdXNpbmcgXCJzZWFyY2ggZmFpbGVkXCJcbiAqL1xuXG5pbXBvcnQgeyBBY3Rpb25zLCBzZWFyY2hBbnl0aGluZyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZ290by1hbnl0aGluZy9hY3Rpb25zJ1xuaW1wb3J0IHsgZmV0Y2hBcHBMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL2FwcHMnXG5pbXBvcnQgeyBwb3N0TWFya2V0cGxhY2UgfSBmcm9tICdAL3NlcnZpY2UvYmFzZSdcbmltcG9ydCB7IGZldGNoRGF0YXNldHMgfSBmcm9tICdAL3NlcnZpY2UvZGF0YXNldHMnXG5cbi8vIE1vY2sgcmVhY3QtaTE4bmV4dCBiZWZvcmUgaW1wb3J0aW5nIG1vZHVsZXMgdGhhdCB1c2UgaXRcbnZpLm1vY2soJ3JlYWN0LWkxOG5leHQnLCAoKSA9PiAoe1xuICBnZXRJMThuOiAoKSA9PiAoe1xuICAgIHQ6IChrZXk6IHN0cmluZykgPT4ga2V5LFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIEFQSSBmdW5jdGlvbnNcbnZpLm1vY2soJ0Avc2VydmljZS9iYXNlJywgKCkgPT4gKHtcbiAgcG9zdE1hcmtldHBsYWNlOiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9hcHBzJywgKCkgPT4gKHtcbiAgZmV0Y2hBcHBMaXN0OiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9kYXRhc2V0cycsICgpID0+ICh7XG4gIGZldGNoRGF0YXNldHM6IHZpLmZuKCksXG59KSlcblxuY29uc3QgbW9ja1Bvc3RNYXJrZXRwbGFjZSA9IHBvc3RNYXJrZXRwbGFjZSBhcyBNb2NrZWRGdW5jdGlvbjx0eXBlb2YgcG9zdE1hcmtldHBsYWNlPlxuY29uc3QgbW9ja0ZldGNoQXBwTGlzdCA9IGZldGNoQXBwTGlzdCBhcyBNb2NrZWRGdW5jdGlvbjx0eXBlb2YgZmV0Y2hBcHBMaXN0PlxuY29uc3QgbW9ja0ZldGNoRGF0YXNldHMgPSBmZXRjaERhdGFzZXRzIGFzIE1vY2tlZEZ1bmN0aW9uPHR5cGVvZiBmZXRjaERhdGFzZXRzPlxuXG5kZXNjcmliZSgnR290b0FueXRoaW5nIFNlYXJjaCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgLy8gU3VwcHJlc3MgY29uc29sZS53YXJuIGZvciBjbGVhbiB0ZXN0IG91dHB1dFxuICAgIHZpLnNweU9uKGNvbnNvbGUsICd3YXJuJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgIC8vIFN1cHByZXNzIGNvbnNvbGUud2FybiBmb3IgY2xlYW4gdGVzdCBvdXRwdXRcbiAgICB9KVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgdmkucmVzdG9yZUFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnQHBsdWdpbiBzZWFyY2ggZXJyb3IgaGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBBUEkgZmFpbHMgaW5zdGVhZCBvZiB0aHJvd2luZyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIE1vY2sgbWFya2V0cGxhY2UgQVBJIGZhaWx1cmUgKDQwMyBwZXJtaXNzaW9uIGRlbmllZClcbiAgICAgIG1vY2tQb3N0TWFya2V0cGxhY2UubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdIVFRQIDQwMzogRm9yYmlkZGVuJykpXG5cbiAgICAgIGNvbnN0IHBsdWdpbkFjdGlvbiA9IEFjdGlvbnMucGx1Z2luXG5cbiAgICAgIC8vIERpcmVjdGx5IGNhbGwgcGx1Z2luIGFjdGlvbidzIHNlYXJjaCBtZXRob2RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBsdWdpbkFjdGlvbi5zZWFyY2goJ0BwbHVnaW4nLCAndGVzdCcsICdlbicpXG5cbiAgICAgIC8vIFNob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgaW5zdGVhZCBvZiB0aHJvd2luZyBlcnJvclxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICAgIGV4cGVjdChtb2NrUG9zdE1hcmtldHBsYWNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL3BsdWdpbnMvc2VhcmNoL2FkdmFuY2VkJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICAgIHF1ZXJ5OiAndGVzdCcsXG4gICAgICAgICAgdHlwZTogJ3BsdWdpbicsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIHVzZXIgaGFzIG5vIHBsdWdpbiBkYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gTW9jayBtYXJrZXRwbGFjZSByZXR1cm5pbmcgZW1wdHkgZGF0YVxuICAgICAgbW9ja1Bvc3RNYXJrZXRwbGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcGx1Z2luczogW10gfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBsdWdpbkFjdGlvbiA9IEFjdGlvbnMucGx1Z2luXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwbHVnaW5BY3Rpb24uc2VhcmNoKCdAcGx1Z2luJywgJycsICdlbicpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IHdoZW4gQVBJIHJldHVybnMgdW5leHBlY3RlZCBkYXRhIHN0cnVjdHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIE1vY2sgQVBJIHJldHVybmluZyB1bmV4cGVjdGVkIGRhdGEgc3RydWN0dXJlXG4gICAgICBtb2NrUG9zdE1hcmtldHBsYWNlLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBsdWdpbkFjdGlvbiA9IEFjdGlvbnMucGx1Z2luXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwbHVnaW5BY3Rpb24uc2VhcmNoKCdAcGx1Z2luJywgJ3Rlc3QnLCAnZW4nKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtdKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ090aGVyIHNlYXJjaCB0eXBlcyBlcnJvciBoYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnQGFwcCBzZWFyY2ggc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIEFQSSBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIE1vY2sgYXBwIEFQSSBmYWlsdXJlXG4gICAgICBtb2NrRmV0Y2hBcHBMaXN0Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignQVBJIEVycm9yJykpXG5cbiAgICAgIGNvbnN0IGFwcEFjdGlvbiA9IEFjdGlvbnMuYXBwXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcHBBY3Rpb24uc2VhcmNoKCdAYXBwJywgJ3Rlc3QnLCAnZW4nKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnQGtub3dsZWRnZSBzZWFyY2ggc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIEFQSSBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIE1vY2sga25vd2xlZGdlIEFQSSBmYWlsdXJlXG4gICAgICBtb2NrRmV0Y2hEYXRhc2V0cy5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuXG4gICAgICBjb25zdCBrbm93bGVkZ2VBY3Rpb24gPSBBY3Rpb25zLmtub3dsZWRnZVxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQga25vd2xlZGdlQWN0aW9uLnNlYXJjaCgnQGtub3dsZWRnZScsICd0ZXN0JywgJ2VuJylcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVbmlmaWVkIHNlYXJjaCBlbnRyeSBlcnJvciBoYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgncmVndWxhciBzZWFyY2ggKHdpdGhvdXQgQHByZWZpeCkgc2hvdWxkIHJldHVybiBzdWNjZXNzZnVsIHJlc3VsdHMgZXZlbiB3aGVuIHBhcnRpYWwgQVBJcyBmYWlsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gU2V0IGFwcCBhbmQga25vd2xlZGdlIHN1Y2Nlc3MsIHBsdWdpbiBmYWlsdXJlXG4gICAgICBtb2NrRmV0Y2hBcHBMaXN0Lm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogW10sIGhhc19tb3JlOiBmYWxzZSwgbGltaXQ6IDEwLCBwYWdlOiAxLCB0b3RhbDogMCB9KVxuICAgICAgbW9ja0ZldGNoRGF0YXNldHMubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSwgaGFzX21vcmU6IGZhbHNlLCBsaW1pdDogMTAsIHBhZ2U6IDEsIHRvdGFsOiAwIH0pXG4gICAgICBtb2NrUG9zdE1hcmtldHBsYWNlLm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignUGx1Z2luIEFQSSBmYWlsZWQnKSlcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2VhcmNoQW55dGhpbmcoJ2VuJywgJ3Rlc3QnKVxuXG4gICAgICAvLyBTaG91bGQgcmV0dXJuIHN1Y2Nlc3NmdWwgcmVzdWx0cyBldmVuIGlmIHBsdWdpbiBzZWFyY2ggZmFpbHNcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG4gICAgICBleHBlY3QoY29uc29sZS53YXJuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUGx1Z2luIHNlYXJjaCBmYWlsZWQ6JywgZXhwZWN0LmFueShFcnJvcikpXG4gICAgfSlcblxuICAgIGl0KCdAcGx1Z2luIGRlZGljYXRlZCBzZWFyY2ggc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIEFQSSBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIE1vY2sgcGx1Z2luIEFQSSBmYWlsdXJlXG4gICAgICBtb2NrUG9zdE1hcmtldHBsYWNlLm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignUGx1Z2luIHNlcnZpY2UgdW5hdmFpbGFibGUnKSlcblxuICAgICAgY29uc3QgcGx1Z2luQWN0aW9uID0gQWN0aW9ucy5wbHVnaW5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNlYXJjaEFueXRoaW5nKCdlbicsICdAcGx1Z2luIHRlc3QnLCBwbHVnaW5BY3Rpb24pXG5cbiAgICAgIC8vIFNob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgaW5zdGVhZCBvZiB0aHJvd2luZyBlcnJvclxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ0BhcHAgZGVkaWNhdGVkIHNlYXJjaCBzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IHdoZW4gQVBJIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gTW9jayBhcHAgQVBJIGZhaWx1cmVcbiAgICAgIG1vY2tGZXRjaEFwcExpc3QubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdBcHAgc2VydmljZSB1bmF2YWlsYWJsZScpKVxuXG4gICAgICBjb25zdCBhcHBBY3Rpb24gPSBBY3Rpb25zLmFwcFxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2VhcmNoQW55dGhpbmcoJ2VuJywgJ0BhcHAgdGVzdCcsIGFwcEFjdGlvbilcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFcnJvciBoYW5kbGluZyBjb25zaXN0ZW5jeSB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdhbGwgc2VhcmNoIHR5cGVzIHNob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBlbmNvdW50ZXJpbmcgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gTW9jayBhbGwgQVBJcyB0byBmYWlsXG4gICAgICBtb2NrUG9zdE1hcmtldHBsYWNlLm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignUGx1Z2luIEFQSSBmYWlsZWQnKSlcbiAgICAgIG1vY2tGZXRjaEFwcExpc3QubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdBcHAgQVBJIGZhaWxlZCcpKVxuICAgICAgbW9ja0ZldGNoRGF0YXNldHMubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdEYXRhc2V0IEFQSSBmYWlsZWQnKSlcblxuICAgICAgY29uc3QgYWN0aW9ucyA9IFtcbiAgICAgICAgeyBuYW1lOiAnQHBsdWdpbicsIGFjdGlvbjogQWN0aW9ucy5wbHVnaW4gfSxcbiAgICAgICAgeyBuYW1lOiAnQGFwcCcsIGFjdGlvbjogQWN0aW9ucy5hcHAgfSxcbiAgICAgICAgeyBuYW1lOiAnQGtub3dsZWRnZScsIGFjdGlvbjogQWN0aW9ucy5rbm93bGVkZ2UgfSxcbiAgICAgIF1cblxuICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGFjdGlvbiB9IG9mIGFjdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYWN0aW9uLnNlYXJjaChuYW1lLCAndGVzdCcsICdlbicpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBjYXNlIHRlc3RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ2VtcHR5IHNlYXJjaCB0ZXJtIHNob3VsZCBiZSBoYW5kbGVkIHByb3Blcmx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1Bvc3RNYXJrZXRwbGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IHsgcGx1Z2luczogW10gfSB9KVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzZWFyY2hBbnl0aGluZygnZW4nLCAnQHBsdWdpbiAnLCBBY3Rpb25zLnBsdWdpbilcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCduZXR3b3JrIHRpbWVvdXQgc2hvdWxkIGJlIGhhbmRsZWQgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGltZW91dEVycm9yID0gbmV3IEVycm9yKCdOZXR3b3JrIHRpbWVvdXQnKVxuICAgICAgdGltZW91dEVycm9yLm5hbWUgPSAnVGltZW91dEVycm9yJ1xuXG4gICAgICBtb2NrUG9zdE1hcmtldHBsYWNlLm1vY2tSZWplY3RlZFZhbHVlKHRpbWVvdXRFcnJvcilcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2VhcmNoQW55dGhpbmcoJ2VuJywgJ0BwbHVnaW4gdGVzdCcsIEFjdGlvbnMucGx1Z2luKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ0pTT04gcGFyc2luZyBlcnJvcnMgc2hvdWxkIGJlIGhhbmRsZWQgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGFyc2VFcnJvciA9IG5ldyBTeW50YXhFcnJvcignVW5leHBlY3RlZCB0b2tlbiBpbiBKU09OJylcbiAgICAgIG1vY2tQb3N0TWFya2V0cGxhY2UubW9ja1JlamVjdGVkVmFsdWUocGFyc2VFcnJvcilcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2VhcmNoQW55dGhpbmcoJ2VuJywgJ0BwbHVnaW4gdGVzdCcsIEFjdGlvbnMucGx1Z2luKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==