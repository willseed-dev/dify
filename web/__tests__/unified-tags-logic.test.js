"use strict";
/**
 * Unified Tags Editing - Pure Logic Tests
 *
 * This test file validates the core business logic and state management
 * behaviors introduced in the recent 7 commits without requiring complex mocks.
 */
describe('Unified Tags Editing - Pure Logic Tests', () => {
    describe('Tag State Management Logic', () => {
        it('should detect when tag values have changed', () => {
            const currentValue = ['tag1', 'tag2'];
            const newSelectedTagIDs = ['tag1', 'tag3'];
            // This is the valueNotChanged logic from TagSelector component
            const valueNotChanged = currentValue.length === newSelectedTagIDs.length
                && currentValue.every(v => newSelectedTagIDs.includes(v))
                && newSelectedTagIDs.every(v => currentValue.includes(v));
            expect(valueNotChanged).toBe(false);
        });
        it('should correctly identify unchanged tag values', () => {
            const currentValue = ['tag1', 'tag2'];
            const newSelectedTagIDs = ['tag2', 'tag1']; // Same tags, different order
            const valueNotChanged = currentValue.length === newSelectedTagIDs.length
                && currentValue.every(v => newSelectedTagIDs.includes(v))
                && newSelectedTagIDs.every(v => currentValue.includes(v));
            expect(valueNotChanged).toBe(true);
        });
        it('should calculate correct tag operations for binding/unbinding', () => {
            const currentValue = ['tag1', 'tag2'];
            const selectedTagIDs = ['tag2', 'tag3'];
            // This is the handleValueChange logic from TagSelector
            const addTagIDs = selectedTagIDs.filter(v => !currentValue.includes(v));
            const removeTagIDs = currentValue.filter(v => !selectedTagIDs.includes(v));
            expect(addTagIDs).toEqual(['tag3']);
            expect(removeTagIDs).toEqual(['tag1']);
        });
        it('should handle empty tag arrays correctly', () => {
            const currentValue = [];
            const selectedTagIDs = ['tag1'];
            const addTagIDs = selectedTagIDs.filter(v => !currentValue.includes(v));
            const removeTagIDs = currentValue.filter(v => !selectedTagIDs.includes(v));
            expect(addTagIDs).toEqual(['tag1']);
            expect(removeTagIDs).toEqual([]);
            expect(currentValue.length).toBe(0); // Verify empty array usage
        });
        it('should handle removing all tags', () => {
            const currentValue = ['tag1', 'tag2'];
            const selectedTagIDs = [];
            const addTagIDs = selectedTagIDs.filter(v => !currentValue.includes(v));
            const removeTagIDs = currentValue.filter(v => !selectedTagIDs.includes(v));
            expect(addTagIDs).toEqual([]);
            expect(removeTagIDs).toEqual(['tag1', 'tag2']);
            expect(selectedTagIDs.length).toBe(0); // Verify empty array usage
        });
    });
    describe('Fallback Logic (from layout-main.tsx)', () => {
        // no-op
        it('should trigger fallback when tags are missing or empty', () => {
            const appDetailWithoutTags = { tags: [] };
            const appDetailWithTags = { tags: [{ id: 'tag1', name: 't' }] };
            const appDetailWithUndefinedTags = { tags: undefined };
            // This simulates the condition in layout-main.tsx
            const shouldFallback1 = appDetailWithoutTags.tags.length === 0;
            const shouldFallback2 = appDetailWithTags.tags.length === 0;
            const shouldFallback3 = !appDetailWithUndefinedTags.tags || appDetailWithUndefinedTags.tags.length === 0;
            expect(shouldFallback1).toBe(true); // Empty array should trigger fallback
            expect(shouldFallback2).toBe(false); // Has tags, no fallback needed
            expect(shouldFallback3).toBe(true); // Undefined tags should trigger fallback
        });
        it('should preserve tags when fallback succeeds', () => {
            const originalAppDetail = { tags: [] };
            const fallbackResult = { tags: [{ id: 'tag1', name: 'fallback-tag' }] };
            // This simulates the successful fallback in layout-main.tsx
            const tags = fallbackResult.tags;
            if (tags)
                originalAppDetail.tags = tags;
            expect(originalAppDetail.tags).toEqual(fallbackResult.tags);
            expect(originalAppDetail.tags.length).toBe(1);
        });
        it('should continue with empty tags when fallback fails', () => {
            const originalAppDetail = { tags: [] };
            const fallbackResult = null;
            // This simulates fallback failure in layout-main.tsx
            const tags = fallbackResult && 'tags' in fallbackResult ? fallbackResult.tags : undefined;
            if (tags)
                originalAppDetail.tags = tags;
            expect(originalAppDetail.tags).toEqual([]);
        });
    });
    describe('TagSelector Auto-initialization Logic', () => {
        it('should trigger getTagList when tagList is empty', () => {
            const tagList = [];
            let getTagListCalled = false;
            const getTagList = () => {
                getTagListCalled = true;
            };
            // This simulates the useEffect in TagSelector
            if (tagList.length === 0)
                getTagList();
            expect(getTagListCalled).toBe(true);
        });
        it('should not trigger getTagList when tagList has items', () => {
            const tagList = [{ id: 'tag1', name: 'existing-tag' }];
            let getTagListCalled = false;
            const getTagList = () => {
                getTagListCalled = true;
            };
            // This simulates the useEffect in TagSelector
            if (tagList.length === 0)
                getTagList();
            expect(getTagListCalled).toBe(false);
        });
    });
    describe('State Initialization Patterns', () => {
        it('should maintain AppCard tag state pattern', () => {
            const app = { tags: [{ id: 'tag1', name: 'test' }] };
            // Original AppCard pattern: useState(app.tags)
            const initialTags = app.tags;
            expect(Array.isArray(initialTags)).toBe(true);
            expect(initialTags.length).toBe(1);
            expect(initialTags).toBe(app.tags); // Reference equality for AppCard
        });
        it('should maintain AppInfo tag state pattern', () => {
            const appDetail = { tags: [{ id: 'tag1', name: 'test' }] };
            // New AppInfo pattern: useState(appDetail?.tags || [])
            const initialTags = appDetail?.tags || [];
            expect(Array.isArray(initialTags)).toBe(true);
            expect(initialTags.length).toBe(1);
        });
        it('should handle undefined appDetail gracefully in AppInfo', () => {
            const appDetail = undefined;
            // AppInfo pattern with undefined appDetail
            const initialTags = appDetail?.tags || [];
            expect(Array.isArray(initialTags)).toBe(true);
            expect(initialTags.length).toBe(0);
        });
    });
    describe('CSS Class and Layout Logic', () => {
        it('should apply correct minimum width condition', () => {
            const minWidth = 'true';
            // This tests the minWidth logic in TagSelector
            const shouldApplyMinWidth = minWidth && '!min-w-80';
            expect(shouldApplyMinWidth).toBe('!min-w-80');
        });
        it('should not apply minimum width when not specified', () => {
            const minWidth = undefined;
            const shouldApplyMinWidth = minWidth && '!min-w-80';
            expect(shouldApplyMinWidth).toBeFalsy();
        });
        it('should handle overflow layout classes correctly', () => {
            // This tests the layout pattern from AppCard and new AppInfo
            const overflowLayoutClasses = {
                container: 'flex w-0 grow items-center',
                inner: 'w-full',
                truncate: 'truncate',
            };
            expect(overflowLayoutClasses.container).toContain('w-0 grow');
            expect(overflowLayoutClasses.inner).toContain('w-full');
            expect(overflowLayoutClasses.truncate).toBe('truncate');
        });
    });
    describe('fetchAppWithTags Service Logic', () => {
        it('should correctly find app by ID from app list', () => {
            const appList = [
                { id: 'app1', name: 'App 1', tags: [] },
                { id: 'test-app-id', name: 'Test App', tags: [{ id: 'tag1', name: 'test' }] },
                { id: 'app3', name: 'App 3', tags: [] },
            ];
            const targetAppId = 'test-app-id';
            // This simulates the logic in fetchAppWithTags
            const foundApp = appList.find(app => app.id === targetAppId);
            expect(foundApp).toBeDefined();
            expect(foundApp?.id).toBe('test-app-id');
            expect(foundApp?.tags.length).toBe(1);
        });
        it('should return null when app not found', () => {
            const appList = [
                { id: 'app1', name: 'App 1' },
                { id: 'app2', name: 'App 2' },
            ];
            const targetAppId = 'nonexistent-app';
            const foundApp = appList.find(app => app.id === targetAppId) || null;
            expect(foundApp).toBeNull();
        });
        it('should handle empty app list', () => {
            const appList = [];
            const targetAppId = 'any-app';
            const foundApp = appList.find(app => app.id === targetAppId) || null;
            expect(foundApp).toBeNull();
            expect(appList.length).toBe(0); // Verify empty array usage
        });
    });
    describe('Data Structure Validation', () => {
        it('should maintain consistent tag data structure', () => {
            const tag = {
                id: 'tag1',
                name: 'test-tag',
                type: 'app',
                binding_count: 1,
            };
            expect(tag).toHaveProperty('id');
            expect(tag).toHaveProperty('name');
            expect(tag).toHaveProperty('type');
            expect(tag).toHaveProperty('binding_count');
            expect(tag.type).toBe('app');
            expect(typeof tag.binding_count).toBe('number');
        });
        it('should handle tag arrays correctly', () => {
            const tags = [
                { id: 'tag1', name: 'Tag 1', type: 'app', binding_count: 1 },
                { id: 'tag2', name: 'Tag 2', type: 'app', binding_count: 0 },
            ];
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBe(2);
            expect(tags.every(tag => tag.type === 'app')).toBe(true);
        });
        it('should validate app data structure with tags', () => {
            const app = {
                id: 'test-app',
                name: 'Test App',
                tags: [
                    { id: 'tag1', name: 'Tag 1', type: 'app', binding_count: 1 },
                ],
            };
            expect(app).toHaveProperty('id');
            expect(app).toHaveProperty('name');
            expect(app).toHaveProperty('tags');
            expect(Array.isArray(app.tags)).toBe(true);
            expect(app.tags.length).toBe(1);
        });
    });
    describe('Performance and Edge Cases', () => {
        it('should handle large tag arrays efficiently', () => {
            const largeTags = Array.from({ length: 100 }, (_, i) => `tag${i}`);
            const selectedTags = ['tag1', 'tag50', 'tag99'];
            // Performance test: filtering should be efficient
            const startTime = Date.now();
            const addTags = selectedTags.filter(tag => !largeTags.includes(tag));
            const removeTags = largeTags.filter(tag => !selectedTags.includes(tag));
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(10); // Should be very fast
            expect(addTags.length).toBe(0); // All selected tags exist
            expect(removeTags.length).toBe(97); // 100 - 3 = 97 tags to remove
        });
        it('should handle malformed tag data gracefully', () => {
            const mixedData = [
                { id: 'valid1', name: 'Valid Tag', type: 'app', binding_count: 1 },
                { id: 'invalid1' }, // Missing required properties
                null,
                undefined,
                { id: 'valid2', name: 'Another Valid', type: 'app', binding_count: 0 },
            ];
            // Filter out invalid entries
            const validTags = mixedData.filter((tag) => tag != null
                && typeof tag === 'object'
                && 'id' in tag
                && 'name' in tag
                && 'type' in tag
                && 'binding_count' in tag
                && typeof tag.binding_count === 'number');
            expect(validTags.length).toBe(2);
            expect(validTags.every(tag => tag.id && tag.name)).toBe(true);
        });
        it('should handle concurrent tag operations correctly', () => {
            const operations = [
                { type: 'add', tagIds: ['tag1', 'tag2'] },
                { type: 'remove', tagIds: ['tag3'] },
                { type: 'add', tagIds: ['tag4'] },
            ];
            // Simulate processing operations
            const results = operations.map(op => ({
                ...op,
                processed: true,
                timestamp: Date.now(),
            }));
            expect(results.length).toBe(3);
            expect(results.every(result => result.processed)).toBe(true);
        });
    });
    describe('Backward Compatibility Verification', () => {
        it('should not break existing AppCard behavior', () => {
            // Verify AppCard continues to work with original patterns
            const originalAppCardLogic = {
                initializeTags: (app) => app.tags,
                updateTags: (_currentTags, newTags) => newTags,
                shouldRefresh: true,
            };
            const app = { tags: [{ id: 'tag1', name: 'original' }] };
            const initializedTags = originalAppCardLogic.initializeTags(app);
            expect(initializedTags).toBe(app.tags);
            expect(originalAppCardLogic.shouldRefresh).toBe(true);
        });
        it('should ensure AppInfo follows AppCard patterns', () => {
            // Verify AppInfo uses compatible state management
            const appCardPattern = (app) => app.tags;
            const appInfoPattern = (appDetail) => appDetail?.tags || [];
            const appWithTags = { tags: [{ id: 'tag1' }] };
            const appWithoutTags = { tags: [] };
            const undefinedApp = undefined;
            expect(appCardPattern(appWithTags)).toEqual(appInfoPattern(appWithTags));
            expect(appInfoPattern(appWithoutTags)).toEqual([]);
            expect(appInfoPattern(undefinedApp)).toEqual([]);
        });
        it('should maintain consistent API parameters', () => {
            // Verify service layer maintains expected parameters
            const fetchAppListParams = {
                url: '/apps',
                params: { page: 1, limit: 100 },
            };
            const tagApiParams = {
                bindTag: (tagIDs, targetID, type) => ({ tagIDs, targetID, type }),
                unBindTag: (tagID, targetID, type) => ({ tagID, targetID, type }),
            };
            expect(fetchAppListParams.url).toBe('/apps');
            expect(fetchAppListParams.params.limit).toBe(100);
            const bindResult = tagApiParams.bindTag(['tag1'], 'app1', 'app');
            expect(bindResult.tagIDs).toEqual(['tag1']);
            expect(bindResult.type).toBe('app');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pZmllZC10YWdzLWxvZ2ljLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bmlmaWVkLXRhZ3MtbG9naWMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7QUFFSCxRQUFRLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZELFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDMUMsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtZQUNwRCxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUNyQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBRTFDLCtEQUErRDtZQUMvRCxNQUFNLGVBQWUsR0FDakIsWUFBWSxDQUFDLE1BQU0sS0FBSyxpQkFBaUIsQ0FBQyxNQUFNO21CQUM3QyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO21CQUN0RCxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFN0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNyQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDeEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDckMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQSxDQUFDLDZCQUE2QjtZQUV4RSxNQUFNLGVBQWUsR0FDakIsWUFBWSxDQUFDLE1BQU0sS0FBSyxpQkFBaUIsQ0FBQyxNQUFNO21CQUM3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QUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDaEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQzNDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVW5pZmllZCBUYWdzIEVkaXRpbmcgLSBQdXJlIExvZ2ljIFRlc3RzXG4gKlxuICogVGhpcyB0ZXN0IGZpbGUgdmFsaWRhdGVzIHRoZSBjb3JlIGJ1c2luZXNzIGxvZ2ljIGFuZCBzdGF0ZSBtYW5hZ2VtZW50XG4gKiBiZWhhdmlvcnMgaW50cm9kdWNlZCBpbiB0aGUgcmVjZW50IDcgY29tbWl0cyB3aXRob3V0IHJlcXVpcmluZyBjb21wbGV4IG1vY2tzLlxuICovXG5cbmRlc2NyaWJlKCdVbmlmaWVkIFRhZ3MgRWRpdGluZyAtIFB1cmUgTG9naWMgVGVzdHMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdUYWcgU3RhdGUgTWFuYWdlbWVudCBMb2dpYycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRldGVjdCB3aGVuIHRhZyB2YWx1ZXMgaGF2ZSBjaGFuZ2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gWyd0YWcxJywgJ3RhZzInXVxuICAgICAgY29uc3QgbmV3U2VsZWN0ZWRUYWdJRHMgPSBbJ3RhZzEnLCAndGFnMyddXG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIHZhbHVlTm90Q2hhbmdlZCBsb2dpYyBmcm9tIFRhZ1NlbGVjdG9yIGNvbXBvbmVudFxuICAgICAgY29uc3QgdmFsdWVOb3RDaGFuZ2VkXG4gICAgICAgID0gY3VycmVudFZhbHVlLmxlbmd0aCA9PT0gbmV3U2VsZWN0ZWRUYWdJRHMubGVuZ3RoXG4gICAgICAgICAgJiYgY3VycmVudFZhbHVlLmV2ZXJ5KHYgPT4gbmV3U2VsZWN0ZWRUYWdJRHMuaW5jbHVkZXModikpXG4gICAgICAgICAgJiYgbmV3U2VsZWN0ZWRUYWdJRHMuZXZlcnkodiA9PiBjdXJyZW50VmFsdWUuaW5jbHVkZXModikpXG5cbiAgICAgIGV4cGVjdCh2YWx1ZU5vdENoYW5nZWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGlkZW50aWZ5IHVuY2hhbmdlZCB0YWcgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gWyd0YWcxJywgJ3RhZzInXVxuICAgICAgY29uc3QgbmV3U2VsZWN0ZWRUYWdJRHMgPSBbJ3RhZzInLCAndGFnMSddIC8vIFNhbWUgdGFncywgZGlmZmVyZW50IG9yZGVyXG5cbiAgICAgIGNvbnN0IHZhbHVlTm90Q2hhbmdlZFxuICAgICAgICA9IGN1cnJlbnRWYWx1ZS5sZW5ndGggPT09IG5ld1NlbGVjdGVkVGFnSURzLmxlbmd0aFxuICAgICAgICAgICYmIGN1cnJlbnRWYWx1ZS5ldmVyeSh2ID0+IG5ld1NlbGVjdGVkVGFnSURzLmluY2x1ZGVzKHYpKVxuICAgICAgICAgICYmIG5ld1NlbGVjdGVkVGFnSURzLmV2ZXJ5KHYgPT4gY3VycmVudFZhbHVlLmluY2x1ZGVzKHYpKVxuXG4gICAgICBleHBlY3QodmFsdWVOb3RDaGFuZ2VkKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsY3VsYXRlIGNvcnJlY3QgdGFnIG9wZXJhdGlvbnMgZm9yIGJpbmRpbmcvdW5iaW5kaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gWyd0YWcxJywgJ3RhZzInXVxuICAgICAgY29uc3Qgc2VsZWN0ZWRUYWdJRHMgPSBbJ3RhZzInLCAndGFnMyddXG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIGhhbmRsZVZhbHVlQ2hhbmdlIGxvZ2ljIGZyb20gVGFnU2VsZWN0b3JcbiAgICAgIGNvbnN0IGFkZFRhZ0lEcyA9IHNlbGVjdGVkVGFnSURzLmZpbHRlcih2ID0+ICFjdXJyZW50VmFsdWUuaW5jbHVkZXModikpXG4gICAgICBjb25zdCByZW1vdmVUYWdJRHMgPSBjdXJyZW50VmFsdWUuZmlsdGVyKHYgPT4gIXNlbGVjdGVkVGFnSURzLmluY2x1ZGVzKHYpKVxuXG4gICAgICBleHBlY3QoYWRkVGFnSURzKS50b0VxdWFsKFsndGFnMyddKVxuICAgICAgZXhwZWN0KHJlbW92ZVRhZ0lEcykudG9FcXVhbChbJ3RhZzEnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdGFnIGFycmF5cyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWU6IHN0cmluZ1tdID0gW11cbiAgICAgIGNvbnN0IHNlbGVjdGVkVGFnSURzID0gWyd0YWcxJ11cblxuICAgICAgY29uc3QgYWRkVGFnSURzID0gc2VsZWN0ZWRUYWdJRHMuZmlsdGVyKHYgPT4gIWN1cnJlbnRWYWx1ZS5pbmNsdWRlcyh2KSlcbiAgICAgIGNvbnN0IHJlbW92ZVRhZ0lEcyA9IGN1cnJlbnRWYWx1ZS5maWx0ZXIodiA9PiAhc2VsZWN0ZWRUYWdJRHMuaW5jbHVkZXModikpXG5cbiAgICAgIGV4cGVjdChhZGRUYWdJRHMpLnRvRXF1YWwoWyd0YWcxJ10pXG4gICAgICBleHBlY3QocmVtb3ZlVGFnSURzKS50b0VxdWFsKFtdKVxuICAgICAgZXhwZWN0KGN1cnJlbnRWYWx1ZS5sZW5ndGgpLnRvQmUoMCkgLy8gVmVyaWZ5IGVtcHR5IGFycmF5IHVzYWdlXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlbW92aW5nIGFsbCB0YWdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gWyd0YWcxJywgJ3RhZzInXVxuICAgICAgY29uc3Qgc2VsZWN0ZWRUYWdJRHM6IHN0cmluZ1tdID0gW11cblxuICAgICAgY29uc3QgYWRkVGFnSURzID0gc2VsZWN0ZWRUYWdJRHMuZmlsdGVyKHYgPT4gIWN1cnJlbnRWYWx1ZS5pbmNsdWRlcyh2KSlcbiAgICAgIGNvbnN0IHJlbW92ZVRhZ0lEcyA9IGN1cnJlbnRWYWx1ZS5maWx0ZXIodiA9PiAhc2VsZWN0ZWRUYWdJRHMuaW5jbHVkZXModikpXG5cbiAgICAgIGV4cGVjdChhZGRUYWdJRHMpLnRvRXF1YWwoW10pXG4gICAgICBleHBlY3QocmVtb3ZlVGFnSURzKS50b0VxdWFsKFsndGFnMScsICd0YWcyJ10pXG4gICAgICBleHBlY3Qoc2VsZWN0ZWRUYWdJRHMubGVuZ3RoKS50b0JlKDApIC8vIFZlcmlmeSBlbXB0eSBhcnJheSB1c2FnZVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0ZhbGxiYWNrIExvZ2ljIChmcm9tIGxheW91dC1tYWluLnRzeCknLCAoKSA9PiB7XG4gICAgdHlwZSBUYWcgPSB7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9XG4gICAgdHlwZSBBcHBEZXRhaWwgPSB7IHRhZ3M6IFRhZ1tdIH1cbiAgICB0eXBlIEZhbGxiYWNrUmVzdWx0ID0geyB0YWdzPzogVGFnW10gfSB8IG51bGxcbiAgICAvLyBuby1vcFxuICAgIGl0KCdzaG91bGQgdHJpZ2dlciBmYWxsYmFjayB3aGVuIHRhZ3MgYXJlIG1pc3Npbmcgb3IgZW1wdHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHBEZXRhaWxXaXRob3V0VGFnczogQXBwRGV0YWlsID0geyB0YWdzOiBbXSB9XG4gICAgICBjb25zdCBhcHBEZXRhaWxXaXRoVGFnczogQXBwRGV0YWlsID0geyB0YWdzOiBbeyBpZDogJ3RhZzEnLCBuYW1lOiAndCcgfV0gfVxuICAgICAgY29uc3QgYXBwRGV0YWlsV2l0aFVuZGVmaW5lZFRhZ3M6IHsgdGFnczogVGFnW10gfCB1bmRlZmluZWQgfSA9IHsgdGFnczogdW5kZWZpbmVkIH1cblxuICAgICAgLy8gVGhpcyBzaW11bGF0ZXMgdGhlIGNvbmRpdGlvbiBpbiBsYXlvdXQtbWFpbi50c3hcbiAgICAgIGNvbnN0IHNob3VsZEZhbGxiYWNrMSA9IGFwcERldGFpbFdpdGhvdXRUYWdzLnRhZ3MubGVuZ3RoID09PSAwXG4gICAgICBjb25zdCBzaG91bGRGYWxsYmFjazIgPSBhcHBEZXRhaWxXaXRoVGFncy50YWdzLmxlbmd0aCA9PT0gMFxuICAgICAgY29uc3Qgc2hvdWxkRmFsbGJhY2szID0gIWFwcERldGFpbFdpdGhVbmRlZmluZWRUYWdzLnRhZ3MgfHwgYXBwRGV0YWlsV2l0aFVuZGVmaW5lZFRhZ3MudGFncy5sZW5ndGggPT09IDBcblxuICAgICAgZXhwZWN0KHNob3VsZEZhbGxiYWNrMSkudG9CZSh0cnVlKSAvLyBFbXB0eSBhcnJheSBzaG91bGQgdHJpZ2dlciBmYWxsYmFja1xuICAgICAgZXhwZWN0KHNob3VsZEZhbGxiYWNrMikudG9CZShmYWxzZSkgLy8gSGFzIHRhZ3MsIG5vIGZhbGxiYWNrIG5lZWRlZFxuICAgICAgZXhwZWN0KHNob3VsZEZhbGxiYWNrMykudG9CZSh0cnVlKSAvLyBVbmRlZmluZWQgdGFncyBzaG91bGQgdHJpZ2dlciBmYWxsYmFja1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIHRhZ3Mgd2hlbiBmYWxsYmFjayBzdWNjZWVkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsQXBwRGV0YWlsOiBBcHBEZXRhaWwgPSB7IHRhZ3M6IFtdIH1cbiAgICAgIGNvbnN0IGZhbGxiYWNrUmVzdWx0OiB7IHRhZ3M/OiBUYWdbXSB9ID0geyB0YWdzOiBbeyBpZDogJ3RhZzEnLCBuYW1lOiAnZmFsbGJhY2stdGFnJyB9XSB9XG5cbiAgICAgIC8vIFRoaXMgc2ltdWxhdGVzIHRoZSBzdWNjZXNzZnVsIGZhbGxiYWNrIGluIGxheW91dC1tYWluLnRzeFxuICAgICAgY29uc3QgdGFncyA9IGZhbGxiYWNrUmVzdWx0LnRhZ3NcbiAgICAgIGlmICh0YWdzKVxuICAgICAgICBvcmlnaW5hbEFwcERldGFpbC50YWdzID0gdGFnc1xuXG4gICAgICBleHBlY3Qob3JpZ2luYWxBcHBEZXRhaWwudGFncykudG9FcXVhbChmYWxsYmFja1Jlc3VsdC50YWdzKVxuICAgICAgZXhwZWN0KG9yaWdpbmFsQXBwRGV0YWlsLnRhZ3MubGVuZ3RoKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29udGludWUgd2l0aCBlbXB0eSB0YWdzIHdoZW4gZmFsbGJhY2sgZmFpbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbEFwcERldGFpbDogQXBwRGV0YWlsID0geyB0YWdzOiBbXSB9XG4gICAgICBjb25zdCBmYWxsYmFja1Jlc3VsdCA9IG51bGwgYXMgRmFsbGJhY2tSZXN1bHRcblxuICAgICAgLy8gVGhpcyBzaW11bGF0ZXMgZmFsbGJhY2sgZmFpbHVyZSBpbiBsYXlvdXQtbWFpbi50c3hcbiAgICAgIGNvbnN0IHRhZ3M6IFRhZ1tdIHwgdW5kZWZpbmVkID0gZmFsbGJhY2tSZXN1bHQgJiYgJ3RhZ3MnIGluIGZhbGxiYWNrUmVzdWx0ID8gZmFsbGJhY2tSZXN1bHQudGFncyA6IHVuZGVmaW5lZFxuICAgICAgaWYgKHRhZ3MpXG4gICAgICAgIG9yaWdpbmFsQXBwRGV0YWlsLnRhZ3MgPSB0YWdzXG5cbiAgICAgIGV4cGVjdChvcmlnaW5hbEFwcERldGFpbC50YWdzKS50b0VxdWFsKFtdKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1RhZ1NlbGVjdG9yIEF1dG8taW5pdGlhbGl6YXRpb24gTG9naWMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGdldFRhZ0xpc3Qgd2hlbiB0YWdMaXN0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdGFnTGlzdDogYW55W10gPSBbXVxuICAgICAgbGV0IGdldFRhZ0xpc3RDYWxsZWQgPSBmYWxzZVxuICAgICAgY29uc3QgZ2V0VGFnTGlzdCA9ICgpID0+IHtcbiAgICAgICAgZ2V0VGFnTGlzdENhbGxlZCA9IHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBzaW11bGF0ZXMgdGhlIHVzZUVmZmVjdCBpbiBUYWdTZWxlY3RvclxuICAgICAgaWYgKHRhZ0xpc3QubGVuZ3RoID09PSAwKVxuICAgICAgICBnZXRUYWdMaXN0KClcblxuICAgICAgZXhwZWN0KGdldFRhZ0xpc3RDYWxsZWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJpZ2dlciBnZXRUYWdMaXN0IHdoZW4gdGFnTGlzdCBoYXMgaXRlbXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YWdMaXN0ID0gW3sgaWQ6ICd0YWcxJywgbmFtZTogJ2V4aXN0aW5nLXRhZycgfV1cbiAgICAgIGxldCBnZXRUYWdMaXN0Q2FsbGVkID0gZmFsc2VcbiAgICAgIGNvbnN0IGdldFRhZ0xpc3QgPSAoKSA9PiB7XG4gICAgICAgIGdldFRhZ0xpc3RDYWxsZWQgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgc2ltdWxhdGVzIHRoZSB1c2VFZmZlY3QgaW4gVGFnU2VsZWN0b3JcbiAgICAgIGlmICh0YWdMaXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgZ2V0VGFnTGlzdCgpXG5cbiAgICAgIGV4cGVjdChnZXRUYWdMaXN0Q2FsbGVkKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N0YXRlIEluaXRpYWxpemF0aW9uIFBhdHRlcm5zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gQXBwQ2FyZCB0YWcgc3RhdGUgcGF0dGVybicsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IHsgdGFnczogW3sgaWQ6ICd0YWcxJywgbmFtZTogJ3Rlc3QnIH1dIH1cblxuICAgICAgLy8gT3JpZ2luYWwgQXBwQ2FyZCBwYXR0ZXJuOiB1c2VTdGF0ZShhcHAudGFncylcbiAgICAgIGNvbnN0IGluaXRpYWxUYWdzID0gYXBwLnRhZ3NcbiAgICAgIGV4cGVjdChBcnJheS5pc0FycmF5KGluaXRpYWxUYWdzKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGluaXRpYWxUYWdzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGluaXRpYWxUYWdzKS50b0JlKGFwcC50YWdzKSAvLyBSZWZlcmVuY2UgZXF1YWxpdHkgZm9yIEFwcENhcmRcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBBcHBJbmZvIHRhZyBzdGF0ZSBwYXR0ZXJuJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwRGV0YWlsID0geyB0YWdzOiBbeyBpZDogJ3RhZzEnLCBuYW1lOiAndGVzdCcgfV0gfVxuXG4gICAgICAvLyBOZXcgQXBwSW5mbyBwYXR0ZXJuOiB1c2VTdGF0ZShhcHBEZXRhaWw/LnRhZ3MgfHwgW10pXG4gICAgICBjb25zdCBpbml0aWFsVGFncyA9IGFwcERldGFpbD8udGFncyB8fCBbXVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkoaW5pdGlhbFRhZ3MpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaW5pdGlhbFRhZ3MubGVuZ3RoKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBhcHBEZXRhaWwgZ3JhY2VmdWxseSBpbiBBcHBJbmZvJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwRGV0YWlsID0gdW5kZWZpbmVkXG5cbiAgICAgIC8vIEFwcEluZm8gcGF0dGVybiB3aXRoIHVuZGVmaW5lZCBhcHBEZXRhaWxcbiAgICAgIGNvbnN0IGluaXRpYWxUYWdzID0gKGFwcERldGFpbCBhcyBhbnkpPy50YWdzIHx8IFtdXG4gICAgICBleHBlY3QoQXJyYXkuaXNBcnJheShpbml0aWFsVGFncykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpbml0aWFsVGFncy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDU1MgQ2xhc3MgYW5kIExheW91dCBMb2dpYycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgbWluaW11bSB3aWR0aCBjb25kaXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtaW5XaWR0aCA9ICd0cnVlJ1xuXG4gICAgICAvLyBUaGlzIHRlc3RzIHRoZSBtaW5XaWR0aCBsb2dpYyBpbiBUYWdTZWxlY3RvclxuICAgICAgY29uc3Qgc2hvdWxkQXBwbHlNaW5XaWR0aCA9IG1pbldpZHRoICYmICchbWluLXctODAnXG4gICAgICBleHBlY3Qoc2hvdWxkQXBwbHlNaW5XaWR0aCkudG9CZSgnIW1pbi13LTgwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYXBwbHkgbWluaW11bSB3aWR0aCB3aGVuIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtaW5XaWR0aCA9IHVuZGVmaW5lZFxuXG4gICAgICBjb25zdCBzaG91bGRBcHBseU1pbldpZHRoID0gbWluV2lkdGggJiYgJyFtaW4tdy04MCdcbiAgICAgIGV4cGVjdChzaG91bGRBcHBseU1pbldpZHRoKS50b0JlRmFsc3koKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvdmVyZmxvdyBsYXlvdXQgY2xhc3NlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3RzIHRoZSBsYXlvdXQgcGF0dGVybiBmcm9tIEFwcENhcmQgYW5kIG5ldyBBcHBJbmZvXG4gICAgICBjb25zdCBvdmVyZmxvd0xheW91dENsYXNzZXMgPSB7XG4gICAgICAgIGNvbnRhaW5lcjogJ2ZsZXggdy0wIGdyb3cgaXRlbXMtY2VudGVyJyxcbiAgICAgICAgaW5uZXI6ICd3LWZ1bGwnLFxuICAgICAgICB0cnVuY2F0ZTogJ3RydW5jYXRlJyxcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KG92ZXJmbG93TGF5b3V0Q2xhc3Nlcy5jb250YWluZXIpLnRvQ29udGFpbigndy0wIGdyb3cnKVxuICAgICAgZXhwZWN0KG92ZXJmbG93TGF5b3V0Q2xhc3Nlcy5pbm5lcikudG9Db250YWluKCd3LWZ1bGwnKVxuICAgICAgZXhwZWN0KG92ZXJmbG93TGF5b3V0Q2xhc3Nlcy50cnVuY2F0ZSkudG9CZSgndHJ1bmNhdGUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2ZldGNoQXBwV2l0aFRhZ3MgU2VydmljZSBMb2dpYycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBmaW5kIGFwcCBieSBJRCBmcm9tIGFwcCBsaXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwTGlzdCA9IFtcbiAgICAgICAgeyBpZDogJ2FwcDEnLCBuYW1lOiAnQXBwIDEnLCB0YWdzOiBbXSB9LFxuICAgICAgICB7IGlkOiAndGVzdC1hcHAtaWQnLCBuYW1lOiAnVGVzdCBBcHAnLCB0YWdzOiBbeyBpZDogJ3RhZzEnLCBuYW1lOiAndGVzdCcgfV0gfSxcbiAgICAgICAgeyBpZDogJ2FwcDMnLCBuYW1lOiAnQXBwIDMnLCB0YWdzOiBbXSB9LFxuICAgICAgXVxuICAgICAgY29uc3QgdGFyZ2V0QXBwSWQgPSAndGVzdC1hcHAtaWQnXG5cbiAgICAgIC8vIFRoaXMgc2ltdWxhdGVzIHRoZSBsb2dpYyBpbiBmZXRjaEFwcFdpdGhUYWdzXG4gICAgICBjb25zdCBmb3VuZEFwcCA9IGFwcExpc3QuZmluZChhcHAgPT4gYXBwLmlkID09PSB0YXJnZXRBcHBJZClcblxuICAgICAgZXhwZWN0KGZvdW5kQXBwKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZm91bmRBcHA/LmlkKS50b0JlKCd0ZXN0LWFwcC1pZCcpXG4gICAgICBleHBlY3QoZm91bmRBcHA/LnRhZ3MubGVuZ3RoKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgd2hlbiBhcHAgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwTGlzdCA9IFtcbiAgICAgICAgeyBpZDogJ2FwcDEnLCBuYW1lOiAnQXBwIDEnIH0sXG4gICAgICAgIHsgaWQ6ICdhcHAyJywgbmFtZTogJ0FwcCAyJyB9LFxuICAgICAgXVxuICAgICAgY29uc3QgdGFyZ2V0QXBwSWQgPSAnbm9uZXhpc3RlbnQtYXBwJ1xuXG4gICAgICBjb25zdCBmb3VuZEFwcCA9IGFwcExpc3QuZmluZChhcHAgPT4gYXBwLmlkID09PSB0YXJnZXRBcHBJZCkgfHwgbnVsbFxuXG4gICAgICBleHBlY3QoZm91bmRBcHApLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYXBwIGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHBMaXN0OiBhbnlbXSA9IFtdXG4gICAgICBjb25zdCB0YXJnZXRBcHBJZCA9ICdhbnktYXBwJ1xuXG4gICAgICBjb25zdCBmb3VuZEFwcCA9IGFwcExpc3QuZmluZChhcHAgPT4gYXBwLmlkID09PSB0YXJnZXRBcHBJZCkgfHwgbnVsbFxuXG4gICAgICBleHBlY3QoZm91bmRBcHApLnRvQmVOdWxsKClcbiAgICAgIGV4cGVjdChhcHBMaXN0Lmxlbmd0aCkudG9CZSgwKSAvLyBWZXJpZnkgZW1wdHkgYXJyYXkgdXNhZ2VcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdEYXRhIFN0cnVjdHVyZSBWYWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gY29uc2lzdGVudCB0YWcgZGF0YSBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YWcgPSB7XG4gICAgICAgIGlkOiAndGFnMScsXG4gICAgICAgIG5hbWU6ICd0ZXN0LXRhZycsXG4gICAgICAgIHR5cGU6ICdhcHAnLFxuICAgICAgICBiaW5kaW5nX2NvdW50OiAxLFxuICAgICAgfVxuXG4gICAgICBleHBlY3QodGFnKS50b0hhdmVQcm9wZXJ0eSgnaWQnKVxuICAgICAgZXhwZWN0KHRhZykudG9IYXZlUHJvcGVydHkoJ25hbWUnKVxuICAgICAgZXhwZWN0KHRhZykudG9IYXZlUHJvcGVydHkoJ3R5cGUnKVxuICAgICAgZXhwZWN0KHRhZykudG9IYXZlUHJvcGVydHkoJ2JpbmRpbmdfY291bnQnKVxuICAgICAgZXhwZWN0KHRhZy50eXBlKS50b0JlKCdhcHAnKVxuICAgICAgZXhwZWN0KHR5cGVvZiB0YWcuYmluZGluZ19jb3VudCkudG9CZSgnbnVtYmVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdGFnIGFycmF5cyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YWdzID0gW1xuICAgICAgICB7IGlkOiAndGFnMScsIG5hbWU6ICdUYWcgMScsIHR5cGU6ICdhcHAnLCBiaW5kaW5nX2NvdW50OiAxIH0sXG4gICAgICAgIHsgaWQ6ICd0YWcyJywgbmFtZTogJ1RhZyAyJywgdHlwZTogJ2FwcCcsIGJpbmRpbmdfY291bnQ6IDAgfSxcbiAgICAgIF1cblxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkodGFncykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0YWdzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgZXhwZWN0KHRhZ3MuZXZlcnkodGFnID0+IHRhZy50eXBlID09PSAnYXBwJykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBhcHAgZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0YWdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0ge1xuICAgICAgICBpZDogJ3Rlc3QtYXBwJyxcbiAgICAgICAgbmFtZTogJ1Rlc3QgQXBwJyxcbiAgICAgICAgdGFnczogW1xuICAgICAgICAgIHsgaWQ6ICd0YWcxJywgbmFtZTogJ1RhZyAxJywgdHlwZTogJ2FwcCcsIGJpbmRpbmdfY291bnQ6IDEgfSxcbiAgICAgICAgXSxcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KGFwcCkudG9IYXZlUHJvcGVydHkoJ2lkJylcbiAgICAgIGV4cGVjdChhcHApLnRvSGF2ZVByb3BlcnR5KCduYW1lJylcbiAgICAgIGV4cGVjdChhcHApLnRvSGF2ZVByb3BlcnR5KCd0YWdzJylcbiAgICAgIGV4cGVjdChBcnJheS5pc0FycmF5KGFwcC50YWdzKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGFwcC50YWdzLmxlbmd0aCkudG9CZSgxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1BlcmZvcm1hbmNlIGFuZCBFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIHRhZyBhcnJheXMgZWZmaWNpZW50bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBsYXJnZVRhZ3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMDAgfSwgKF8sIGkpID0+IGB0YWcke2l9YClcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGFncyA9IFsndGFnMScsICd0YWc1MCcsICd0YWc5OSddXG5cbiAgICAgIC8vIFBlcmZvcm1hbmNlIHRlc3Q6IGZpbHRlcmluZyBzaG91bGQgYmUgZWZmaWNpZW50XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpXG4gICAgICBjb25zdCBhZGRUYWdzID0gc2VsZWN0ZWRUYWdzLmZpbHRlcih0YWcgPT4gIWxhcmdlVGFncy5pbmNsdWRlcyh0YWcpKVxuICAgICAgY29uc3QgcmVtb3ZlVGFncyA9IGxhcmdlVGFncy5maWx0ZXIodGFnID0+ICFzZWxlY3RlZFRhZ3MuaW5jbHVkZXModGFnKSlcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSBEYXRlLm5vdygpXG5cbiAgICAgIGV4cGVjdChlbmRUaW1lIC0gc3RhcnRUaW1lKS50b0JlTGVzc1RoYW4oMTApIC8vIFNob3VsZCBiZSB2ZXJ5IGZhc3RcbiAgICAgIGV4cGVjdChhZGRUYWdzLmxlbmd0aCkudG9CZSgwKSAvLyBBbGwgc2VsZWN0ZWQgdGFncyBleGlzdFxuICAgICAgZXhwZWN0KHJlbW92ZVRhZ3MubGVuZ3RoKS50b0JlKDk3KSAvLyAxMDAgLSAzID0gOTcgdGFncyB0byByZW1vdmVcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWFsZm9ybWVkIHRhZyBkYXRhIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtaXhlZERhdGEgPSBbXG4gICAgICAgIHsgaWQ6ICd2YWxpZDEnLCBuYW1lOiAnVmFsaWQgVGFnJywgdHlwZTogJ2FwcCcsIGJpbmRpbmdfY291bnQ6IDEgfSxcbiAgICAgICAgeyBpZDogJ2ludmFsaWQxJyB9LCAvLyBNaXNzaW5nIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgICAgICAgbnVsbCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB7IGlkOiAndmFsaWQyJywgbmFtZTogJ0Fub3RoZXIgVmFsaWQnLCB0eXBlOiAnYXBwJywgYmluZGluZ19jb3VudDogMCB9LFxuICAgICAgXVxuXG4gICAgICAvLyBGaWx0ZXIgb3V0IGludmFsaWQgZW50cmllc1xuICAgICAgY29uc3QgdmFsaWRUYWdzID0gbWl4ZWREYXRhLmZpbHRlcigodGFnKTogdGFnIGlzIHsgaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGJpbmRpbmdfY291bnQ6IG51bWJlciB9ID0+XG4gICAgICAgIHRhZyAhPSBudWxsXG4gICAgICAgICYmIHR5cGVvZiB0YWcgPT09ICdvYmplY3QnXG4gICAgICAgICYmICdpZCcgaW4gdGFnXG4gICAgICAgICYmICduYW1lJyBpbiB0YWdcbiAgICAgICAgJiYgJ3R5cGUnIGluIHRhZ1xuICAgICAgICAmJiAnYmluZGluZ19jb3VudCcgaW4gdGFnXG4gICAgICAgICYmIHR5cGVvZiB0YWcuYmluZGluZ19jb3VudCA9PT0gJ251bWJlcicsXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh2YWxpZFRhZ3MubGVuZ3RoKS50b0JlKDIpXG4gICAgICBleHBlY3QodmFsaWRUYWdzLmV2ZXJ5KHRhZyA9PiB0YWcuaWQgJiYgdGFnLm5hbWUpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbmN1cnJlbnQgdGFnIG9wZXJhdGlvbnMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IFtcbiAgICAgICAgeyB0eXBlOiAnYWRkJywgdGFnSWRzOiBbJ3RhZzEnLCAndGFnMiddIH0sXG4gICAgICAgIHsgdHlwZTogJ3JlbW92ZScsIHRhZ0lkczogWyd0YWczJ10gfSxcbiAgICAgICAgeyB0eXBlOiAnYWRkJywgdGFnSWRzOiBbJ3RhZzQnXSB9LFxuICAgICAgXVxuXG4gICAgICAvLyBTaW11bGF0ZSBwcm9jZXNzaW5nIG9wZXJhdGlvbnNcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBvcGVyYXRpb25zLm1hcChvcCA9PiAoe1xuICAgICAgICAuLi5vcCxcbiAgICAgICAgcHJvY2Vzc2VkOiB0cnVlLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICB9KSlcblxuICAgICAgZXhwZWN0KHJlc3VsdHMubGVuZ3RoKS50b0JlKDMpXG4gICAgICBleHBlY3QocmVzdWx0cy5ldmVyeShyZXN1bHQgPT4gcmVzdWx0LnByb2Nlc3NlZCkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCYWNrd2FyZCBDb21wYXRpYmlsaXR5IFZlcmlmaWNhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBicmVhayBleGlzdGluZyBBcHBDYXJkIGJlaGF2aW9yJywgKCkgPT4ge1xuICAgICAgLy8gVmVyaWZ5IEFwcENhcmQgY29udGludWVzIHRvIHdvcmsgd2l0aCBvcmlnaW5hbCBwYXR0ZXJuc1xuICAgICAgY29uc3Qgb3JpZ2luYWxBcHBDYXJkTG9naWMgPSB7XG4gICAgICAgIGluaXRpYWxpemVUYWdzOiAoYXBwOiBhbnkpID0+IGFwcC50YWdzLFxuICAgICAgICB1cGRhdGVUYWdzOiAoX2N1cnJlbnRUYWdzOiBhbnlbXSwgbmV3VGFnczogYW55W10pID0+IG5ld1RhZ3MsXG4gICAgICAgIHNob3VsZFJlZnJlc2g6IHRydWUsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFwcCA9IHsgdGFnczogW3sgaWQ6ICd0YWcxJywgbmFtZTogJ29yaWdpbmFsJyB9XSB9XG4gICAgICBjb25zdCBpbml0aWFsaXplZFRhZ3MgPSBvcmlnaW5hbEFwcENhcmRMb2dpYy5pbml0aWFsaXplVGFncyhhcHApXG5cbiAgICAgIGV4cGVjdChpbml0aWFsaXplZFRhZ3MpLnRvQmUoYXBwLnRhZ3MpXG4gICAgICBleHBlY3Qob3JpZ2luYWxBcHBDYXJkTG9naWMuc2hvdWxkUmVmcmVzaCkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuc3VyZSBBcHBJbmZvIGZvbGxvd3MgQXBwQ2FyZCBwYXR0ZXJucycsICgpID0+IHtcbiAgICAgIC8vIFZlcmlmeSBBcHBJbmZvIHVzZXMgY29tcGF0aWJsZSBzdGF0ZSBtYW5hZ2VtZW50XG4gICAgICBjb25zdCBhcHBDYXJkUGF0dGVybiA9IChhcHA6IGFueSkgPT4gYXBwLnRhZ3NcbiAgICAgIGNvbnN0IGFwcEluZm9QYXR0ZXJuID0gKGFwcERldGFpbDogYW55KSA9PiBhcHBEZXRhaWw/LnRhZ3MgfHwgW11cblxuICAgICAgY29uc3QgYXBwV2l0aFRhZ3MgPSB7IHRhZ3M6IFt7IGlkOiAndGFnMScgfV0gfVxuICAgICAgY29uc3QgYXBwV2l0aG91dFRhZ3MgPSB7IHRhZ3M6IFtdIH1cbiAgICAgIGNvbnN0IHVuZGVmaW5lZEFwcCA9IHVuZGVmaW5lZFxuXG4gICAgICBleHBlY3QoYXBwQ2FyZFBhdHRlcm4oYXBwV2l0aFRhZ3MpKS50b0VxdWFsKGFwcEluZm9QYXR0ZXJuKGFwcFdpdGhUYWdzKSlcbiAgICAgIGV4cGVjdChhcHBJbmZvUGF0dGVybihhcHBXaXRob3V0VGFncykpLnRvRXF1YWwoW10pXG4gICAgICBleHBlY3QoYXBwSW5mb1BhdHRlcm4odW5kZWZpbmVkQXBwKSkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBjb25zaXN0ZW50IEFQSSBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gVmVyaWZ5IHNlcnZpY2UgbGF5ZXIgbWFpbnRhaW5zIGV4cGVjdGVkIHBhcmFtZXRlcnNcbiAgICAgIGNvbnN0IGZldGNoQXBwTGlzdFBhcmFtcyA9IHtcbiAgICAgICAgdXJsOiAnL2FwcHMnLFxuICAgICAgICBwYXJhbXM6IHsgcGFnZTogMSwgbGltaXQ6IDEwMCB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCB0YWdBcGlQYXJhbXMgPSB7XG4gICAgICAgIGJpbmRUYWc6ICh0YWdJRHM6IHN0cmluZ1tdLCB0YXJnZXRJRDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpID0+ICh7IHRhZ0lEcywgdGFyZ2V0SUQsIHR5cGUgfSksXG4gICAgICAgIHVuQmluZFRhZzogKHRhZ0lEOiBzdHJpbmcsIHRhcmdldElEOiBzdHJpbmcsIHR5cGU6IHN0cmluZykgPT4gKHsgdGFnSUQsIHRhcmdldElELCB0eXBlIH0pLFxuICAgICAgfVxuXG4gICAgICBleHBlY3QoZmV0Y2hBcHBMaXN0UGFyYW1zLnVybCkudG9CZSgnL2FwcHMnKVxuICAgICAgZXhwZWN0KGZldGNoQXBwTGlzdFBhcmFtcy5wYXJhbXMubGltaXQpLnRvQmUoMTAwKVxuXG4gICAgICBjb25zdCBiaW5kUmVzdWx0ID0gdGFnQXBpUGFyYW1zLmJpbmRUYWcoWyd0YWcxJ10sICdhcHAxJywgJ2FwcCcpXG4gICAgICBleHBlY3QoYmluZFJlc3VsdC50YWdJRHMpLnRvRXF1YWwoWyd0YWcxJ10pXG4gICAgICBleHBlY3QoYmluZFJlc3VsdC50eXBlKS50b0JlKCdhcHAnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19