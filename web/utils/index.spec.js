"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe('sleep', () => {
    it('should wait for the specified time', async () => {
        const timeVariance = 10;
        const sleepTime = 100;
        const start = Date.now();
        await (0, index_1.sleep)(sleepTime);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(sleepTime - timeVariance);
    });
});
describe('asyncRunSafe', () => {
    it('should return [null, result] when promise resolves', async () => {
        const result = await (0, index_1.asyncRunSafe)(Promise.resolve('success'));
        expect(result).toEqual([null, 'success']);
    });
    it('should return [error] when promise rejects', async () => {
        const error = new Error('test error');
        const result = await (0, index_1.asyncRunSafe)(Promise.reject(error));
        expect(result).toEqual([error]);
    });
    it('should return [Error] when promise rejects with undefined', async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        const result = await (0, index_1.asyncRunSafe)(Promise.reject());
        expect(result[0]).toBeInstanceOf(Error);
        expect(result[0]?.message).toBe('unknown error');
    });
});
describe('getTextWidthWithCanvas', () => {
    let originalCreateElement;
    beforeEach(() => {
        // Store original implementation
        originalCreateElement = document.createElement;
        // Mock canvas and context
        const measureTextMock = vi.fn().mockReturnValue({ width: 100 });
        const getContextMock = vi.fn().mockReturnValue({
            measureText: measureTextMock,
            font: '',
        });
        document.createElement = vi.fn().mockReturnValue({
            getContext: getContextMock,
        });
    });
    afterEach(() => {
        // Restore original implementation
        document.createElement = originalCreateElement;
    });
    it('should return the width of text', () => {
        const width = (0, index_1.getTextWidthWithCanvas)('test text');
        expect(width).toBe(100);
    });
    it('should return 0 if context is not available', () => {
        // Override mock for this test
        document.createElement = vi.fn().mockReturnValue({
            getContext: () => null,
        });
        const width = (0, index_1.getTextWidthWithCanvas)('test text');
        expect(width).toBe(0);
    });
});
describe('randomString', () => {
    it('should generate string of specified length', () => {
        const result = (0, index_1.randomString)(10);
        expect(result.length).toBe(10);
    });
    it('should only contain valid characters', () => {
        const result = (0, index_1.randomString)(100);
        const validChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
        for (const char of result)
            expect(validChars).toContain(char);
    });
    it('should generate different strings on consecutive calls', () => {
        const result1 = (0, index_1.randomString)(20);
        const result2 = (0, index_1.randomString)(20);
        expect(result1).not.toEqual(result2);
    });
});
describe('getPurifyHref', () => {
    it('should return empty string for falsy input', () => {
        expect((0, index_1.getPurifyHref)('')).toBe('');
        expect((0, index_1.getPurifyHref)(undefined)).toBe('');
    });
    it('should escape HTML characters', () => {
        expect((0, index_1.getPurifyHref)('<script>alert("xss")</script>')).not.toContain('<script>');
    });
});
describe('fetchWithRetry', () => {
    it('should return successfully on first try', async () => {
        const successData = { status: 'success' };
        const promise = Promise.resolve(successData);
        const result = await (0, index_1.fetchWithRetry)(promise);
        expect(result).toEqual([null, successData]);
    });
    // it('should retry and succeed on second attempt', async () => {
    //   let attemptCount = 0
    //   const mockFn = new Promise((resolve, reject) => {
    //     attemptCount++
    //     if (attemptCount === 1)
    //       reject(new Error('First attempt failed'))
    //     else
    //       resolve('success')
    //   })
    //   const result = await fetchWithRetry(mockFn)
    //   expect(result).toEqual([null, 'success'])
    //   expect(attemptCount).toBe(2)
    // })
    // it('should stop after max retries and return last error', async () => {
    //   const testError = new Error('Test error')
    //   const promise = Promise.reject(testError)
    //   const result = await fetchWithRetry(promise, 2)
    //   expect(result).toEqual([testError])
    // })
    // it('should handle non-Error rejection with custom error', async () => {
    //   const stringError = 'string error message'
    //   const promise = Promise.reject(stringError)
    //   const result = await fetchWithRetry(promise, 0)
    //   expect(result[0]).toBeInstanceOf(Error)
    //   expect(result[0]?.message).toBe('unknown error')
    // })
    // it('should use default 3 retries when retries parameter is not provided', async () => {
    //   let attempts = 0
    //   const mockFn = () => new Promise((resolve, reject) => {
    //     attempts++
    //     reject(new Error(`Attempt ${attempts} failed`))
    //   })
    //   await fetchWithRetry(mockFn())
    //   expect(attempts).toBe(4) // Initial attempt + 3 retries
    // })
});
describe('correctModelProvider', () => {
    it('should return empty string for falsy input', () => {
        expect((0, index_1.correctModelProvider)('')).toBe('');
    });
    it('should return the provider if it already contains a slash', () => {
        expect((0, index_1.correctModelProvider)('company/model')).toBe('company/model');
    });
    it('should format google provider correctly', () => {
        expect((0, index_1.correctModelProvider)('google')).toBe('langgenius/gemini/google');
    });
    it('should format standard providers correctly', () => {
        expect((0, index_1.correctModelProvider)('openai')).toBe('langgenius/openai/openai');
    });
});
describe('correctToolProvider', () => {
    it('should return empty string for falsy input', () => {
        expect((0, index_1.correctToolProvider)('')).toBe('');
    });
    it('should return the provider if toolInCollectionList is true', () => {
        expect((0, index_1.correctToolProvider)('any-provider', true)).toBe('any-provider');
    });
    it('should return the provider if it already contains a slash', () => {
        expect((0, index_1.correctToolProvider)('company/tool')).toBe('company/tool');
    });
    it('should format special tool providers correctly', () => {
        expect((0, index_1.correctToolProvider)('stepfun')).toBe('langgenius/stepfun_tool/stepfun');
        expect((0, index_1.correctToolProvider)('jina')).toBe('langgenius/jina_tool/jina');
    });
    it('should format standard tool providers correctly', () => {
        expect((0, index_1.correctToolProvider)('standard')).toBe('langgenius/standard/standard');
    });
});
describe('canFindTool', () => {
    it('should match when IDs are identical', () => {
        expect((0, index_1.canFindTool)('tool-id', 'tool-id')).toBe(true);
    });
    it('should match when provider ID is formatted with standard pattern', () => {
        expect((0, index_1.canFindTool)('langgenius/tool-id/tool-id', 'tool-id')).toBe(true);
    });
    it('should match when provider ID is formatted with tool pattern', () => {
        expect((0, index_1.canFindTool)('langgenius/tool-id_tool/tool-id', 'tool-id')).toBe(true);
    });
    it('should not match when IDs are completely different', () => {
        expect((0, index_1.canFindTool)('provider-a', 'tool-b')).toBe(false);
    });
});
describe('sleep', () => {
    it('should resolve after specified milliseconds', async () => {
        const start = Date.now();
        await (0, index_1.sleep)(100);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });
    it('should handle zero milliseconds', async () => {
        await expect((0, index_1.sleep)(0)).resolves.toBeUndefined();
    });
});
describe('asyncRunSafe extended', () => {
    it('should handle promise that resolves with null', async () => {
        const [error, result] = await (0, index_1.asyncRunSafe)(Promise.resolve(null));
        expect(error).toBeNull();
        expect(result).toBeNull();
    });
    it('should handle promise that resolves with undefined', async () => {
        const [error, result] = await (0, index_1.asyncRunSafe)(Promise.resolve(undefined));
        expect(error).toBeNull();
        expect(result).toBeUndefined();
    });
    it('should handle promise that resolves with false', async () => {
        const [error, result] = await (0, index_1.asyncRunSafe)(Promise.resolve(false));
        expect(error).toBeNull();
        expect(result).toBe(false);
    });
    it('should handle promise that resolves with 0', async () => {
        const [error, result] = await (0, index_1.asyncRunSafe)(Promise.resolve(0));
        expect(error).toBeNull();
        expect(result).toBe(0);
    });
    // TODO: pre-commit blocks this test case
    // Error msg: "Expected the Promise rejection reason to be an Error"
    // it('should handle promise that rejects with null', async () => {
    //   const [error] = await asyncRunSafe(Promise.reject(null))
    //   expect(error).toBeInstanceOf(Error)
    //   expect(error?.message).toBe('unknown error')
    // })
});
describe('getTextWidthWithCanvas', () => {
    it('should return 0 when canvas context is not available', () => {
        const mockGetContext = vi.fn().mockReturnValue(null);
        vi.spyOn(document, 'createElement').mockReturnValue({
            getContext: mockGetContext,
        });
        const width = (0, index_1.getTextWidthWithCanvas)('test');
        expect(width).toBe(0);
        vi.restoreAllMocks();
    });
    it('should measure text width with custom font', () => {
        const mockMeasureText = vi.fn().mockReturnValue({ width: 123.456 });
        const mockContext = {
            font: '',
            measureText: mockMeasureText,
        };
        vi.spyOn(document, 'createElement').mockReturnValue({
            getContext: vi.fn().mockReturnValue(mockContext),
        });
        const width = (0, index_1.getTextWidthWithCanvas)('test', '16px Arial');
        expect(mockContext.font).toBe('16px Arial');
        expect(width).toBe(123.46);
        vi.restoreAllMocks();
    });
    it('should handle empty string', () => {
        const mockMeasureText = vi.fn().mockReturnValue({ width: 0 });
        vi.spyOn(document, 'createElement').mockReturnValue({
            getContext: vi.fn().mockReturnValue({
                font: '',
                measureText: mockMeasureText,
            }),
        });
        const width = (0, index_1.getTextWidthWithCanvas)('');
        expect(width).toBe(0);
        vi.restoreAllMocks();
    });
});
describe('randomString extended', () => {
    it('should generate string of exact length', () => {
        expect((0, index_1.randomString)(10).length).toBe(10);
        expect((0, index_1.randomString)(50).length).toBe(50);
        expect((0, index_1.randomString)(100).length).toBe(100);
    });
    it('should generate different strings on multiple calls', () => {
        const str1 = (0, index_1.randomString)(20);
        const str2 = (0, index_1.randomString)(20);
        const str3 = (0, index_1.randomString)(20);
        expect(str1).not.toBe(str2);
        expect(str2).not.toBe(str3);
        expect(str1).not.toBe(str3);
    });
    it('should only contain valid characters', () => {
        const validChars = /^[\w-]+$/;
        const str = (0, index_1.randomString)(100);
        expect(validChars.test(str)).toBe(true);
    });
    it('should handle length of 1', () => {
        const str = (0, index_1.randomString)(1);
        expect(str.length).toBe(1);
    });
    it('should handle length of 0', () => {
        const str = (0, index_1.randomString)(0);
        expect(str).toBe('');
    });
});
describe('getPurifyHref extended', () => {
    it('should escape HTML entities', () => {
        expect((0, index_1.getPurifyHref)('<script>alert(1)</script>')).not.toContain('<script>');
        expect((0, index_1.getPurifyHref)('test&test')).toContain('&amp;');
        expect((0, index_1.getPurifyHref)('test"test')).toContain('&quot;');
    });
    it('should handle URLs with query parameters', () => {
        const url = 'https://example.com?param=<script>';
        const purified = (0, index_1.getPurifyHref)(url);
        expect(purified).not.toContain('<script>');
    });
    it('should handle empty string', () => {
        expect((0, index_1.getPurifyHref)('')).toBe('');
    });
    it('should handle null/undefined', () => {
        expect((0, index_1.getPurifyHref)(null)).toBe('');
        expect((0, index_1.getPurifyHref)(undefined)).toBe('');
    });
});
describe('fetchWithRetry extended', () => {
    it('should succeed on first try', async () => {
        const [error, result] = await (0, index_1.fetchWithRetry)(Promise.resolve('success'));
        expect(error).toBeNull();
        expect(result).toBe('success');
    });
    it('should return error when promise rejects', async () => {
        let attempts = 0;
        const failingPromise = () => {
            attempts++;
            return Promise.reject(new Error('fail'));
        };
        const [error] = await (0, index_1.fetchWithRetry)(failingPromise(), 3);
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('fail');
        expect(attempts).toBe(1);
    });
    it('should surface rejection from a settled promise', async () => {
        let attempts = 0;
        const eventuallySucceed = new Promise((resolve, reject) => {
            attempts++;
            if (attempts < 2)
                reject(new Error('not yet'));
            else
                resolve('success');
        });
        const [error] = await (0, index_1.fetchWithRetry)(eventuallySucceed, 3);
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('not yet');
        expect(attempts).toBe(1);
    });
    /*
    TODO: Commented this case because of eslint
    Error msg: Expected the Promise rejection reason to be an Error
    */
    // it('should handle non-Error rejections', async () => {
    //   const [error] = await fetchWithRetry(Promise.reject('string error'), 0)
    //   expect(error).toBeInstanceOf(Error)
    // })
});
describe('correctModelProvider extended', () => {
    it('should handle empty string', () => {
        expect((0, index_1.correctModelProvider)('')).toBe('');
    });
    it('should not modify provider with slash', () => {
        expect((0, index_1.correctModelProvider)('custom/provider/model')).toBe('custom/provider/model');
    });
    it('should handle google provider', () => {
        expect((0, index_1.correctModelProvider)('google')).toBe('langgenius/gemini/google');
    });
    it('should handle standard providers', () => {
        expect((0, index_1.correctModelProvider)('openai')).toBe('langgenius/openai/openai');
        expect((0, index_1.correctModelProvider)('anthropic')).toBe('langgenius/anthropic/anthropic');
    });
    it('should handle null/undefined', () => {
        expect((0, index_1.correctModelProvider)(null)).toBe('');
        expect((0, index_1.correctModelProvider)(undefined)).toBe('');
    });
});
describe('correctToolProvider extended', () => {
    it('should return as-is when toolInCollectionList is true', () => {
        expect((0, index_1.correctToolProvider)('any-provider', true)).toBe('any-provider');
        expect((0, index_1.correctToolProvider)('', true)).toBe('');
    });
    it('should not modify provider with slash when not in collection', () => {
        expect((0, index_1.correctToolProvider)('custom/tool/provider', false)).toBe('custom/tool/provider');
    });
    it('should handle special tool providers', () => {
        expect((0, index_1.correctToolProvider)('stepfun', false)).toBe('langgenius/stepfun_tool/stepfun');
        expect((0, index_1.correctToolProvider)('jina', false)).toBe('langgenius/jina_tool/jina');
        expect((0, index_1.correctToolProvider)('siliconflow', false)).toBe('langgenius/siliconflow_tool/siliconflow');
        expect((0, index_1.correctToolProvider)('gitee_ai', false)).toBe('langgenius/gitee_ai_tool/gitee_ai');
    });
    it('should handle standard tool providers', () => {
        expect((0, index_1.correctToolProvider)('standard', false)).toBe('langgenius/standard/standard');
    });
});
describe('canFindTool extended', () => {
    it('should match exact provider ID', () => {
        expect((0, index_1.canFindTool)('openai', 'openai')).toBe(true);
    });
    it('should match langgenius format', () => {
        expect((0, index_1.canFindTool)('langgenius/openai/openai', 'openai')).toBe(true);
    });
    it('should match tool format', () => {
        expect((0, index_1.canFindTool)('langgenius/jina_tool/jina', 'jina')).toBe(true);
    });
    it('should not match different providers', () => {
        expect((0, index_1.canFindTool)('openai', 'anthropic')).toBe(false);
    });
    it('should handle undefined oldToolId', () => {
        expect((0, index_1.canFindTool)('openai', undefined)).toBe(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FVZ0I7QUFFaEIsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xELE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQTtRQUN2QixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUE7UUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sSUFBQSxhQUFLLEVBQUMsU0FBUyxDQUFDLENBQUE7UUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQTtRQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsc0JBQXNCLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFBO0lBQ2xFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixFQUFFLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLG9CQUFZLEVBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzdELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUMzQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsb0JBQVksRUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsMkRBQTJELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDekUsd0RBQXdEO1FBQ3hELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxvQkFBWSxFQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDbEQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsSUFBSSxxQkFBb0QsQ0FBQTtJQUV4RCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsZ0NBQWdDO1FBQ2hDLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUE7UUFFOUMsMEJBQTBCO1FBQzFCLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUMvRCxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDO1lBQzdDLFdBQVcsRUFBRSxlQUFlO1lBQzVCLElBQUksRUFBRSxFQUFFO1NBQ1QsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDO1lBQy9DLFVBQVUsRUFBRSxjQUFjO1NBQzNCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLGtDQUFrQztRQUNsQyxRQUFRLENBQUMsYUFBYSxHQUFHLHFCQUFxQixDQUFBO0lBQ2hELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFBLDhCQUFzQixFQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDekIsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELDhCQUE4QjtRQUM5QixRQUFRLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDL0MsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDdkIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxLQUFLLEdBQUcsSUFBQSw4QkFBc0IsRUFBQyxXQUFXLENBQUMsQ0FBQTtRQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELE1BQU0sTUFBTSxHQUFHLElBQUEsb0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtRQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNoQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBQSxvQkFBWSxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLGtFQUFrRSxDQUFBO1FBQ3JGLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTTtZQUN2QixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxNQUFNLE9BQU8sR0FBRyxJQUFBLG9CQUFZLEVBQUMsRUFBRSxDQUFDLENBQUE7UUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELE1BQU0sQ0FBQyxJQUFBLHFCQUFhLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDbEMsTUFBTSxDQUFDLElBQUEscUJBQWEsRUFBQyxTQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDbEQsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFBLHFCQUFhLEVBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbEYsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFBO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLHNCQUFjLEVBQUMsT0FBTyxDQUFDLENBQUE7UUFFNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0lBRUYsaUVBQWlFO0lBQ2pFLHlCQUF5QjtJQUN6QixzREFBc0Q7SUFDdEQscUJBQXFCO0lBQ3JCLDhCQUE4QjtJQUM5QixrREFBa0Q7SUFDbEQsV0FBVztJQUNYLDJCQUEyQjtJQUMzQixPQUFPO0lBRVAsZ0RBQWdEO0lBRWhELDhDQUE4QztJQUM5QyxpQ0FBaUM7SUFDakMsS0FBSztJQUVMLDBFQUEwRTtJQUMxRSw4Q0FBOEM7SUFDOUMsOENBQThDO0lBRTlDLG9EQUFvRDtJQUVwRCx3Q0FBd0M7SUFDeEMsS0FBSztJQUVMLDBFQUEwRTtJQUMxRSwrQ0FBK0M7SUFDL0MsZ0RBQWdEO0lBRWhELG9EQUFvRDtJQUVwRCw0Q0FBNEM7SUFDNUMscURBQXFEO0lBQ3JELEtBQUs7SUFFTCwwRkFBMEY7SUFDMUYscUJBQXFCO0lBQ3JCLDREQUE0RDtJQUM1RCxpQkFBaUI7SUFDakIsc0RBQXNEO0lBQ3RELE9BQU87SUFFUCxtQ0FBbUM7SUFFbkMsNERBQTREO0lBQzVELEtBQUs7QUFDUCxDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxNQUFNLENBQUMsSUFBQSw0QkFBb0IsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMzQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsTUFBTSxDQUFDLElBQUEsNEJBQW9CLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDckUsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELE1BQU0sQ0FBQyxJQUFBLDRCQUFvQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDekUsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELE1BQU0sQ0FBQyxJQUFBLDRCQUFvQixFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDekUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxNQUFNLENBQUMsSUFBQSwyQkFBbUIsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMxQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxDQUFDLElBQUEsMkJBQW1CLEVBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ3hFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtRQUNuRSxNQUFNLENBQUMsSUFBQSwyQkFBbUIsRUFBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7UUFDeEQsTUFBTSxDQUFDLElBQUEsMkJBQW1CLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtRQUM5RSxNQUFNLENBQUMsSUFBQSwyQkFBbUIsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0lBQ3ZFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUN6RCxNQUFNLENBQUMsSUFBQSwyQkFBbUIsRUFBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQzlFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sQ0FBQyxJQUFBLG1CQUFXLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtRQUMxRSxNQUFNLENBQUMsSUFBQSxtQkFBVyxFQUFDLDRCQUE0QixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3pFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtRQUN0RSxNQUFNLENBQUMsSUFBQSxtQkFBVyxFQUFDLGlDQUFpQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxNQUFNLENBQUMsSUFBQSxtQkFBVyxFQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUN4QixNQUFNLElBQUEsYUFBSyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUN0QixNQUFNLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUMsdUJBQXVCO0lBQ3hFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9DLE1BQU0sTUFBTSxDQUFDLElBQUEsYUFBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ2pELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM3RCxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sSUFBQSxvQkFBWSxFQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNqRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQzNCLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFBLG9CQUFZLEVBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsZ0RBQWdELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUQsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUEsb0JBQVksRUFBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUQsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUEsb0JBQVksRUFBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDeEIsQ0FBQyxDQUFDLENBQUE7SUFFRix5Q0FBeUM7SUFDekMsb0VBQW9FO0lBRXBFLG1FQUFtRTtJQUNuRSw2REFBNkQ7SUFDN0Qsd0NBQXdDO0lBQ3hDLGlEQUFpRDtJQUNqRCxLQUFLO0FBQ1AsQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwRCxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDbEQsVUFBVSxFQUFFLGNBQWM7U0FDcEIsQ0FBQyxDQUFBO1FBRVQsTUFBTSxLQUFLLEdBQUcsSUFBQSw4QkFBc0IsRUFBQyxNQUFNLENBQUMsQ0FBQTtRQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXJCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUN0QixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ25FLE1BQU0sV0FBVyxHQUFHO1lBQ2xCLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLGVBQWU7U0FDN0IsQ0FBQTtRQUNELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUNsRCxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7U0FDMUMsQ0FBQyxDQUFBO1FBRVQsTUFBTSxLQUFLLEdBQUcsSUFBQSw4QkFBc0IsRUFBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFDMUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUUxQixFQUFFLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3RCxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDbEQsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxlQUFlO2FBQzdCLENBQUM7U0FDSSxDQUFDLENBQUE7UUFFVCxNQUFNLEtBQUssR0FBRyxJQUFBLDhCQUFzQixFQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFckIsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFBO0lBQ3RCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDaEQsTUFBTSxDQUFDLElBQUEsb0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDeEMsTUFBTSxDQUFDLElBQUEsb0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDeEMsTUFBTSxDQUFDLElBQUEsb0JBQVksRUFBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUMsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQzdELE1BQU0sSUFBSSxHQUFHLElBQUEsb0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtRQUM3QixNQUFNLElBQUksR0FBRyxJQUFBLG9CQUFZLEVBQUMsRUFBRSxDQUFDLENBQUE7UUFDN0IsTUFBTSxJQUFJLEdBQUcsSUFBQSxvQkFBWSxFQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBQSxvQkFBWSxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3pDLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtRQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFBLG9CQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUEsb0JBQVksRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDckMsTUFBTSxDQUFDLElBQUEscUJBQWEsRUFBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUM1RSxNQUFNLENBQUMsSUFBQSxxQkFBYSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JELE1BQU0sQ0FBQyxJQUFBLHFCQUFhLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDeEQsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ2xELE1BQU0sR0FBRyxHQUFHLG9DQUFvQyxDQUFBO1FBQ2hELE1BQU0sUUFBUSxHQUFHLElBQUEscUJBQWEsRUFBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsTUFBTSxDQUFDLElBQUEscUJBQWEsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7UUFDdEMsTUFBTSxDQUFDLElBQUEscUJBQWEsRUFBQyxJQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMzQyxNQUFNLENBQUMsSUFBQSxxQkFBYSxFQUFDLFNBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNsRCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUEsc0JBQWMsRUFBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7UUFDeEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsMENBQTBDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFBO1FBQ2hCLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtZQUMxQixRQUFRLEVBQUUsQ0FBQTtZQUNWLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQTtRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUEsc0JBQWMsRUFBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25DLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25DLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUIsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFBO1FBQ2hCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEQsUUFBUSxFQUFFLENBQUE7WUFDVixJQUFJLFFBQVEsR0FBRyxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBOztnQkFFNUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3RCLENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBQSxzQkFBYyxFQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzFELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxQixDQUFDLENBQUMsQ0FBQTtJQUVGOzs7TUFHRTtJQUNGLHlEQUF5RDtJQUN6RCw0RUFBNEU7SUFDNUUsd0NBQXdDO0lBQ3hDLEtBQUs7QUFDUCxDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7SUFDN0MsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLENBQUMsSUFBQSw0QkFBb0IsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMzQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsTUFBTSxDQUFDLElBQUEsNEJBQW9CLEVBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0lBQ3JGLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUN2QyxNQUFNLENBQUMsSUFBQSw0QkFBb0IsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQ3pFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtRQUMxQyxNQUFNLENBQUMsSUFBQSw0QkFBb0IsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBQ3ZFLE1BQU0sQ0FBQyxJQUFBLDRCQUFvQixFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDbEYsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxJQUFBLDRCQUFvQixFQUFDLElBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxJQUFBLDRCQUFvQixFQUFDLFNBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtJQUM1QyxFQUFFLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1FBQy9ELE1BQU0sQ0FBQyxJQUFBLDJCQUFtQixFQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN0RSxNQUFNLENBQUMsSUFBQSwyQkFBbUIsRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3RFLE1BQU0sQ0FBQyxJQUFBLDJCQUFtQixFQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7SUFDekYsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQzlDLE1BQU0sQ0FBQyxJQUFBLDJCQUFtQixFQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO1FBQ3JGLE1BQU0sQ0FBQyxJQUFBLDJCQUFtQixFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1FBQzVFLE1BQU0sQ0FBQyxJQUFBLDJCQUFtQixFQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO1FBQ2pHLE1BQU0sQ0FBQyxJQUFBLDJCQUFtQixFQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO0lBQzFGLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxNQUFNLENBQUMsSUFBQSwyQkFBbUIsRUFBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQTtJQUNyRixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxJQUFBLG1CQUFXLEVBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtRQUN4QyxNQUFNLENBQUMsSUFBQSxtQkFBVyxFQUFDLDBCQUEwQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxNQUFNLENBQUMsSUFBQSxtQkFBVyxFQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3JFLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxNQUFNLENBQUMsSUFBQSxtQkFBVyxFQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN4RCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDM0MsTUFBTSxDQUFDLElBQUEsbUJBQVcsRUFBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFzeW5jUnVuU2FmZSxcbiAgY2FuRmluZFRvb2wsXG4gIGNvcnJlY3RNb2RlbFByb3ZpZGVyLFxuICBjb3JyZWN0VG9vbFByb3ZpZGVyLFxuICBmZXRjaFdpdGhSZXRyeSxcbiAgZ2V0UHVyaWZ5SHJlZixcbiAgZ2V0VGV4dFdpZHRoV2l0aENhbnZhcyxcbiAgcmFuZG9tU3RyaW5nLFxuICBzbGVlcCxcbn0gZnJvbSAnLi9pbmRleCdcblxuZGVzY3JpYmUoJ3NsZWVwJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHdhaXQgZm9yIHRoZSBzcGVjaWZpZWQgdGltZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0aW1lVmFyaWFuY2UgPSAxMFxuICAgIGNvbnN0IHNsZWVwVGltZSA9IDEwMFxuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgIGF3YWl0IHNsZWVwKHNsZWVwVGltZSlcbiAgICBjb25zdCBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIHN0YXJ0XG4gICAgZXhwZWN0KGVsYXBzZWQpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoc2xlZXBUaW1lIC0gdGltZVZhcmlhbmNlKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ2FzeW5jUnVuU2FmZScsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gW251bGwsIHJlc3VsdF0gd2hlbiBwcm9taXNlIHJlc29sdmVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFzeW5jUnVuU2FmZShQcm9taXNlLnJlc29sdmUoJ3N1Y2Nlc3MnKSlcbiAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtudWxsLCAnc3VjY2VzcyddKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIFtlcnJvcl0gd2hlbiBwcm9taXNlIHJlamVjdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ3Rlc3QgZXJyb3InKVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFzeW5jUnVuU2FmZShQcm9taXNlLnJlamVjdChlcnJvcikpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbZXJyb3JdKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIFtFcnJvcl0gd2hlbiBwcm9taXNlIHJlamVjdHMgd2l0aCB1bmRlZmluZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1wcm9taXNlLXJlamVjdC1lcnJvcnNcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhc3luY1J1blNhZmUoUHJvbWlzZS5yZWplY3QoKSlcbiAgICBleHBlY3QocmVzdWx0WzBdKS50b0JlSW5zdGFuY2VPZihFcnJvcilcbiAgICBleHBlY3QocmVzdWx0WzBdPy5tZXNzYWdlKS50b0JlKCd1bmtub3duIGVycm9yJylcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdnZXRUZXh0V2lkdGhXaXRoQ2FudmFzJywgKCkgPT4ge1xuICBsZXQgb3JpZ2luYWxDcmVhdGVFbGVtZW50OiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIFN0b3JlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uXG4gICAgb3JpZ2luYWxDcmVhdGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXG4gICAgLy8gTW9jayBjYW52YXMgYW5kIGNvbnRleHRcbiAgICBjb25zdCBtZWFzdXJlVGV4dE1vY2sgPSB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7IHdpZHRoOiAxMDAgfSlcbiAgICBjb25zdCBnZXRDb250ZXh0TW9jayA9IHZpLmZuKCkubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIG1lYXN1cmVUZXh0OiBtZWFzdXJlVGV4dE1vY2ssXG4gICAgICBmb250OiAnJyxcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9IHZpLmZuKCkubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGdldENvbnRleHQ6IGdldENvbnRleHRNb2NrLFxuICAgIH0pXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAvLyBSZXN0b3JlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uXG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9IG9yaWdpbmFsQ3JlYXRlRWxlbWVudFxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRoZSB3aWR0aCBvZiB0ZXh0JywgKCkgPT4ge1xuICAgIGNvbnN0IHdpZHRoID0gZ2V0VGV4dFdpZHRoV2l0aENhbnZhcygndGVzdCB0ZXh0JylcbiAgICBleHBlY3Qod2lkdGgpLnRvQmUoMTAwKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIDAgaWYgY29udGV4dCBpcyBub3QgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgIC8vIE92ZXJyaWRlIG1vY2sgZm9yIHRoaXMgdGVzdFxuICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgPSB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBnZXRDb250ZXh0OiAoKSA9PiBudWxsLFxuICAgIH0pXG5cbiAgICBjb25zdCB3aWR0aCA9IGdldFRleHRXaWR0aFdpdGhDYW52YXMoJ3Rlc3QgdGV4dCcpXG4gICAgZXhwZWN0KHdpZHRoKS50b0JlKDApXG4gIH0pXG59KVxuXG5kZXNjcmliZSgncmFuZG9tU3RyaW5nJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIGdlbmVyYXRlIHN0cmluZyBvZiBzcGVjaWZpZWQgbGVuZ3RoJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHJhbmRvbVN0cmluZygxMClcbiAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9CZSgxMClcbiAgfSlcblxuICBpdCgnc2hvdWxkIG9ubHkgY29udGFpbiB2YWxpZCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHJhbmRvbVN0cmluZygxMDApXG4gICAgY29uc3QgdmFsaWRDaGFycyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWi1fJ1xuICAgIGZvciAoY29uc3QgY2hhciBvZiByZXN1bHQpXG4gICAgICBleHBlY3QodmFsaWRDaGFycykudG9Db250YWluKGNoYXIpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBnZW5lcmF0ZSBkaWZmZXJlbnQgc3RyaW5ncyBvbiBjb25zZWN1dGl2ZSBjYWxscycsICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQxID0gcmFuZG9tU3RyaW5nKDIwKVxuICAgIGNvbnN0IHJlc3VsdDIgPSByYW5kb21TdHJpbmcoMjApXG4gICAgZXhwZWN0KHJlc3VsdDEpLm5vdC50b0VxdWFsKHJlc3VsdDIpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnZ2V0UHVyaWZ5SHJlZicsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgc3RyaW5nIGZvciBmYWxzeSBpbnB1dCcsICgpID0+IHtcbiAgICBleHBlY3QoZ2V0UHVyaWZ5SHJlZignJykpLnRvQmUoJycpXG4gICAgZXhwZWN0KGdldFB1cmlmeUhyZWYodW5kZWZpbmVkIGFzIGFueSkpLnRvQmUoJycpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBlc2NhcGUgSFRNTCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIGV4cGVjdChnZXRQdXJpZnlIcmVmKCc8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+JykpLm5vdC50b0NvbnRhaW4oJzxzY3JpcHQ+JylcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdmZXRjaFdpdGhSZXRyeScsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gc3VjY2Vzc2Z1bGx5IG9uIGZpcnN0IHRyeScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzdWNjZXNzRGF0YSA9IHsgc3RhdHVzOiAnc3VjY2VzcycgfVxuICAgIGNvbnN0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoc3VjY2Vzc0RhdGEpXG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaFdpdGhSZXRyeShwcm9taXNlKVxuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbbnVsbCwgc3VjY2Vzc0RhdGFdKVxuICB9KVxuXG4gIC8vIGl0KCdzaG91bGQgcmV0cnkgYW5kIHN1Y2NlZWQgb24gc2Vjb25kIGF0dGVtcHQnLCBhc3luYyAoKSA9PiB7XG4gIC8vICAgbGV0IGF0dGVtcHRDb3VudCA9IDBcbiAgLy8gICBjb25zdCBtb2NrRm4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIC8vICAgICBhdHRlbXB0Q291bnQrK1xuICAvLyAgICAgaWYgKGF0dGVtcHRDb3VudCA9PT0gMSlcbiAgLy8gICAgICAgcmVqZWN0KG5ldyBFcnJvcignRmlyc3QgYXR0ZW1wdCBmYWlsZWQnKSlcbiAgLy8gICAgIGVsc2VcbiAgLy8gICAgICAgcmVzb2x2ZSgnc3VjY2VzcycpXG4gIC8vICAgfSlcblxuICAvLyAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZldGNoV2l0aFJldHJ5KG1vY2tGbilcblxuICAvLyAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW251bGwsICdzdWNjZXNzJ10pXG4gIC8vICAgZXhwZWN0KGF0dGVtcHRDb3VudCkudG9CZSgyKVxuICAvLyB9KVxuXG4gIC8vIGl0KCdzaG91bGQgc3RvcCBhZnRlciBtYXggcmV0cmllcyBhbmQgcmV0dXJuIGxhc3QgZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gIC8vICAgY29uc3QgdGVzdEVycm9yID0gbmV3IEVycm9yKCdUZXN0IGVycm9yJylcbiAgLy8gICBjb25zdCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QodGVzdEVycm9yKVxuXG4gIC8vICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2hXaXRoUmV0cnkocHJvbWlzZSwgMilcblxuICAvLyAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW3Rlc3RFcnJvcl0pXG4gIC8vIH0pXG5cbiAgLy8gaXQoJ3Nob3VsZCBoYW5kbGUgbm9uLUVycm9yIHJlamVjdGlvbiB3aXRoIGN1c3RvbSBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgLy8gICBjb25zdCBzdHJpbmdFcnJvciA9ICdzdHJpbmcgZXJyb3IgbWVzc2FnZSdcbiAgLy8gICBjb25zdCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3Qoc3RyaW5nRXJyb3IpXG5cbiAgLy8gICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaFdpdGhSZXRyeShwcm9taXNlLCAwKVxuXG4gIC8vICAgZXhwZWN0KHJlc3VsdFswXSkudG9CZUluc3RhbmNlT2YoRXJyb3IpXG4gIC8vICAgZXhwZWN0KHJlc3VsdFswXT8ubWVzc2FnZSkudG9CZSgndW5rbm93biBlcnJvcicpXG4gIC8vIH0pXG5cbiAgLy8gaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCAzIHJldHJpZXMgd2hlbiByZXRyaWVzIHBhcmFtZXRlciBpcyBub3QgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gIC8vICAgbGV0IGF0dGVtcHRzID0gMFxuICAvLyAgIGNvbnN0IG1vY2tGbiA9ICgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgLy8gICAgIGF0dGVtcHRzKytcbiAgLy8gICAgIHJlamVjdChuZXcgRXJyb3IoYEF0dGVtcHQgJHthdHRlbXB0c30gZmFpbGVkYCkpXG4gIC8vICAgfSlcblxuICAvLyAgIGF3YWl0IGZldGNoV2l0aFJldHJ5KG1vY2tGbigpKVxuXG4gIC8vICAgZXhwZWN0KGF0dGVtcHRzKS50b0JlKDQpIC8vIEluaXRpYWwgYXR0ZW1wdCArIDMgcmV0cmllc1xuICAvLyB9KVxufSlcblxuZGVzY3JpYmUoJ2NvcnJlY3RNb2RlbFByb3ZpZGVyJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBzdHJpbmcgZm9yIGZhbHN5IGlucHV0JywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0TW9kZWxQcm92aWRlcignJykpLnRvQmUoJycpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHByb3ZpZGVyIGlmIGl0IGFscmVhZHkgY29udGFpbnMgYSBzbGFzaCcsICgpID0+IHtcbiAgICBleHBlY3QoY29ycmVjdE1vZGVsUHJvdmlkZXIoJ2NvbXBhbnkvbW9kZWwnKSkudG9CZSgnY29tcGFueS9tb2RlbCcpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBmb3JtYXQgZ29vZ2xlIHByb3ZpZGVyIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBleHBlY3QoY29ycmVjdE1vZGVsUHJvdmlkZXIoJ2dvb2dsZScpKS50b0JlKCdsYW5nZ2VuaXVzL2dlbWluaS9nb29nbGUnKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZm9ybWF0IHN0YW5kYXJkIHByb3ZpZGVycyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNvcnJlY3RNb2RlbFByb3ZpZGVyKCdvcGVuYWknKSkudG9CZSgnbGFuZ2dlbml1cy9vcGVuYWkvb3BlbmFpJylcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdjb3JyZWN0VG9vbFByb3ZpZGVyJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBzdHJpbmcgZm9yIGZhbHN5IGlucHV0JywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0VG9vbFByb3ZpZGVyKCcnKSkudG9CZSgnJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiB0aGUgcHJvdmlkZXIgaWYgdG9vbEluQ29sbGVjdGlvbkxpc3QgaXMgdHJ1ZScsICgpID0+IHtcbiAgICBleHBlY3QoY29ycmVjdFRvb2xQcm92aWRlcignYW55LXByb3ZpZGVyJywgdHJ1ZSkpLnRvQmUoJ2FueS1wcm92aWRlcicpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHByb3ZpZGVyIGlmIGl0IGFscmVhZHkgY29udGFpbnMgYSBzbGFzaCcsICgpID0+IHtcbiAgICBleHBlY3QoY29ycmVjdFRvb2xQcm92aWRlcignY29tcGFueS90b29sJykpLnRvQmUoJ2NvbXBhbnkvdG9vbCcpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBmb3JtYXQgc3BlY2lhbCB0b29sIHByb3ZpZGVycyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNvcnJlY3RUb29sUHJvdmlkZXIoJ3N0ZXBmdW4nKSkudG9CZSgnbGFuZ2dlbml1cy9zdGVwZnVuX3Rvb2wvc3RlcGZ1bicpXG4gICAgZXhwZWN0KGNvcnJlY3RUb29sUHJvdmlkZXIoJ2ppbmEnKSkudG9CZSgnbGFuZ2dlbml1cy9qaW5hX3Rvb2wvamluYScpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBmb3JtYXQgc3RhbmRhcmQgdG9vbCBwcm92aWRlcnMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0VG9vbFByb3ZpZGVyKCdzdGFuZGFyZCcpKS50b0JlKCdsYW5nZ2VuaXVzL3N0YW5kYXJkL3N0YW5kYXJkJylcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdjYW5GaW5kVG9vbCcsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBtYXRjaCB3aGVuIElEcyBhcmUgaWRlbnRpY2FsJywgKCkgPT4ge1xuICAgIGV4cGVjdChjYW5GaW5kVG9vbCgndG9vbC1pZCcsICd0b29sLWlkJykpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIG1hdGNoIHdoZW4gcHJvdmlkZXIgSUQgaXMgZm9ybWF0dGVkIHdpdGggc3RhbmRhcmQgcGF0dGVybicsICgpID0+IHtcbiAgICBleHBlY3QoY2FuRmluZFRvb2woJ2xhbmdnZW5pdXMvdG9vbC1pZC90b29sLWlkJywgJ3Rvb2wtaWQnKSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbWF0Y2ggd2hlbiBwcm92aWRlciBJRCBpcyBmb3JtYXR0ZWQgd2l0aCB0b29sIHBhdHRlcm4nLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNhbkZpbmRUb29sKCdsYW5nZ2VuaXVzL3Rvb2wtaWRfdG9vbC90b29sLWlkJywgJ3Rvb2wtaWQnKSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbm90IG1hdGNoIHdoZW4gSURzIGFyZSBjb21wbGV0ZWx5IGRpZmZlcmVudCcsICgpID0+IHtcbiAgICBleHBlY3QoY2FuRmluZFRvb2woJ3Byb3ZpZGVyLWEnLCAndG9vbC1iJykpLnRvQmUoZmFsc2UpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnc2xlZXAnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmVzb2x2ZSBhZnRlciBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgIGF3YWl0IHNsZWVwKDEwMClcbiAgICBjb25zdCBlbmQgPSBEYXRlLm5vdygpXG4gICAgZXhwZWN0KGVuZCAtIHN0YXJ0KS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDkwKSAvLyBBbGxvdyBzb21lIHRvbGVyYW5jZVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHplcm8gbWlsbGlzZWNvbmRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGV4cGVjdChzbGVlcCgwKSkucmVzb2x2ZXMudG9CZVVuZGVmaW5lZCgpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnYXN5bmNSdW5TYWZlIGV4dGVuZGVkJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIGhhbmRsZSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBudWxsJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFtlcnJvciwgcmVzdWx0XSA9IGF3YWl0IGFzeW5jUnVuU2FmZShQcm9taXNlLnJlc29sdmUobnVsbCkpXG4gICAgZXhwZWN0KGVycm9yKS50b0JlTnVsbCgpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZU51bGwoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHVuZGVmaW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBbZXJyb3IsIHJlc3VsdF0gPSBhd2FpdCBhc3luY1J1blNhZmUoUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCkpXG4gICAgZXhwZWN0KGVycm9yKS50b0JlTnVsbCgpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZVVuZGVmaW5lZCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgW2Vycm9yLCByZXN1bHRdID0gYXdhaXQgYXN5bmNSdW5TYWZlKFByb21pc2UucmVzb2x2ZShmYWxzZSkpXG4gICAgZXhwZWN0KGVycm9yKS50b0JlTnVsbCgpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZShmYWxzZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCAwJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFtlcnJvciwgcmVzdWx0XSA9IGF3YWl0IGFzeW5jUnVuU2FmZShQcm9taXNlLnJlc29sdmUoMCkpXG4gICAgZXhwZWN0KGVycm9yKS50b0JlTnVsbCgpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZSgwKVxuICB9KVxuXG4gIC8vIFRPRE86IHByZS1jb21taXQgYmxvY2tzIHRoaXMgdGVzdCBjYXNlXG4gIC8vIEVycm9yIG1zZzogXCJFeHBlY3RlZCB0aGUgUHJvbWlzZSByZWplY3Rpb24gcmVhc29uIHRvIGJlIGFuIEVycm9yXCJcblxuICAvLyBpdCgnc2hvdWxkIGhhbmRsZSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aXRoIG51bGwnLCBhc3luYyAoKSA9PiB7XG4gIC8vICAgY29uc3QgW2Vycm9yXSA9IGF3YWl0IGFzeW5jUnVuU2FmZShQcm9taXNlLnJlamVjdChudWxsKSlcbiAgLy8gICBleHBlY3QoZXJyb3IpLnRvQmVJbnN0YW5jZU9mKEVycm9yKVxuICAvLyAgIGV4cGVjdChlcnJvcj8ubWVzc2FnZSkudG9CZSgndW5rbm93biBlcnJvcicpXG4gIC8vIH0pXG59KVxuXG5kZXNjcmliZSgnZ2V0VGV4dFdpZHRoV2l0aENhbnZhcycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gMCB3aGVuIGNhbnZhcyBjb250ZXh0IGlzIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja0dldENvbnRleHQgPSB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgIHZpLnNweU9uKGRvY3VtZW50LCAnY3JlYXRlRWxlbWVudCcpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBnZXRDb250ZXh0OiBtb2NrR2V0Q29udGV4dCxcbiAgICB9IGFzIGFueSlcblxuICAgIGNvbnN0IHdpZHRoID0gZ2V0VGV4dFdpZHRoV2l0aENhbnZhcygndGVzdCcpXG4gICAgZXhwZWN0KHdpZHRoKS50b0JlKDApXG5cbiAgICB2aS5yZXN0b3JlQWxsTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbWVhc3VyZSB0ZXh0IHdpZHRoIHdpdGggY3VzdG9tIGZvbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja01lYXN1cmVUZXh0ID0gdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoeyB3aWR0aDogMTIzLjQ1NiB9KVxuICAgIGNvbnN0IG1vY2tDb250ZXh0ID0ge1xuICAgICAgZm9udDogJycsXG4gICAgICBtZWFzdXJlVGV4dDogbW9ja01lYXN1cmVUZXh0LFxuICAgIH1cbiAgICB2aS5zcHlPbihkb2N1bWVudCwgJ2NyZWF0ZUVsZW1lbnQnKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZ2V0Q29udGV4dDogdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUobW9ja0NvbnRleHQpLFxuICAgIH0gYXMgYW55KVxuXG4gICAgY29uc3Qgd2lkdGggPSBnZXRUZXh0V2lkdGhXaXRoQ2FudmFzKCd0ZXN0JywgJzE2cHggQXJpYWwnKVxuICAgIGV4cGVjdChtb2NrQ29udGV4dC5mb250KS50b0JlKCcxNnB4IEFyaWFsJylcbiAgICBleHBlY3Qod2lkdGgpLnRvQmUoMTIzLjQ2KVxuXG4gICAgdmkucmVzdG9yZUFsbE1vY2tzKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja01lYXN1cmVUZXh0ID0gdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoeyB3aWR0aDogMCB9KVxuICAgIHZpLnNweU9uKGRvY3VtZW50LCAnY3JlYXRlRWxlbWVudCcpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBnZXRDb250ZXh0OiB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGZvbnQ6ICcnLFxuICAgICAgICBtZWFzdXJlVGV4dDogbW9ja01lYXN1cmVUZXh0LFxuICAgICAgfSksXG4gICAgfSBhcyBhbnkpXG5cbiAgICBjb25zdCB3aWR0aCA9IGdldFRleHRXaWR0aFdpdGhDYW52YXMoJycpXG4gICAgZXhwZWN0KHdpZHRoKS50b0JlKDApXG5cbiAgICB2aS5yZXN0b3JlQWxsTW9ja3MoKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ3JhbmRvbVN0cmluZyBleHRlbmRlZCcsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBnZW5lcmF0ZSBzdHJpbmcgb2YgZXhhY3QgbGVuZ3RoJywgKCkgPT4ge1xuICAgIGV4cGVjdChyYW5kb21TdHJpbmcoMTApLmxlbmd0aCkudG9CZSgxMClcbiAgICBleHBlY3QocmFuZG9tU3RyaW5nKDUwKS5sZW5ndGgpLnRvQmUoNTApXG4gICAgZXhwZWN0KHJhbmRvbVN0cmluZygxMDApLmxlbmd0aCkudG9CZSgxMDApXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBnZW5lcmF0ZSBkaWZmZXJlbnQgc3RyaW5ncyBvbiBtdWx0aXBsZSBjYWxscycsICgpID0+IHtcbiAgICBjb25zdCBzdHIxID0gcmFuZG9tU3RyaW5nKDIwKVxuICAgIGNvbnN0IHN0cjIgPSByYW5kb21TdHJpbmcoMjApXG4gICAgY29uc3Qgc3RyMyA9IHJhbmRvbVN0cmluZygyMClcbiAgICBleHBlY3Qoc3RyMSkubm90LnRvQmUoc3RyMilcbiAgICBleHBlY3Qoc3RyMikubm90LnRvQmUoc3RyMylcbiAgICBleHBlY3Qoc3RyMSkubm90LnRvQmUoc3RyMylcbiAgfSlcblxuICBpdCgnc2hvdWxkIG9ubHkgY29udGFpbiB2YWxpZCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHZhbGlkQ2hhcnMgPSAvXltcXHctXSskL1xuICAgIGNvbnN0IHN0ciA9IHJhbmRvbVN0cmluZygxMDApXG4gICAgZXhwZWN0KHZhbGlkQ2hhcnMudGVzdChzdHIpKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbGVuZ3RoIG9mIDEnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gcmFuZG9tU3RyaW5nKDEpXG4gICAgZXhwZWN0KHN0ci5sZW5ndGgpLnRvQmUoMSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBsZW5ndGggb2YgMCcsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSByYW5kb21TdHJpbmcoMClcbiAgICBleHBlY3Qoc3RyKS50b0JlKCcnKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ2dldFB1cmlmeUhyZWYgZXh0ZW5kZWQnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgZXNjYXBlIEhUTUwgZW50aXRpZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGdldFB1cmlmeUhyZWYoJzxzY3JpcHQ+YWxlcnQoMSk8L3NjcmlwdD4nKSkubm90LnRvQ29udGFpbignPHNjcmlwdD4nKVxuICAgIGV4cGVjdChnZXRQdXJpZnlIcmVmKCd0ZXN0JnRlc3QnKSkudG9Db250YWluKCcmYW1wOycpXG4gICAgZXhwZWN0KGdldFB1cmlmeUhyZWYoJ3Rlc3RcInRlc3QnKSkudG9Db250YWluKCcmcXVvdDsnKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIFVSTHMgd2l0aCBxdWVyeSBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2V4YW1wbGUuY29tP3BhcmFtPTxzY3JpcHQ+J1xuICAgIGNvbnN0IHB1cmlmaWVkID0gZ2V0UHVyaWZ5SHJlZih1cmwpXG4gICAgZXhwZWN0KHB1cmlmaWVkKS5ub3QudG9Db250YWluKCc8c2NyaXB0PicpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgIGV4cGVjdChnZXRQdXJpZnlIcmVmKCcnKSkudG9CZSgnJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsL3VuZGVmaW5lZCcsICgpID0+IHtcbiAgICBleHBlY3QoZ2V0UHVyaWZ5SHJlZihudWxsIGFzIGFueSkpLnRvQmUoJycpXG4gICAgZXhwZWN0KGdldFB1cmlmeUhyZWYodW5kZWZpbmVkIGFzIGFueSkpLnRvQmUoJycpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnZmV0Y2hXaXRoUmV0cnkgZXh0ZW5kZWQnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgc3VjY2VlZCBvbiBmaXJzdCB0cnknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgW2Vycm9yLCByZXN1bHRdID0gYXdhaXQgZmV0Y2hXaXRoUmV0cnkoUHJvbWlzZS5yZXNvbHZlKCdzdWNjZXNzJykpXG4gICAgZXhwZWN0KGVycm9yKS50b0JlTnVsbCgpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnc3VjY2VzcycpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gZXJyb3Igd2hlbiBwcm9taXNlIHJlamVjdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGF0dGVtcHRzID0gMFxuICAgIGNvbnN0IGZhaWxpbmdQcm9taXNlID0gKCkgPT4ge1xuICAgICAgYXR0ZW1wdHMrK1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignZmFpbCcpKVxuICAgIH1cblxuICAgIGNvbnN0IFtlcnJvcl0gPSBhd2FpdCBmZXRjaFdpdGhSZXRyeShmYWlsaW5nUHJvbWlzZSgpLCAzKVxuICAgIGV4cGVjdChlcnJvcikudG9CZUluc3RhbmNlT2YoRXJyb3IpXG4gICAgZXhwZWN0KGVycm9yPy5tZXNzYWdlKS50b0JlKCdmYWlsJylcbiAgICBleHBlY3QoYXR0ZW1wdHMpLnRvQmUoMSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHN1cmZhY2UgcmVqZWN0aW9uIGZyb20gYSBzZXR0bGVkIHByb21pc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGF0dGVtcHRzID0gMFxuICAgIGNvbnN0IGV2ZW50dWFsbHlTdWNjZWVkID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgYXR0ZW1wdHMrK1xuICAgICAgaWYgKGF0dGVtcHRzIDwgMilcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignbm90IHlldCcpKVxuICAgICAgZWxzZVxuICAgICAgICByZXNvbHZlKCdzdWNjZXNzJylcbiAgICB9KVxuXG4gICAgY29uc3QgW2Vycm9yXSA9IGF3YWl0IGZldGNoV2l0aFJldHJ5KGV2ZW50dWFsbHlTdWNjZWVkLCAzKVxuICAgIGV4cGVjdChlcnJvcikudG9CZUluc3RhbmNlT2YoRXJyb3IpXG4gICAgZXhwZWN0KGVycm9yPy5tZXNzYWdlKS50b0JlKCdub3QgeWV0JylcbiAgICBleHBlY3QoYXR0ZW1wdHMpLnRvQmUoMSlcbiAgfSlcblxuICAvKlxuICBUT0RPOiBDb21tZW50ZWQgdGhpcyBjYXNlIGJlY2F1c2Ugb2YgZXNsaW50XG4gIEVycm9yIG1zZzogRXhwZWN0ZWQgdGhlIFByb21pc2UgcmVqZWN0aW9uIHJlYXNvbiB0byBiZSBhbiBFcnJvclxuICAqL1xuICAvLyBpdCgnc2hvdWxkIGhhbmRsZSBub24tRXJyb3IgcmVqZWN0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgLy8gICBjb25zdCBbZXJyb3JdID0gYXdhaXQgZmV0Y2hXaXRoUmV0cnkoUHJvbWlzZS5yZWplY3QoJ3N0cmluZyBlcnJvcicpLCAwKVxuICAvLyAgIGV4cGVjdChlcnJvcikudG9CZUluc3RhbmNlT2YoRXJyb3IpXG4gIC8vIH0pXG59KVxuXG5kZXNjcmliZSgnY29ycmVjdE1vZGVsUHJvdmlkZXIgZXh0ZW5kZWQnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZycsICgpID0+IHtcbiAgICBleHBlY3QoY29ycmVjdE1vZGVsUHJvdmlkZXIoJycpKS50b0JlKCcnKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbm90IG1vZGlmeSBwcm92aWRlciB3aXRoIHNsYXNoJywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0TW9kZWxQcm92aWRlcignY3VzdG9tL3Byb3ZpZGVyL21vZGVsJykpLnRvQmUoJ2N1c3RvbS9wcm92aWRlci9tb2RlbCcpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZ29vZ2xlIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0TW9kZWxQcm92aWRlcignZ29vZ2xlJykpLnRvQmUoJ2xhbmdnZW5pdXMvZ2VtaW5pL2dvb2dsZScpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RhbmRhcmQgcHJvdmlkZXJzJywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0TW9kZWxQcm92aWRlcignb3BlbmFpJykpLnRvQmUoJ2xhbmdnZW5pdXMvb3BlbmFpL29wZW5haScpXG4gICAgZXhwZWN0KGNvcnJlY3RNb2RlbFByb3ZpZGVyKCdhbnRocm9waWMnKSkudG9CZSgnbGFuZ2dlbml1cy9hbnRocm9waWMvYW50aHJvcGljJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsL3VuZGVmaW5lZCcsICgpID0+IHtcbiAgICBleHBlY3QoY29ycmVjdE1vZGVsUHJvdmlkZXIobnVsbCBhcyBhbnkpKS50b0JlKCcnKVxuICAgIGV4cGVjdChjb3JyZWN0TW9kZWxQcm92aWRlcih1bmRlZmluZWQgYXMgYW55KSkudG9CZSgnJylcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdjb3JyZWN0VG9vbFByb3ZpZGVyIGV4dGVuZGVkJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHJldHVybiBhcy1pcyB3aGVuIHRvb2xJbkNvbGxlY3Rpb25MaXN0IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNvcnJlY3RUb29sUHJvdmlkZXIoJ2FueS1wcm92aWRlcicsIHRydWUpKS50b0JlKCdhbnktcHJvdmlkZXInKVxuICAgIGV4cGVjdChjb3JyZWN0VG9vbFByb3ZpZGVyKCcnLCB0cnVlKSkudG9CZSgnJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIG5vdCBtb2RpZnkgcHJvdmlkZXIgd2l0aCBzbGFzaCB3aGVuIG5vdCBpbiBjb2xsZWN0aW9uJywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0VG9vbFByb3ZpZGVyKCdjdXN0b20vdG9vbC9wcm92aWRlcicsIGZhbHNlKSkudG9CZSgnY3VzdG9tL3Rvb2wvcHJvdmlkZXInKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgdG9vbCBwcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNvcnJlY3RUb29sUHJvdmlkZXIoJ3N0ZXBmdW4nLCBmYWxzZSkpLnRvQmUoJ2xhbmdnZW5pdXMvc3RlcGZ1bl90b29sL3N0ZXBmdW4nKVxuICAgIGV4cGVjdChjb3JyZWN0VG9vbFByb3ZpZGVyKCdqaW5hJywgZmFsc2UpKS50b0JlKCdsYW5nZ2VuaXVzL2ppbmFfdG9vbC9qaW5hJylcbiAgICBleHBlY3QoY29ycmVjdFRvb2xQcm92aWRlcignc2lsaWNvbmZsb3cnLCBmYWxzZSkpLnRvQmUoJ2xhbmdnZW5pdXMvc2lsaWNvbmZsb3dfdG9vbC9zaWxpY29uZmxvdycpXG4gICAgZXhwZWN0KGNvcnJlY3RUb29sUHJvdmlkZXIoJ2dpdGVlX2FpJywgZmFsc2UpKS50b0JlKCdsYW5nZ2VuaXVzL2dpdGVlX2FpX3Rvb2wvZ2l0ZWVfYWknKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHN0YW5kYXJkIHRvb2wgcHJvdmlkZXJzJywgKCkgPT4ge1xuICAgIGV4cGVjdChjb3JyZWN0VG9vbFByb3ZpZGVyKCdzdGFuZGFyZCcsIGZhbHNlKSkudG9CZSgnbGFuZ2dlbml1cy9zdGFuZGFyZC9zdGFuZGFyZCcpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnY2FuRmluZFRvb2wgZXh0ZW5kZWQnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgbWF0Y2ggZXhhY3QgcHJvdmlkZXIgSUQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNhbkZpbmRUb29sKCdvcGVuYWknLCAnb3BlbmFpJykpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIG1hdGNoIGxhbmdnZW5pdXMgZm9ybWF0JywgKCkgPT4ge1xuICAgIGV4cGVjdChjYW5GaW5kVG9vbCgnbGFuZ2dlbml1cy9vcGVuYWkvb3BlbmFpJywgJ29wZW5haScpKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBtYXRjaCB0b29sIGZvcm1hdCcsICgpID0+IHtcbiAgICBleHBlY3QoY2FuRmluZFRvb2woJ2xhbmdnZW5pdXMvamluYV90b29sL2ppbmEnLCAnamluYScpKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBub3QgbWF0Y2ggZGlmZmVyZW50IHByb3ZpZGVycycsICgpID0+IHtcbiAgICBleHBlY3QoY2FuRmluZFRvb2woJ29wZW5haScsICdhbnRocm9waWMnKSkudG9CZShmYWxzZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgb2xkVG9vbElkJywgKCkgPT4ge1xuICAgIGV4cGVjdChjYW5GaW5kVG9vbCgnb3BlbmFpJywgdW5kZWZpbmVkKSkudG9CZShmYWxzZSlcbiAgfSlcbn0pXG4iXX0=