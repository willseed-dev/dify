"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const base_1 = require("./base");
(0, vitest_1.describe)('handleStream', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Invalid response data handling', () => {
        (0, vitest_1.it)('should handle null bufferObj from JSON.parse gracefully', async () => {
            // Arrange
            const onData = vitest_1.vi.fn();
            const onCompleted = vitest_1.vi.fn();
            // Create a mock response that returns 'data: null'
            const mockReader = {
                read: vitest_1.vi.fn()
                    .mockResolvedValueOnce({
                    done: false,
                    value: new TextEncoder().encode('data: null\n'),
                })
                    .mockResolvedValueOnce({
                    done: true,
                    value: undefined,
                }),
            };
            const mockResponse = {
                ok: true,
                body: {
                    getReader: () => mockReader,
                },
            };
            // Act
            (0, base_1.handleStream)(mockResponse, onData, onCompleted);
            // Wait for the stream to be processed
            await new Promise(resolve => setTimeout(resolve, 50));
            // Assert
            (0, vitest_1.expect)(onData).toHaveBeenCalledWith('', true, {
                conversationId: undefined,
                messageId: '',
                errorMessage: 'Invalid response data',
                errorCode: 'invalid_data',
            });
            (0, vitest_1.expect)(onCompleted).toHaveBeenCalledWith(true, 'Invalid response data');
        });
        (0, vitest_1.it)('should handle non-object bufferObj from JSON.parse gracefully', async () => {
            // Arrange
            const onData = vitest_1.vi.fn();
            const onCompleted = vitest_1.vi.fn();
            // Create a mock response that returns a primitive value
            const mockReader = {
                read: vitest_1.vi.fn()
                    .mockResolvedValueOnce({
                    done: false,
                    value: new TextEncoder().encode('data: "string"\n'),
                })
                    .mockResolvedValueOnce({
                    done: true,
                    value: undefined,
                }),
            };
            const mockResponse = {
                ok: true,
                body: {
                    getReader: () => mockReader,
                },
            };
            // Act
            (0, base_1.handleStream)(mockResponse, onData, onCompleted);
            // Wait for the stream to be processed
            await new Promise(resolve => setTimeout(resolve, 50));
            // Assert
            (0, vitest_1.expect)(onData).toHaveBeenCalledWith('', true, {
                conversationId: undefined,
                messageId: '',
                errorMessage: 'Invalid response data',
                errorCode: 'invalid_data',
            });
            (0, vitest_1.expect)(onCompleted).toHaveBeenCalledWith(true, 'Invalid response data');
        });
        (0, vitest_1.it)('should handle valid message event correctly', async () => {
            // Arrange
            const onData = vitest_1.vi.fn();
            const onCompleted = vitest_1.vi.fn();
            const validMessage = {
                event: 'message',
                answer: 'Hello world',
                conversation_id: 'conv-123',
                task_id: 'task-456',
                id: 'msg-789',
            };
            const mockReader = {
                read: vitest_1.vi.fn()
                    .mockResolvedValueOnce({
                    done: false,
                    value: new TextEncoder().encode(`data: ${JSON.stringify(validMessage)}\n`),
                })
                    .mockResolvedValueOnce({
                    done: true,
                    value: undefined,
                }),
            };
            const mockResponse = {
                ok: true,
                body: {
                    getReader: () => mockReader,
                },
            };
            // Act
            (0, base_1.handleStream)(mockResponse, onData, onCompleted);
            // Wait for the stream to be processed
            await new Promise(resolve => setTimeout(resolve, 50));
            // Assert
            (0, vitest_1.expect)(onData).toHaveBeenCalledWith('Hello world', true, {
                conversationId: 'conv-123',
                taskId: 'task-456',
                messageId: 'msg-789',
            });
            (0, vitest_1.expect)(onCompleted).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should handle error status 400 correctly', async () => {
            // Arrange
            const onData = vitest_1.vi.fn();
            const onCompleted = vitest_1.vi.fn();
            const errorMessage = {
                status: 400,
                message: 'Bad request',
                code: 'bad_request',
            };
            const mockReader = {
                read: vitest_1.vi.fn()
                    .mockResolvedValueOnce({
                    done: false,
                    value: new TextEncoder().encode(`data: ${JSON.stringify(errorMessage)}\n`),
                })
                    .mockResolvedValueOnce({
                    done: true,
                    value: undefined,
                }),
            };
            const mockResponse = {
                ok: true,
                body: {
                    getReader: () => mockReader,
                },
            };
            // Act
            (0, base_1.handleStream)(mockResponse, onData, onCompleted);
            // Wait for the stream to be processed
            await new Promise(resolve => setTimeout(resolve, 50));
            // Assert
            (0, vitest_1.expect)(onData).toHaveBeenCalledWith('', false, {
                conversationId: undefined,
                messageId: '',
                errorMessage: 'Bad request',
                errorCode: 'bad_request',
            });
            (0, vitest_1.expect)(onCompleted).toHaveBeenCalledWith(true, 'Bad request');
        });
        (0, vitest_1.it)('should handle malformed JSON gracefully', async () => {
            // Arrange
            const onData = vitest_1.vi.fn();
            const onCompleted = vitest_1.vi.fn();
            const mockReader = {
                read: vitest_1.vi.fn()
                    .mockResolvedValueOnce({
                    done: false,
                    value: new TextEncoder().encode('data: {invalid json}\n'),
                })
                    .mockResolvedValueOnce({
                    done: true,
                    value: undefined,
                }),
            };
            const mockResponse = {
                ok: true,
                body: {
                    getReader: () => mockReader,
                },
            };
            // Act
            (0, base_1.handleStream)(mockResponse, onData, onCompleted);
            // Wait for the stream to be processed
            await new Promise(resolve => setTimeout(resolve, 50));
            // Assert - malformed JSON triggers the catch block which calls onData and returns
            (0, vitest_1.expect)(onData).toHaveBeenCalled();
            (0, vitest_1.expect)(onCompleted).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should throw error when response is not ok', () => {
            // Arrange
            const onData = vitest_1.vi.fn();
            const mockResponse = {
                ok: false,
            };
            // Act & Assert
            (0, vitest_1.expect)(() => (0, base_1.handleStream)(mockResponse, onData)).toThrow('Network response was not ok');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTZEO0FBQzdELGlDQUFxQztBQUVyQyxJQUFBLGlCQUFRLEVBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxJQUFBLFdBQUUsRUFBQyx5REFBeUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN2RSxVQUFVO1lBQ1YsTUFBTSxNQUFNLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBQ3RCLE1BQU0sV0FBVyxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUUzQixtREFBbUQ7WUFDbkQsTUFBTSxVQUFVLEdBQUc7Z0JBQ2pCLElBQUksRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO3FCQUNWLHFCQUFxQixDQUFDO29CQUNyQixJQUFJLEVBQUUsS0FBSztvQkFDWCxLQUFLLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO2lCQUNoRCxDQUFDO3FCQUNELHFCQUFxQixDQUFDO29CQUNyQixJQUFJLEVBQUUsSUFBSTtvQkFDVixLQUFLLEVBQUUsU0FBUztpQkFDakIsQ0FBQzthQUNMLENBQUE7WUFFRCxNQUFNLFlBQVksR0FBRztnQkFDbkIsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVO2lCQUM1QjthQUNxQixDQUFBO1lBRXhCLE1BQU07WUFDTixJQUFBLG1CQUFZLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUUvQyxzQ0FBc0M7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QUcsRUFBRSxDQUFDLElBQUEsbUJBQVksRUFBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtRQUN6RixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBoYW5kbGVTdHJlYW0gfSBmcm9tICcuL2Jhc2UnXG5cbmRlc2NyaWJlKCdoYW5kbGVTdHJlYW0nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJbnZhbGlkIHJlc3BvbnNlIGRhdGEgaGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBidWZmZXJPYmogZnJvbSBKU09OLnBhcnNlIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkRhdGEgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkNvbXBsZXRlZCA9IHZpLmZuKClcblxuICAgICAgLy8gQ3JlYXRlIGEgbW9jayByZXNwb25zZSB0aGF0IHJldHVybnMgJ2RhdGE6IG51bGwnXG4gICAgICBjb25zdCBtb2NrUmVhZGVyID0ge1xuICAgICAgICByZWFkOiB2aS5mbigpXG4gICAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoJ2RhdGE6IG51bGxcXG4nKSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgfSksXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vY2tSZXNwb25zZSA9IHtcbiAgICAgICAgb2s6IHRydWUsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBnZXRSZWFkZXI6ICgpID0+IG1vY2tSZWFkZXIsXG4gICAgICAgIH0sXG4gICAgICB9IGFzIHVua25vd24gYXMgUmVzcG9uc2VcblxuICAgICAgLy8gQWN0XG4gICAgICBoYW5kbGVTdHJlYW0obW9ja1Jlc3BvbnNlLCBvbkRhdGEsIG9uQ29tcGxldGVkKVxuXG4gICAgICAvLyBXYWl0IGZvciB0aGUgc3RyZWFtIHRvIGJlIHByb2Nlc3NlZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25EYXRhKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnJywgdHJ1ZSwge1xuICAgICAgICBjb252ZXJzYXRpb25JZDogdW5kZWZpbmVkLFxuICAgICAgICBtZXNzYWdlSWQ6ICcnLFxuICAgICAgICBlcnJvck1lc3NhZ2U6ICdJbnZhbGlkIHJlc3BvbnNlIGRhdGEnLFxuICAgICAgICBlcnJvckNvZGU6ICdpbnZhbGlkX2RhdGEnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkNvbXBsZXRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSwgJ0ludmFsaWQgcmVzcG9uc2UgZGF0YScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG5vbi1vYmplY3QgYnVmZmVyT2JqIGZyb20gSlNPTi5wYXJzZSBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25EYXRhID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25Db21wbGV0ZWQgPSB2aS5mbigpXG5cbiAgICAgIC8vIENyZWF0ZSBhIG1vY2sgcmVzcG9uc2UgdGhhdCByZXR1cm5zIGEgcHJpbWl0aXZlIHZhbHVlXG4gICAgICBjb25zdCBtb2NrUmVhZGVyID0ge1xuICAgICAgICByZWFkOiB2aS5mbigpXG4gICAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoJ2RhdGE6IFwic3RyaW5nXCJcXG4nKSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgfSksXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vY2tSZXNwb25zZSA9IHtcbiAgICAgICAgb2s6IHRydWUsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBnZXRSZWFkZXI6ICgpID0+IG1vY2tSZWFkZXIsXG4gICAgICAgIH0sXG4gICAgICB9IGFzIHVua25vd24gYXMgUmVzcG9uc2VcblxuICAgICAgLy8gQWN0XG4gICAgICBoYW5kbGVTdHJlYW0obW9ja1Jlc3BvbnNlLCBvbkRhdGEsIG9uQ29tcGxldGVkKVxuXG4gICAgICAvLyBXYWl0IGZvciB0aGUgc3RyZWFtIHRvIGJlIHByb2Nlc3NlZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25EYXRhKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnJywgdHJ1ZSwge1xuICAgICAgICBjb252ZXJzYXRpb25JZDogdW5kZWZpbmVkLFxuICAgICAgICBtZXNzYWdlSWQ6ICcnLFxuICAgICAgICBlcnJvck1lc3NhZ2U6ICdJbnZhbGlkIHJlc3BvbnNlIGRhdGEnLFxuICAgICAgICBlcnJvckNvZGU6ICdpbnZhbGlkX2RhdGEnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkNvbXBsZXRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSwgJ0ludmFsaWQgcmVzcG9uc2UgZGF0YScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbGlkIG1lc3NhZ2UgZXZlbnQgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25EYXRhID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25Db21wbGV0ZWQgPSB2aS5mbigpXG5cbiAgICAgIGNvbnN0IHZhbGlkTWVzc2FnZSA9IHtcbiAgICAgICAgZXZlbnQ6ICdtZXNzYWdlJyxcbiAgICAgICAgYW5zd2VyOiAnSGVsbG8gd29ybGQnLFxuICAgICAgICBjb252ZXJzYXRpb25faWQ6ICdjb252LTEyMycsXG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTQ1NicsXG4gICAgICAgIGlkOiAnbXNnLTc4OScsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vY2tSZWFkZXIgPSB7XG4gICAgICAgIHJlYWQ6IHZpLmZuKClcbiAgICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShgZGF0YTogJHtKU09OLnN0cmluZ2lmeSh2YWxpZE1lc3NhZ2UpfVxcbmApLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgICBkb25lOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9ja1Jlc3BvbnNlID0ge1xuICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIGdldFJlYWRlcjogKCkgPT4gbW9ja1JlYWRlcixcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgdW5rbm93biBhcyBSZXNwb25zZVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGhhbmRsZVN0cmVhbShtb2NrUmVzcG9uc2UsIG9uRGF0YSwgb25Db21wbGV0ZWQpXG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBzdHJlYW0gdG8gYmUgcHJvY2Vzc2VkXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTApKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkRhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdIZWxsbyB3b3JsZCcsIHRydWUsIHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252LTEyMycsXG4gICAgICAgIHRhc2tJZDogJ3Rhc2stNDU2JyxcbiAgICAgICAgbWVzc2FnZUlkOiAnbXNnLTc4OScsXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG9uQ29tcGxldGVkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXJyb3Igc3RhdHVzIDQwMCBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkRhdGEgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkNvbXBsZXRlZCA9IHZpLmZuKClcblxuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ge1xuICAgICAgICBzdGF0dXM6IDQwMCxcbiAgICAgICAgbWVzc2FnZTogJ0JhZCByZXF1ZXN0JyxcbiAgICAgICAgY29kZTogJ2JhZF9yZXF1ZXN0JyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9ja1JlYWRlciA9IHtcbiAgICAgICAgcmVhZDogdmkuZm4oKVxuICAgICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGBkYXRhOiAke0pTT04uc3RyaW5naWZ5KGVycm9yTWVzc2FnZSl9XFxuYCksXG4gICAgICAgICAgfSlcbiAgICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICAgIGRvbmU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2NrUmVzcG9uc2UgPSB7XG4gICAgICAgIG9rOiB0cnVlLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZ2V0UmVhZGVyOiAoKSA9PiBtb2NrUmVhZGVyLFxuICAgICAgICB9LFxuICAgICAgfSBhcyB1bmtub3duIGFzIFJlc3BvbnNlXG5cbiAgICAgIC8vIEFjdFxuICAgICAgaGFuZGxlU3RyZWFtKG1vY2tSZXNwb25zZSwgb25EYXRhLCBvbkNvbXBsZXRlZClcblxuICAgICAgLy8gV2FpdCBmb3IgdGhlIHN0cmVhbSB0byBiZSBwcm9jZXNzZWRcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uRGF0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycsIGZhbHNlLCB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiB1bmRlZmluZWQsXG4gICAgICAgIG1lc3NhZ2VJZDogJycsXG4gICAgICAgIGVycm9yTWVzc2FnZTogJ0JhZCByZXF1ZXN0JyxcbiAgICAgICAgZXJyb3JDb2RlOiAnYmFkX3JlcXVlc3QnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkNvbXBsZXRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSwgJ0JhZCByZXF1ZXN0JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWFsZm9ybWVkIEpTT04gZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uRGF0YSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uQ29tcGxldGVkID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCBtb2NrUmVhZGVyID0ge1xuICAgICAgICByZWFkOiB2aS5mbigpXG4gICAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoJ2RhdGE6IHtpbnZhbGlkIGpzb259XFxuJyksXG4gICAgICAgICAgfSlcbiAgICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICAgIGRvbmU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2NrUmVzcG9uc2UgPSB7XG4gICAgICAgIG9rOiB0cnVlLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZ2V0UmVhZGVyOiAoKSA9PiBtb2NrUmVhZGVyLFxuICAgICAgICB9LFxuICAgICAgfSBhcyB1bmtub3duIGFzIFJlc3BvbnNlXG5cbiAgICAgIC8vIEFjdFxuICAgICAgaGFuZGxlU3RyZWFtKG1vY2tSZXNwb25zZSwgb25EYXRhLCBvbkNvbXBsZXRlZClcblxuICAgICAgLy8gV2FpdCBmb3IgdGhlIHN0cmVhbSB0byBiZSBwcm9jZXNzZWRcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MCkpXG5cbiAgICAgIC8vIEFzc2VydCAtIG1hbGZvcm1lZCBKU09OIHRyaWdnZXJzIHRoZSBjYXRjaCBibG9jayB3aGljaCBjYWxscyBvbkRhdGEgYW5kIHJldHVybnNcbiAgICAgIGV4cGVjdChvbkRhdGEpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG9uQ29tcGxldGVkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciB3aGVuIHJlc3BvbnNlIGlzIG5vdCBvaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uRGF0YSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG1vY2tSZXNwb25zZSA9IHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgfSBhcyB1bmtub3duIGFzIFJlc3BvbnNlXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IGhhbmRsZVN0cmVhbShtb2NrUmVzcG9uc2UsIG9uRGF0YSkpLnRvVGhyb3coJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvaycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=