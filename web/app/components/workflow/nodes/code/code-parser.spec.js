"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const code_parser_1 = require("./code-parser");
const types_2 = require("./types");
const SAMPLE_CODES = {
    python3: {
        noParams: 'def main():',
        singleParam: 'def main(param1):',
        multipleParams: `def main(param1, param2, param3):
      return {"result": param1}`,
        withTypes: `def main(param1: str, param2: int, param3: List[str]):
      result = process_data(param1, param2)
      return {"output": result}`,
        withDefaults: `def main(param1: str = "default", param2: int = 0):
      return {"data": param1}`,
    },
    javascript: {
        noParams: 'function main() {',
        singleParam: 'function main(param1) {',
        multipleParams: `function main(param1, param2, param3) {
      return { result: param1 }
    }`,
        withComments: `// Main function
    function main(param1, param2) {
      // Process data
      return { output: process(param1, param2) }
    }`,
        withSpaces: 'function main(  param1  ,   param2  ) {',
    },
};
describe('extractFunctionParams', () => {
    describe('Python3', () => {
        it('handles no parameters', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.python3.noParams, types_2.CodeLanguage.python3);
            expect(result).toEqual([]);
        });
        it('extracts single parameter', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.python3.singleParam, types_2.CodeLanguage.python3);
            expect(result).toEqual(['param1']);
        });
        it('extracts multiple parameters', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.python3.multipleParams, types_2.CodeLanguage.python3);
            expect(result).toEqual(['param1', 'param2', 'param3']);
        });
        it('handles type hints', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.python3.withTypes, types_2.CodeLanguage.python3);
            expect(result).toEqual(['param1', 'param2', 'param3']);
        });
        it('handles default values', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.python3.withDefaults, types_2.CodeLanguage.python3);
            expect(result).toEqual(['param1', 'param2']);
        });
    });
    // JavaScript のテストケース
    describe('JavaScript', () => {
        it('handles no parameters', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.javascript.noParams, types_2.CodeLanguage.javascript);
            expect(result).toEqual([]);
        });
        it('extracts single parameter', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.javascript.singleParam, types_2.CodeLanguage.javascript);
            expect(result).toEqual(['param1']);
        });
        it('extracts multiple parameters', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.javascript.multipleParams, types_2.CodeLanguage.javascript);
            expect(result).toEqual(['param1', 'param2', 'param3']);
        });
        it('handles comments in code', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.javascript.withComments, types_2.CodeLanguage.javascript);
            expect(result).toEqual(['param1', 'param2']);
        });
        it('handles whitespace', () => {
            const result = (0, code_parser_1.extractFunctionParams)(SAMPLE_CODES.javascript.withSpaces, types_2.CodeLanguage.javascript);
            expect(result).toEqual(['param1', 'param2']);
        });
    });
});
const RETURN_TYPE_SAMPLES = {
    python3: {
        singleReturn: `
def main(param1):
    return {"result": "value"}`,
        multipleReturns: `
def main(param1, param2):
    return {"result": "value", "status": "success"}`,
        noReturn: `
def main():
    print("Hello")`,
        complexReturn: `
def main():
    data = process()
    return {"result": data, "count": 42, "messages": ["hello"]}`,
        nestedObject: `
    def main(name, age, city):
        return {
            'personal_info': {
                'name': name,
                'age': age,
                'city': city
            },
            'timestamp': int(time.time()),
            'status': 'active'
        }`,
    },
    javascript: {
        singleReturn: `
function main(param1) {
    return { result: "value" }
}`,
        multipleReturns: `
function main(param1) {
    return { result: "value", status: "success" }
}`,
        withParentheses: `
function main() {
    return ({ result: "value", status: "success" })
}`,
        noReturn: `
function main() {
    console.log("Hello")
}`,
        withQuotes: `
function main() {
    return { "result": 'value', 'status': "success" }
}`,
        nestedObject: `
function main(name, age, city) {
    return {
        personal_info: {
            name: name,
            age: age,
            city: city
        },
        timestamp: Date.now(),
        status: 'active'
    }
}`,
        withJSDoc: `
/**
 * Creates a user profile with personal information and metadata
 * @param {string} name - The user's name
 * @param {number} age - The user's age
 * @param {string} city - The user's city of residence
 * @returns {Object} An object containing the user profile
 */
function main(name, age, city) {
    return {
        result: {
            personal_info: {
                name: name,
                age: age,
                city: city
            },
            timestamp: Date.now(),
            status: 'active'
        }
    };
}`,
    },
};
describe('extractReturnType', () => {
    // Python3 のテスト
    describe('Python3', () => {
        it('extracts single return value', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.python3.singleReturn, types_2.CodeLanguage.python3);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('extracts multiple return values', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.python3.multipleReturns, types_2.CodeLanguage.python3);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
                status: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('returns empty object when no return statement', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.python3.noReturn, types_2.CodeLanguage.python3);
            expect(result).toEqual({});
        });
        it('handles complex return statement', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.python3.complexReturn, types_2.CodeLanguage.python3);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
                count: {
                    type: types_1.VarType.string,
                    children: null,
                },
                messages: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('handles nested object structure', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.python3.nestedObject, types_2.CodeLanguage.python3);
            expect(result).toEqual({
                personal_info: {
                    type: types_1.VarType.string,
                    children: null,
                },
                timestamp: {
                    type: types_1.VarType.string,
                    children: null,
                },
                status: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
    });
    // JavaScript のテスト
    describe('JavaScript', () => {
        it('extracts single return value', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.javascript.singleReturn, types_2.CodeLanguage.javascript);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('extracts multiple return values', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.javascript.multipleReturns, types_2.CodeLanguage.javascript);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
                status: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('handles return with parentheses', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.javascript.withParentheses, types_2.CodeLanguage.javascript);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
                status: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('returns empty object when no return statement', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.javascript.noReturn, types_2.CodeLanguage.javascript);
            expect(result).toEqual({});
        });
        it('handles quoted keys', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.javascript.withQuotes, types_2.CodeLanguage.javascript);
            expect(result).toEqual({
                result: {
                    type: types_1.VarType.string,
                    children: null,
                },
                status: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
        it('handles nested object structure', () => {
            const result = (0, code_parser_1.extractReturnType)(RETURN_TYPE_SAMPLES.javascript.nestedObject, types_2.CodeLanguage.javascript);
            expect(result).toEqual({
                personal_info: {
                    type: types_1.VarType.string,
                    children: null,
                },
                timestamp: {
                    type: types_1.VarType.string,
                    children: null,
                },
                status: {
                    type: types_1.VarType.string,
                    children: null,
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1wYXJzZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUtcGFyc2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBcUM7QUFDckMsK0NBQXdFO0FBQ3hFLG1DQUFzQztBQUV0QyxNQUFNLFlBQVksR0FBRztJQUNuQixPQUFPLEVBQUU7UUFDUCxRQUFRLEVBQUUsYUFBYTtRQUN2QixXQUFXLEVBQUUsbUJBQW1CO1FBQ2hDLGNBQWMsRUFBRTtnQ0FDWTtRQUM1QixTQUFTLEVBQUU7O2dDQUVpQjtRQUM1QixZQUFZLEVBQUU7OEJBQ1k7S0FDM0I7SUFDRCxVQUFVLEVBQUU7UUFDVixRQUFRLEVBQUUsbUJBQW1CO1FBQzdCLFdBQVcsRUFBRSx5QkFBeUI7UUFDdEMsY0FBYyxFQUFFOztNQUVkO1FBQ0YsWUFBWSxFQUFFOzs7O01BSVo7UUFDRixVQUFVLEVBQUUseUNBQXlDO0tBQ3REO0NBQ0YsQ0FBQTtBQUVELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDdkIsRUFBRSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtZQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFBLG1DQUFxQixFQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLG9CQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDekYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFDbkMsTUFBTSxNQUFNLEdBQUcsSUFBQSxtQ0FBcUIsRUFBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxvQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFBLG1DQUFxQixFQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLG9CQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDL0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7WUFDNUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxtQ0FBcUIsRUFBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxvQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzFGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sTUFBTSxHQUFHLElBQUEsbUNBQXFCLEVBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM3RixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDOUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHFCQUFxQjtJQUNyQixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUEsbUNBQXFCLEVBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUMvRixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNuQyxNQUFNLE1BQU0sR0FBRyxJQUFBLG1DQUFxQixFQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLG9CQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDbEcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDcEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUEsbUNBQXFCLEVBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNyRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3hELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFBLG1DQUFxQixFQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLG9CQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDbkcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtZQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFBLG1DQUFxQixFQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLG9CQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLE1BQU0sbUJBQW1CLEdBQUc7SUFDMUIsT0FBTyxFQUFFO1FBQ1AsWUFBWSxFQUFFOzsrQkFFYTtRQUUzQixlQUFlLEVBQUU7O29EQUUrQjtRQUVoRCxRQUFRLEVBQUU7O21CQUVLO1FBRWYsYUFBYSxFQUFFOzs7Z0VBRzZDO1FBQzVELFlBQVksRUFBRTs7Ozs7Ozs7OztVQVVSO0tBQ1A7SUFFRCxVQUFVLEVBQUU7UUFDVixZQUFZLEVBQUU7OztFQUdoQjtRQUVFLGVBQWUsRUFBRTs7O0VBR25CO1FBRUUsZUFBZSxFQUFFOzs7RUFHbkI7UUFFRSxRQUFRLEVBQUU7OztFQUdaO1FBRUUsVUFBVSxFQUFFOzs7RUFHZDtRQUNFLFlBQVksRUFBRTs7Ozs7Ozs7Ozs7RUFXaEI7UUFDRSxTQUFTLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0JiO0tBRUM7Q0FDRixDQUFBO0FBRUQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxlQUFlO0lBQ2YsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDdkIsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNuRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM1RixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNqRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixrQkFBa0I7SUFDbEIsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN0RyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN6RyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN6RyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNsRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNwRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFBLCtCQUFpQixFQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN0RyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZhclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IGV4dHJhY3RGdW5jdGlvblBhcmFtcywgZXh0cmFjdFJldHVyblR5cGUgfSBmcm9tICcuL2NvZGUtcGFyc2VyJ1xuaW1wb3J0IHsgQ29kZUxhbmd1YWdlIH0gZnJvbSAnLi90eXBlcydcblxuY29uc3QgU0FNUExFX0NPREVTID0ge1xuICBweXRob24zOiB7XG4gICAgbm9QYXJhbXM6ICdkZWYgbWFpbigpOicsXG4gICAgc2luZ2xlUGFyYW06ICdkZWYgbWFpbihwYXJhbTEpOicsXG4gICAgbXVsdGlwbGVQYXJhbXM6IGBkZWYgbWFpbihwYXJhbTEsIHBhcmFtMiwgcGFyYW0zKTpcbiAgICAgIHJldHVybiB7XCJyZXN1bHRcIjogcGFyYW0xfWAsXG4gICAgd2l0aFR5cGVzOiBgZGVmIG1haW4ocGFyYW0xOiBzdHIsIHBhcmFtMjogaW50LCBwYXJhbTM6IExpc3Rbc3RyXSk6XG4gICAgICByZXN1bHQgPSBwcm9jZXNzX2RhdGEocGFyYW0xLCBwYXJhbTIpXG4gICAgICByZXR1cm4ge1wib3V0cHV0XCI6IHJlc3VsdH1gLFxuICAgIHdpdGhEZWZhdWx0czogYGRlZiBtYWluKHBhcmFtMTogc3RyID0gXCJkZWZhdWx0XCIsIHBhcmFtMjogaW50ID0gMCk6XG4gICAgICByZXR1cm4ge1wiZGF0YVwiOiBwYXJhbTF9YCxcbiAgfSxcbiAgamF2YXNjcmlwdDoge1xuICAgIG5vUGFyYW1zOiAnZnVuY3Rpb24gbWFpbigpIHsnLFxuICAgIHNpbmdsZVBhcmFtOiAnZnVuY3Rpb24gbWFpbihwYXJhbTEpIHsnLFxuICAgIG11bHRpcGxlUGFyYW1zOiBgZnVuY3Rpb24gbWFpbihwYXJhbTEsIHBhcmFtMiwgcGFyYW0zKSB7XG4gICAgICByZXR1cm4geyByZXN1bHQ6IHBhcmFtMSB9XG4gICAgfWAsXG4gICAgd2l0aENvbW1lbnRzOiBgLy8gTWFpbiBmdW5jdGlvblxuICAgIGZ1bmN0aW9uIG1haW4ocGFyYW0xLCBwYXJhbTIpIHtcbiAgICAgIC8vIFByb2Nlc3MgZGF0YVxuICAgICAgcmV0dXJuIHsgb3V0cHV0OiBwcm9jZXNzKHBhcmFtMSwgcGFyYW0yKSB9XG4gICAgfWAsXG4gICAgd2l0aFNwYWNlczogJ2Z1bmN0aW9uIG1haW4oICBwYXJhbTEgICwgICBwYXJhbTIgICkgeycsXG4gIH0sXG59XG5cbmRlc2NyaWJlKCdleHRyYWN0RnVuY3Rpb25QYXJhbXMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdQeXRob24zJywgKCkgPT4ge1xuICAgIGl0KCdoYW5kbGVzIG5vIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBleHRyYWN0RnVuY3Rpb25QYXJhbXMoU0FNUExFX0NPREVTLnB5dGhvbjMubm9QYXJhbXMsIENvZGVMYW5ndWFnZS5weXRob24zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ2V4dHJhY3RzIHNpbmdsZSBwYXJhbWV0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBleHRyYWN0RnVuY3Rpb25QYXJhbXMoU0FNUExFX0NPREVTLnB5dGhvbjMuc2luZ2xlUGFyYW0sIENvZGVMYW5ndWFnZS5weXRob24zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbJ3BhcmFtMSddKVxuICAgIH0pXG5cbiAgICBpdCgnZXh0cmFjdHMgbXVsdGlwbGUgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RGdW5jdGlvblBhcmFtcyhTQU1QTEVfQ09ERVMucHl0aG9uMy5tdWx0aXBsZVBhcmFtcywgQ29kZUxhbmd1YWdlLnB5dGhvbjMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFsncGFyYW0xJywgJ3BhcmFtMicsICdwYXJhbTMnXSlcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgdHlwZSBoaW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RGdW5jdGlvblBhcmFtcyhTQU1QTEVfQ09ERVMucHl0aG9uMy53aXRoVHlwZXMsIENvZGVMYW5ndWFnZS5weXRob24zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbJ3BhcmFtMScsICdwYXJhbTInLCAncGFyYW0zJ10pXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIGRlZmF1bHQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdEZ1bmN0aW9uUGFyYW1zKFNBTVBMRV9DT0RFUy5weXRob24zLndpdGhEZWZhdWx0cywgQ29kZUxhbmd1YWdlLnB5dGhvbjMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFsncGFyYW0xJywgJ3BhcmFtMiddKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gSmF2YVNjcmlwdCDjga7jg4bjgrnjg4jjgrHjg7zjgrlcbiAgZGVzY3JpYmUoJ0phdmFTY3JpcHQnLCAoKSA9PiB7XG4gICAgaXQoJ2hhbmRsZXMgbm8gcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RGdW5jdGlvblBhcmFtcyhTQU1QTEVfQ09ERVMuamF2YXNjcmlwdC5ub1BhcmFtcywgQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnZXh0cmFjdHMgc2luZ2xlIHBhcmFtZXRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RGdW5jdGlvblBhcmFtcyhTQU1QTEVfQ09ERVMuamF2YXNjcmlwdC5zaW5nbGVQYXJhbSwgQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFsncGFyYW0xJ10pXG4gICAgfSlcblxuICAgIGl0KCdleHRyYWN0cyBtdWx0aXBsZSBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdEZ1bmN0aW9uUGFyYW1zKFNBTVBMRV9DT0RFUy5qYXZhc2NyaXB0Lm11bHRpcGxlUGFyYW1zLCBDb2RlTGFuZ3VhZ2UuamF2YXNjcmlwdClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydwYXJhbTEnLCAncGFyYW0yJywgJ3BhcmFtMyddKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBjb21tZW50cyBpbiBjb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdEZ1bmN0aW9uUGFyYW1zKFNBTVBMRV9DT0RFUy5qYXZhc2NyaXB0LndpdGhDb21tZW50cywgQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFsncGFyYW0xJywgJ3BhcmFtMiddKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyB3aGl0ZXNwYWNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdEZ1bmN0aW9uUGFyYW1zKFNBTVBMRV9DT0RFUy5qYXZhc2NyaXB0LndpdGhTcGFjZXMsIENvZGVMYW5ndWFnZS5qYXZhc2NyaXB0KVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbJ3BhcmFtMScsICdwYXJhbTInXSlcbiAgICB9KVxuICB9KVxufSlcblxuY29uc3QgUkVUVVJOX1RZUEVfU0FNUExFUyA9IHtcbiAgcHl0aG9uMzoge1xuICAgIHNpbmdsZVJldHVybjogYFxuZGVmIG1haW4ocGFyYW0xKTpcbiAgICByZXR1cm4ge1wicmVzdWx0XCI6IFwidmFsdWVcIn1gLFxuXG4gICAgbXVsdGlwbGVSZXR1cm5zOiBgXG5kZWYgbWFpbihwYXJhbTEsIHBhcmFtMik6XG4gICAgcmV0dXJuIHtcInJlc3VsdFwiOiBcInZhbHVlXCIsIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wifWAsXG5cbiAgICBub1JldHVybjogYFxuZGVmIG1haW4oKTpcbiAgICBwcmludChcIkhlbGxvXCIpYCxcblxuICAgIGNvbXBsZXhSZXR1cm46IGBcbmRlZiBtYWluKCk6XG4gICAgZGF0YSA9IHByb2Nlc3MoKVxuICAgIHJldHVybiB7XCJyZXN1bHRcIjogZGF0YSwgXCJjb3VudFwiOiA0MiwgXCJtZXNzYWdlc1wiOiBbXCJoZWxsb1wiXX1gLFxuICAgIG5lc3RlZE9iamVjdDogYFxuICAgIGRlZiBtYWluKG5hbWUsIGFnZSwgY2l0eSk6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncGVyc29uYWxfaW5mbyc6IHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6IG5hbWUsXG4gICAgICAgICAgICAgICAgJ2FnZSc6IGFnZSxcbiAgICAgICAgICAgICAgICAnY2l0eSc6IGNpdHlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAndGltZXN0YW1wJzogaW50KHRpbWUudGltZSgpKSxcbiAgICAgICAgICAgICdzdGF0dXMnOiAnYWN0aXZlJ1xuICAgICAgICB9YCxcbiAgfSxcblxuICBqYXZhc2NyaXB0OiB7XG4gICAgc2luZ2xlUmV0dXJuOiBgXG5mdW5jdGlvbiBtYWluKHBhcmFtMSkge1xuICAgIHJldHVybiB7IHJlc3VsdDogXCJ2YWx1ZVwiIH1cbn1gLFxuXG4gICAgbXVsdGlwbGVSZXR1cm5zOiBgXG5mdW5jdGlvbiBtYWluKHBhcmFtMSkge1xuICAgIHJldHVybiB7IHJlc3VsdDogXCJ2YWx1ZVwiLCBzdGF0dXM6IFwic3VjY2Vzc1wiIH1cbn1gLFxuXG4gICAgd2l0aFBhcmVudGhlc2VzOiBgXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIHJldHVybiAoeyByZXN1bHQ6IFwidmFsdWVcIiwgc3RhdHVzOiBcInN1Y2Nlc3NcIiB9KVxufWAsXG5cbiAgICBub1JldHVybjogYFxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICBjb25zb2xlLmxvZyhcIkhlbGxvXCIpXG59YCxcblxuICAgIHdpdGhRdW90ZXM6IGBcbmZ1bmN0aW9uIG1haW4oKSB7XG4gICAgcmV0dXJuIHsgXCJyZXN1bHRcIjogJ3ZhbHVlJywgJ3N0YXR1cyc6IFwic3VjY2Vzc1wiIH1cbn1gLFxuICAgIG5lc3RlZE9iamVjdDogYFxuZnVuY3Rpb24gbWFpbihuYW1lLCBhZ2UsIGNpdHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwZXJzb25hbF9pbmZvOiB7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgYWdlOiBhZ2UsXG4gICAgICAgICAgICBjaXR5OiBjaXR5XG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgc3RhdHVzOiAnYWN0aXZlJ1xuICAgIH1cbn1gLFxuICAgIHdpdGhKU0RvYzogYFxuLyoqXG4gKiBDcmVhdGVzIGEgdXNlciBwcm9maWxlIHdpdGggcGVyc29uYWwgaW5mb3JtYXRpb24gYW5kIG1ldGFkYXRhXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSB1c2VyJ3MgbmFtZVxuICogQHBhcmFtIHtudW1iZXJ9IGFnZSAtIFRoZSB1c2VyJ3MgYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2l0eSAtIFRoZSB1c2VyJ3MgY2l0eSBvZiByZXNpZGVuY2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB1c2VyIHByb2ZpbGVcbiAqL1xuZnVuY3Rpb24gbWFpbihuYW1lLCBhZ2UsIGNpdHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgIHBlcnNvbmFsX2luZm86IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIGFnZTogYWdlLFxuICAgICAgICAgICAgICAgIGNpdHk6IGNpdHlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICBzdGF0dXM6ICdhY3RpdmUnXG4gICAgICAgIH1cbiAgICB9O1xufWAsXG5cbiAgfSxcbn1cblxuZGVzY3JpYmUoJ2V4dHJhY3RSZXR1cm5UeXBlJywgKCkgPT4ge1xuICAvLyBQeXRob24zIOOBruODhuOCueODiFxuICBkZXNjcmliZSgnUHl0aG9uMycsICgpID0+IHtcbiAgICBpdCgnZXh0cmFjdHMgc2luZ2xlIHJldHVybiB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RSZXR1cm5UeXBlKFJFVFVSTl9UWVBFX1NBTVBMRVMucHl0aG9uMy5zaW5nbGVSZXR1cm4sIENvZGVMYW5ndWFnZS5weXRob24zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2V4dHJhY3RzIG11bHRpcGxlIHJldHVybiB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBleHRyYWN0UmV0dXJuVHlwZShSRVRVUk5fVFlQRV9TQU1QTEVTLnB5dGhvbjMubXVsdGlwbGVSZXR1cm5zLCBDb2RlTGFuZ3VhZ2UucHl0aG9uMylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgICAgY2hpbGRyZW46IG51bGwsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBlbXB0eSBvYmplY3Qgd2hlbiBubyByZXR1cm4gc3RhdGVtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdFJldHVyblR5cGUoUkVUVVJOX1RZUEVfU0FNUExFUy5weXRob24zLm5vUmV0dXJuLCBDb2RlTGFuZ3VhZ2UucHl0aG9uMylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe30pXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIGNvbXBsZXggcmV0dXJuIHN0YXRlbWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RSZXR1cm5UeXBlKFJFVFVSTl9UWVBFX1NBTVBMRVMucHl0aG9uMy5jb21wbGV4UmV0dXJuLCBDb2RlTGFuZ3VhZ2UucHl0aG9uMylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgY291bnQ6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcbiAgICBpdCgnaGFuZGxlcyBuZXN0ZWQgb2JqZWN0IHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RSZXR1cm5UeXBlKFJFVFVSTl9UWVBFX1NBTVBMRVMucHl0aG9uMy5uZXN0ZWRPYmplY3QsIENvZGVMYW5ndWFnZS5weXRob24zKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIHBlcnNvbmFsX2luZm86IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgdGltZXN0YW1wOiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgICAgY2hpbGRyZW46IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIHN0YXR1czoge1xuICAgICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEphdmFTY3JpcHQg44Gu44OG44K544OIXG4gIGRlc2NyaWJlKCdKYXZhU2NyaXB0JywgKCkgPT4ge1xuICAgIGl0KCdleHRyYWN0cyBzaW5nbGUgcmV0dXJuIHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdFJldHVyblR5cGUoUkVUVVJOX1RZUEVfU0FNUExFUy5qYXZhc2NyaXB0LnNpbmdsZVJldHVybiwgQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgICAgY2hpbGRyZW46IG51bGwsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZXh0cmFjdHMgbXVsdGlwbGUgcmV0dXJuIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RSZXR1cm5UeXBlKFJFVFVSTl9UWVBFX1NBTVBMRVMuamF2YXNjcmlwdC5tdWx0aXBsZVJldHVybnMsIENvZGVMYW5ndWFnZS5qYXZhc2NyaXB0KVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIHJldHVybiB3aXRoIHBhcmVudGhlc2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdFJldHVyblR5cGUoUkVUVVJOX1RZUEVfU0FNUExFUy5qYXZhc2NyaXB0LndpdGhQYXJlbnRoZXNlcywgQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgICAgY2hpbGRyZW46IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIHN0YXR1czoge1xuICAgICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZW1wdHkgb2JqZWN0IHdoZW4gbm8gcmV0dXJuIHN0YXRlbWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RSZXR1cm5UeXBlKFJFVFVSTl9UWVBFX1NBTVBMRVMuamF2YXNjcmlwdC5ub1JldHVybiwgQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHt9KVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBxdW90ZWQga2V5cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RSZXR1cm5UeXBlKFJFVFVSTl9UWVBFX1NBTVBMRVMuamF2YXNjcmlwdC53aXRoUXVvdGVzLCBDb2RlTGFuZ3VhZ2UuamF2YXNjcmlwdClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgICAgY2hpbGRyZW46IG51bGwsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG4gICAgaXQoJ2hhbmRsZXMgbmVzdGVkIG9iamVjdCBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBleHRyYWN0UmV0dXJuVHlwZShSRVRVUk5fVFlQRV9TQU1QTEVTLmphdmFzY3JpcHQubmVzdGVkT2JqZWN0LCBDb2RlTGFuZ3VhZ2UuamF2YXNjcmlwdClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBwZXJzb25hbF9pbmZvOiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgICAgY2hpbGRyZW46IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVzdGFtcDoge1xuICAgICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=