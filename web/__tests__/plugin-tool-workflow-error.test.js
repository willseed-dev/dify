"use strict";
/**
 * Test cases to reproduce the plugin tool workflow error
 * Issue: #23154 - Application error when loading plugin tools in workflow
 * Root cause: split() operation called on null/undefined values
 */
describe('Plugin Tool Workflow Error Reproduction', () => {
    /**
     * Mock function to simulate the problematic code in switch-plugin-version.tsx:29
     * const [pluginId] = uniqueIdentifier.split(':')
     */
    const mockSwitchPluginVersionLogic = (uniqueIdentifier) => {
        // This directly reproduces the problematic line from switch-plugin-version.tsx:29
        const [pluginId] = uniqueIdentifier.split(':');
        return pluginId;
    };
    /**
     * Test case 1: Simulate null uniqueIdentifier
     * This should reproduce the error mentioned in the issue
     */
    it('should reproduce error when uniqueIdentifier is null', () => {
        expect(() => {
            mockSwitchPluginVersionLogic(null);
        }).toThrow('Cannot read properties of null (reading \'split\')');
    });
    /**
     * Test case 2: Simulate undefined uniqueIdentifier
     */
    it('should reproduce error when uniqueIdentifier is undefined', () => {
        expect(() => {
            mockSwitchPluginVersionLogic(undefined);
        }).toThrow('Cannot read properties of undefined (reading \'split\')');
    });
    /**
     * Test case 3: Simulate empty string uniqueIdentifier
     */
    it('should handle empty string uniqueIdentifier', () => {
        expect(() => {
            const result = mockSwitchPluginVersionLogic('');
            expect(result).toBe(''); // Empty string split by ':' returns ['']
        }).not.toThrow();
    });
    /**
     * Test case 4: Simulate malformed uniqueIdentifier without colon separator
     */
    it('should handle malformed uniqueIdentifier without colon separator', () => {
        expect(() => {
            const result = mockSwitchPluginVersionLogic('malformed-identifier-without-colon');
            expect(result).toBe('malformed-identifier-without-colon'); // No colon means full string returned
        }).not.toThrow();
    });
    /**
     * Test case 5: Simulate valid uniqueIdentifier
     */
    it('should work correctly with valid uniqueIdentifier', () => {
        expect(() => {
            const result = mockSwitchPluginVersionLogic('valid-plugin-id:1.0.0');
            expect(result).toBe('valid-plugin-id');
        }).not.toThrow();
    });
});
/**
 * Test for the variable processing split error in use-single-run-form-params
 */
describe('Variable Processing Split Error', () => {
    /**
     * Mock function to simulate the problematic code in use-single-run-form-params.ts:91
     * const getDependentVars = () => {
     *   return varInputs.map(item => item.variable.slice(1, -1).split('.'))
     * }
     */
    const mockGetDependentVars = (varInputs) => {
        return varInputs.map((item) => {
            // Guard against null/undefined variable to prevent app crash
            if (!item.variable || typeof item.variable !== 'string')
                return [];
            return item.variable.slice(1, -1).split('.');
        }).filter(arr => arr.length > 0); // Filter out empty arrays
    };
    /**
     * Test case 1: Variable processing with null variable
     */
    it('should handle null variable safely', () => {
        const varInputs = [{ variable: null }];
        expect(() => {
            mockGetDependentVars(varInputs);
        }).not.toThrow();
        const result = mockGetDependentVars(varInputs);
        expect(result).toEqual([]); // null variables are filtered out
    });
    /**
     * Test case 2: Variable processing with undefined variable
     */
    it('should handle undefined variable safely', () => {
        const varInputs = [{ variable: undefined }];
        expect(() => {
            mockGetDependentVars(varInputs);
        }).not.toThrow();
        const result = mockGetDependentVars(varInputs);
        expect(result).toEqual([]); // undefined variables are filtered out
    });
    /**
     * Test case 3: Variable processing with empty string
     */
    it('should handle empty string variable', () => {
        const varInputs = [{ variable: '' }];
        expect(() => {
            mockGetDependentVars(varInputs);
        }).not.toThrow();
        const result = mockGetDependentVars(varInputs);
        expect(result).toEqual([]); // Empty string is filtered out, so result is empty array
    });
    /**
     * Test case 4: Variable processing with valid variable format
     */
    it('should work correctly with valid variable format', () => {
        const varInputs = [{ variable: '{{workflow.node.output}}' }];
        expect(() => {
            mockGetDependentVars(varInputs);
        }).not.toThrow();
        const result = mockGetDependentVars(varInputs);
        expect(result[0]).toEqual(['{workflow', 'node', 'output}']);
    });
});
/**
 * Integration test to simulate the complete workflow scenario
 */
describe('Plugin Tool Workflow Integration', () => {
    /**
     * Simulate the scenario where plugin metadata is incomplete or corrupted
     * This can happen when:
     * 1. Plugin is being loaded from marketplace but metadata request fails
     * 2. Plugin configuration is corrupted in database
     * 3. Network issues during plugin loading
     */
    it('should reproduce the client-side exception scenario', () => {
        // Mock incomplete plugin data that could cause the error
        const incompletePluginData = {
            // Missing or null uniqueIdentifier
            uniqueIdentifier: null,
            meta: null,
            minimum_dify_version: undefined,
        };
        // This simulates the error path that leads to the white screen
        expect(() => {
            // Simulate the code path in switch-plugin-version.tsx:29
            // The actual problematic code doesn't use optional chaining
            const _pluginId = incompletePluginData.uniqueIdentifier.split(':')[0];
        }).toThrow('Cannot read properties of null (reading \'split\')');
    });
    /**
     * Test the scenario mentioned in the issue where plugin tools are loaded in workflow
     */
    it('should simulate plugin tool loading in workflow context', () => {
        // Mock the workflow context where plugin tools are being loaded
        const workflowPluginTools = [
            {
                provider_name: 'test-plugin',
                uniqueIdentifier: null, // This is the problematic case
                tool_name: 'test-tool',
            },
            {
                provider_name: 'valid-plugin',
                uniqueIdentifier: 'valid-plugin:1.0.0',
                tool_name: 'valid-tool',
            },
        ];
        // Process each plugin tool
        workflowPluginTools.forEach((tool, _index) => {
            if (tool.uniqueIdentifier === null) {
                // This reproduces the exact error scenario
                expect(() => {
                    const _pluginId = tool.uniqueIdentifier.split(':')[0];
                }).toThrow();
            }
            else {
                // Valid tools should work fine
                expect(() => {
                    const _pluginId = tool.uniqueIdentifier.split(':')[0];
                }).not.toThrow();
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXRvb2wtd29ya2Zsb3ctZXJyb3IudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsdWdpbi10b29sLXdvcmtmbG93LWVycm9yLnRlc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHO0FBRUgsUUFBUSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtJQUN2RDs7O09BR0c7SUFDSCxNQUFNLDRCQUE0QixHQUFHLENBQUMsZ0JBQTJDLEVBQUUsRUFBRTtRQUNuRixrRkFBa0Y7UUFDbEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGdCQUFpQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMvQyxPQUFPLFFBQVEsQ0FBQTtJQUNqQixDQUFDLENBQUE7SUFFRDs7O09BR0c7SUFDSCxFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQzlELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDViw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtJQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUVGOztPQUVHO0lBQ0gsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtRQUNuRSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsNEJBQTRCLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHlEQUF5RCxDQUFDLENBQUE7SUFDdkUsQ0FBQyxDQUFDLENBQUE7SUFFRjs7T0FFRztJQUNILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLE1BQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUEs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QUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUN2RCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDbEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdCBjYXNlcyB0byByZXByb2R1Y2UgdGhlIHBsdWdpbiB0b29sIHdvcmtmbG93IGVycm9yXG4gKiBJc3N1ZTogIzIzMTU0IC0gQXBwbGljYXRpb24gZXJyb3Igd2hlbiBsb2FkaW5nIHBsdWdpbiB0b29scyBpbiB3b3JrZmxvd1xuICogUm9vdCBjYXVzZTogc3BsaXQoKSBvcGVyYXRpb24gY2FsbGVkIG9uIG51bGwvdW5kZWZpbmVkIHZhbHVlc1xuICovXG5cbmRlc2NyaWJlKCdQbHVnaW4gVG9vbCBXb3JrZmxvdyBFcnJvciBSZXByb2R1Y3Rpb24nLCAoKSA9PiB7XG4gIC8qKlxuICAgKiBNb2NrIGZ1bmN0aW9uIHRvIHNpbXVsYXRlIHRoZSBwcm9ibGVtYXRpYyBjb2RlIGluIHN3aXRjaC1wbHVnaW4tdmVyc2lvbi50c3g6MjlcbiAgICogY29uc3QgW3BsdWdpbklkXSA9IHVuaXF1ZUlkZW50aWZpZXIuc3BsaXQoJzonKVxuICAgKi9cbiAgY29uc3QgbW9ja1N3aXRjaFBsdWdpblZlcnNpb25Mb2dpYyA9ICh1bmlxdWVJZGVudGlmaWVyOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiB7XG4gICAgLy8gVGhpcyBkaXJlY3RseSByZXByb2R1Y2VzIHRoZSBwcm9ibGVtYXRpYyBsaW5lIGZyb20gc3dpdGNoLXBsdWdpbi12ZXJzaW9uLnRzeDoyOVxuICAgIGNvbnN0IFtwbHVnaW5JZF0gPSB1bmlxdWVJZGVudGlmaWVyIS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIHBsdWdpbklkXG4gIH1cblxuICAvKipcbiAgICogVGVzdCBjYXNlIDE6IFNpbXVsYXRlIG51bGwgdW5pcXVlSWRlbnRpZmllclxuICAgKiBUaGlzIHNob3VsZCByZXByb2R1Y2UgdGhlIGVycm9yIG1lbnRpb25lZCBpbiB0aGUgaXNzdWVcbiAgICovXG4gIGl0KCdzaG91bGQgcmVwcm9kdWNlIGVycm9yIHdoZW4gdW5pcXVlSWRlbnRpZmllciBpcyBudWxsJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBtb2NrU3dpdGNoUGx1Z2luVmVyc2lvbkxvZ2ljKG51bGwpXG4gICAgfSkudG9UaHJvdygnQ2Fubm90IHJlYWQgcHJvcGVydGllcyBvZiBudWxsIChyZWFkaW5nIFxcJ3NwbGl0XFwnKScpXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3QgY2FzZSAyOiBTaW11bGF0ZSB1bmRlZmluZWQgdW5pcXVlSWRlbnRpZmllclxuICAgKi9cbiAgaXQoJ3Nob3VsZCByZXByb2R1Y2UgZXJyb3Igd2hlbiB1bmlxdWVJZGVudGlmaWVyIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbW9ja1N3aXRjaFBsdWdpblZlcnNpb25Mb2dpYyh1bmRlZmluZWQpXG4gICAgfSkudG9UaHJvdygnQ2Fubm90IHJlYWQgcHJvcGVydGllcyBvZiB1bmRlZmluZWQgKHJlYWRpbmcgXFwnc3BsaXRcXCcpJylcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCBjYXNlIDM6IFNpbXVsYXRlIGVtcHR5IHN0cmluZyB1bmlxdWVJZGVudGlmaWVyXG4gICAqL1xuICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgdW5pcXVlSWRlbnRpZmllcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbW9ja1N3aXRjaFBsdWdpblZlcnNpb25Mb2dpYygnJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJycpIC8vIEVtcHR5IHN0cmluZyBzcGxpdCBieSAnOicgcmV0dXJucyBbJyddXG4gICAgfSkubm90LnRvVGhyb3coKVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0IGNhc2UgNDogU2ltdWxhdGUgbWFsZm9ybWVkIHVuaXF1ZUlkZW50aWZpZXIgd2l0aG91dCBjb2xvbiBzZXBhcmF0b3JcbiAgICovXG4gIGl0KCdzaG91bGQgaGFuZGxlIG1hbGZvcm1lZCB1bmlxdWVJZGVudGlmaWVyIHdpdGhvdXQgY29sb24gc2VwYXJhdG9yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtb2NrU3dpdGNoUGx1Z2luVmVyc2lvbkxvZ2ljKCdtYWxmb3JtZWQtaWRlbnRpZmllci13aXRob3V0LWNvbG9uJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJ21hbGZvcm1lZC1pZGVudGlmaWVyLXdpdGhvdXQtY29sb24nKSAvLyBObyBjb2xvbiBtZWFucyBmdWxsIHN0cmluZyByZXR1cm5lZFxuICAgIH0pLm5vdC50b1Rocm93KClcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCBjYXNlIDU6IFNpbXVsYXRlIHZhbGlkIHVuaXF1ZUlkZW50aWZpZXJcbiAgICovXG4gIGl0KCdzaG91bGQgd29yayBjb3JyZWN0bHkgd2l0aCB2YWxpZCB1bmlxdWVJZGVudGlmaWVyJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtb2NrU3dpdGNoUGx1Z2luVmVyc2lvbkxvZ2ljKCd2YWxpZC1wbHVnaW4taWQ6MS4wLjAnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgndmFsaWQtcGx1Z2luLWlkJylcbiAgICB9KS5ub3QudG9UaHJvdygpXG4gIH0pXG59KVxuXG4vKipcbiAqIFRlc3QgZm9yIHRoZSB2YXJpYWJsZSBwcm9jZXNzaW5nIHNwbGl0IGVycm9yIGluIHVzZS1zaW5nbGUtcnVuLWZvcm0tcGFyYW1zXG4gKi9cbmRlc2NyaWJlKCdWYXJpYWJsZSBQcm9jZXNzaW5nIFNwbGl0IEVycm9yJywgKCkgPT4ge1xuICAvKipcbiAgICogTW9jayBmdW5jdGlvbiB0byBzaW11bGF0ZSB0aGUgcHJvYmxlbWF0aWMgY29kZSBpbiB1c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcy50czo5MVxuICAgKiBjb25zdCBnZXREZXBlbmRlbnRWYXJzID0gKCkgPT4ge1xuICAgKiAgIHJldHVybiB2YXJJbnB1dHMubWFwKGl0ZW0gPT4gaXRlbS52YXJpYWJsZS5zbGljZSgxLCAtMSkuc3BsaXQoJy4nKSlcbiAgICogfVxuICAgKi9cbiAgY29uc3QgbW9ja0dldERlcGVuZGVudFZhcnMgPSAodmFySW5wdXRzOiBBcnJheTx7IHZhcmlhYmxlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkIH0+KSA9PiB7XG4gICAgcmV0dXJuIHZhcklucHV0cy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIC8vIEd1YXJkIGFnYWluc3QgbnVsbC91bmRlZmluZWQgdmFyaWFibGUgdG8gcHJldmVudCBhcHAgY3Jhc2hcbiAgICAgIGlmICghaXRlbS52YXJpYWJsZSB8fCB0eXBlb2YgaXRlbS52YXJpYWJsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgICByZXR1cm4gaXRlbS52YXJpYWJsZS5zbGljZSgxLCAtMSkuc3BsaXQoJy4nKVxuICAgIH0pLmZpbHRlcihhcnIgPT4gYXJyLmxlbmd0aCA+IDApIC8vIEZpbHRlciBvdXQgZW1wdHkgYXJyYXlzXG4gIH1cblxuICAvKipcbiAgICogVGVzdCBjYXNlIDE6IFZhcmlhYmxlIHByb2Nlc3Npbmcgd2l0aCBudWxsIHZhcmlhYmxlXG4gICAqL1xuICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHZhcmlhYmxlIHNhZmVseScsICgpID0+IHtcbiAgICBjb25zdCB2YXJJbnB1dHMgPSBbeyB2YXJpYWJsZTogbnVsbCB9XVxuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG1vY2tHZXREZXBlbmRlbnRWYXJzKHZhcklucHV0cylcbiAgICB9KS5ub3QudG9UaHJvdygpXG5cbiAgICBjb25zdCByZXN1bHQgPSBtb2NrR2V0RGVwZW5kZW50VmFycyh2YXJJbnB1dHMpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSkgLy8gbnVsbCB2YXJpYWJsZXMgYXJlIGZpbHRlcmVkIG91dFxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0IGNhc2UgMjogVmFyaWFibGUgcHJvY2Vzc2luZyB3aXRoIHVuZGVmaW5lZCB2YXJpYWJsZVxuICAgKi9cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHZhcmlhYmxlIHNhZmVseScsICgpID0+IHtcbiAgICBjb25zdCB2YXJJbnB1dHMgPSBbeyB2YXJpYWJsZTogdW5kZWZpbmVkIH1dXG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbW9ja0dldERlcGVuZGVudFZhcnModmFySW5wdXRzKVxuICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgIGNvbnN0IHJlc3VsdCA9IG1vY2tHZXREZXBlbmRlbnRWYXJzKHZhcklucHV0cylcbiAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtdKSAvLyB1bmRlZmluZWQgdmFyaWFibGVzIGFyZSBmaWx0ZXJlZCBvdXRcbiAgfSlcblxuICAvKipcbiAgICogVGVzdCBjYXNlIDM6IFZhcmlhYmxlIHByb2Nlc3Npbmcgd2l0aCBlbXB0eSBzdHJpbmdcbiAgICovXG4gIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyB2YXJpYWJsZScsICgpID0+IHtcbiAgICBjb25zdCB2YXJJbnB1dHMgPSBbeyB2YXJpYWJsZTogJycgfV1cblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBtb2NrR2V0RGVwZW5kZW50VmFycyh2YXJJbnB1dHMpXG4gICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgY29uc3QgcmVzdWx0ID0gbW9ja0dldERlcGVuZGVudFZhcnModmFySW5wdXRzKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pIC8vIEVtcHR5IHN0cmluZyBpcyBmaWx0ZXJlZCBvdXQsIHNvIHJlc3VsdCBpcyBlbXB0eSBhcnJheVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0IGNhc2UgNDogVmFyaWFibGUgcHJvY2Vzc2luZyB3aXRoIHZhbGlkIHZhcmlhYmxlIGZvcm1hdFxuICAgKi9cbiAgaXQoJ3Nob3VsZCB3b3JrIGNvcnJlY3RseSB3aXRoIHZhbGlkIHZhcmlhYmxlIGZvcm1hdCcsICgpID0+IHtcbiAgICBjb25zdCB2YXJJbnB1dHMgPSBbeyB2YXJpYWJsZTogJ3t7d29ya2Zsb3cubm9kZS5vdXRwdXR9fScgfV1cblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBtb2NrR2V0RGVwZW5kZW50VmFycyh2YXJJbnB1dHMpXG4gICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgY29uc3QgcmVzdWx0ID0gbW9ja0dldERlcGVuZGVudFZhcnModmFySW5wdXRzKVxuICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvRXF1YWwoWyd7d29ya2Zsb3cnLCAnbm9kZScsICdvdXRwdXR9J10pXG4gIH0pXG59KVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3QgdG8gc2ltdWxhdGUgdGhlIGNvbXBsZXRlIHdvcmtmbG93IHNjZW5hcmlvXG4gKi9cbmRlc2NyaWJlKCdQbHVnaW4gVG9vbCBXb3JrZmxvdyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgLyoqXG4gICAqIFNpbXVsYXRlIHRoZSBzY2VuYXJpbyB3aGVyZSBwbHVnaW4gbWV0YWRhdGEgaXMgaW5jb21wbGV0ZSBvciBjb3JydXB0ZWRcbiAgICogVGhpcyBjYW4gaGFwcGVuIHdoZW46XG4gICAqIDEuIFBsdWdpbiBpcyBiZWluZyBsb2FkZWQgZnJvbSBtYXJrZXRwbGFjZSBidXQgbWV0YWRhdGEgcmVxdWVzdCBmYWlsc1xuICAgKiAyLiBQbHVnaW4gY29uZmlndXJhdGlvbiBpcyBjb3JydXB0ZWQgaW4gZGF0YWJhc2VcbiAgICogMy4gTmV0d29yayBpc3N1ZXMgZHVyaW5nIHBsdWdpbiBsb2FkaW5nXG4gICAqL1xuICBpdCgnc2hvdWxkIHJlcHJvZHVjZSB0aGUgY2xpZW50LXNpZGUgZXhjZXB0aW9uIHNjZW5hcmlvJywgKCkgPT4ge1xuICAgIC8vIE1vY2sgaW5jb21wbGV0ZSBwbHVnaW4gZGF0YSB0aGF0IGNvdWxkIGNhdXNlIHRoZSBlcnJvclxuICAgIGNvbnN0IGluY29tcGxldGVQbHVnaW5EYXRhID0ge1xuICAgICAgLy8gTWlzc2luZyBvciBudWxsIHVuaXF1ZUlkZW50aWZpZXJcbiAgICAgIHVuaXF1ZUlkZW50aWZpZXI6IG51bGwsXG4gICAgICBtZXRhOiBudWxsLFxuICAgICAgbWluaW11bV9kaWZ5X3ZlcnNpb246IHVuZGVmaW5lZCxcbiAgICB9XG5cbiAgICAvLyBUaGlzIHNpbXVsYXRlcyB0aGUgZXJyb3IgcGF0aCB0aGF0IGxlYWRzIHRvIHRoZSB3aGl0ZSBzY3JlZW5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgLy8gU2ltdWxhdGUgdGhlIGNvZGUgcGF0aCBpbiBzd2l0Y2gtcGx1Z2luLXZlcnNpb24udHN4OjI5XG4gICAgICAvLyBUaGUgYWN0dWFsIHByb2JsZW1hdGljIGNvZGUgZG9lc24ndCB1c2Ugb3B0aW9uYWwgY2hhaW5pbmdcbiAgICAgIGNvbnN0IF9wbHVnaW5JZCA9IChpbmNvbXBsZXRlUGx1Z2luRGF0YS51bmlxdWVJZGVudGlmaWVyIGFzIGFueSkuc3BsaXQoJzonKVswXVxuICAgIH0pLnRvVGhyb3coJ0Nhbm5vdCByZWFkIHByb3BlcnRpZXMgb2YgbnVsbCAocmVhZGluZyBcXCdzcGxpdFxcJyknKVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0IHRoZSBzY2VuYXJpbyBtZW50aW9uZWQgaW4gdGhlIGlzc3VlIHdoZXJlIHBsdWdpbiB0b29scyBhcmUgbG9hZGVkIGluIHdvcmtmbG93XG4gICAqL1xuICBpdCgnc2hvdWxkIHNpbXVsYXRlIHBsdWdpbiB0b29sIGxvYWRpbmcgaW4gd29ya2Zsb3cgY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBNb2NrIHRoZSB3b3JrZmxvdyBjb250ZXh0IHdoZXJlIHBsdWdpbiB0b29scyBhcmUgYmVpbmcgbG9hZGVkXG4gICAgY29uc3Qgd29ya2Zsb3dQbHVnaW5Ub29scyA9IFtcbiAgICAgIHtcbiAgICAgICAgcHJvdmlkZXJfbmFtZTogJ3Rlc3QtcGx1Z2luJyxcbiAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogbnVsbCwgLy8gVGhpcyBpcyB0aGUgcHJvYmxlbWF0aWMgY2FzZVxuICAgICAgICB0b29sX25hbWU6ICd0ZXN0LXRvb2wnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcHJvdmlkZXJfbmFtZTogJ3ZhbGlkLXBsdWdpbicsXG4gICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6ICd2YWxpZC1wbHVnaW46MS4wLjAnLFxuICAgICAgICB0b29sX25hbWU6ICd2YWxpZC10b29sJyxcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgLy8gUHJvY2VzcyBlYWNoIHBsdWdpbiB0b29sXG4gICAgd29ya2Zsb3dQbHVnaW5Ub29scy5mb3JFYWNoKCh0b29sLCBfaW5kZXgpID0+IHtcbiAgICAgIGlmICh0b29sLnVuaXF1ZUlkZW50aWZpZXIgPT09IG51bGwpIHtcbiAgICAgICAgLy8gVGhpcyByZXByb2R1Y2VzIHRoZSBleGFjdCBlcnJvciBzY2VuYXJpb1xuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IF9wbHVnaW5JZCA9ICh0b29sLnVuaXF1ZUlkZW50aWZpZXIgYXMgYW55KS5zcGxpdCgnOicpWzBdXG4gICAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIFZhbGlkIHRvb2xzIHNob3VsZCB3b3JrIGZpbmVcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBfcGx1Z2luSWQgPSB0b29sLnVuaXF1ZUlkZW50aWZpZXIuc3BsaXQoJzonKVswXVxuICAgICAgICB9KS5ub3QudG9UaHJvdygpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=