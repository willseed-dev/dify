"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for model configuration transformation utilities
 *
 * This module handles the conversion between two different representations of user input forms:
 * 1. UserInputFormItem: The form structure used in the UI
 * 2. PromptVariable: The variable structure used in prompts and model configuration
 *
 * Key functions:
 * - userInputsFormToPromptVariables: Converts UI form items to prompt variables
 * - promptVariablesToUserInputsForm: Converts prompt variables back to form items
 * - formatBooleanInputs: Ensures boolean inputs are properly typed
 */
const model_config_1 = require("./model-config");
describe('Model Config Utilities', () => {
    describe('userInputsFormToPromptVariables', () => {
        /**
         * Test handling of null or undefined input
         * Should return empty array when no inputs provided
         */
        it('should return empty array for null input', () => {
            const result = (0, model_config_1.userInputsFormToPromptVariables)(null);
            expect(result).toEqual([]);
        });
        /**
         * Test conversion of text-input (string) type
         * Text inputs are the most common form field type
         */
        it('should convert text-input to string prompt variable', () => {
            const userInputs = [
                {
                    'text-input': {
                        label: 'User Name',
                        variable: 'user_name',
                        required: true,
                        max_length: 100,
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                key: 'user_name',
                name: 'User Name',
                required: true,
                type: 'string',
                max_length: 100,
                options: [],
                is_context_var: false,
                hide: false,
                default: '',
            });
        });
        /**
         * Test conversion of paragraph type
         * Paragraphs are multi-line text inputs
         */
        it('should convert paragraph to paragraph prompt variable', () => {
            const userInputs = [
                {
                    paragraph: {
                        label: 'Description',
                        variable: 'description',
                        required: false,
                        max_length: 500,
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'description',
                name: 'Description',
                required: false,
                type: 'paragraph',
                max_length: 500,
                options: [],
                is_context_var: false,
                hide: false,
                default: '',
            });
        });
        /**
         * Test conversion of number type
         * Number inputs should preserve numeric constraints
         */
        it('should convert number input to number prompt variable', () => {
            const userInputs = [
                {
                    number: {
                        label: 'Age',
                        variable: 'age',
                        required: true,
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'age',
                name: 'Age',
                required: true,
                type: 'number',
                options: [],
                hide: false,
                default: '',
            });
        });
        /**
         * Test conversion of checkbox (boolean) type
         * Checkboxes are converted to 'checkbox' type in prompt variables
         */
        it('should convert checkbox to checkbox prompt variable', () => {
            const userInputs = [
                {
                    checkbox: {
                        label: 'Accept Terms',
                        variable: 'accept_terms',
                        required: true,
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'accept_terms',
                name: 'Accept Terms',
                required: true,
                type: 'checkbox',
                options: [],
                hide: false,
                default: '',
            });
        });
        /**
         * Test conversion of select (dropdown) type
         * Select inputs include options array
         */
        it('should convert select input to select prompt variable', () => {
            const userInputs = [
                {
                    select: {
                        label: 'Country',
                        variable: 'country',
                        required: true,
                        options: ['USA', 'Canada', 'Mexico'],
                        default: 'USA',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'country',
                name: 'Country',
                required: true,
                type: 'select',
                options: ['USA', 'Canada', 'Mexico'],
                is_context_var: false,
                hide: false,
                default: 'USA',
            });
        });
        /**
         * Test conversion of file upload type
         * File inputs include configuration for allowed types and upload methods
         */
        it('should convert file input to file prompt variable', () => {
            const userInputs = [
                {
                    file: {
                        label: 'Profile Picture',
                        variable: 'profile_pic',
                        required: false,
                        allowed_file_types: ['image'],
                        allowed_file_extensions: ['.jpg', '.png'],
                        allowed_file_upload_methods: ['local_file', 'remote_url'],
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'profile_pic',
                name: 'Profile Picture',
                required: false,
                type: 'file',
                config: {
                    allowed_file_types: ['image'],
                    allowed_file_extensions: ['.jpg', '.png'],
                    allowed_file_upload_methods: ['local_file', 'remote_url'],
                    number_limits: 1,
                },
                hide: false,
                default: '',
            });
        });
        /**
         * Test conversion of file-list type
         * File lists allow multiple file uploads with a max_length constraint
         */
        it('should convert file-list input to file-list prompt variable', () => {
            const userInputs = [
                {
                    'file-list': {
                        label: 'Documents',
                        variable: 'documents',
                        required: true,
                        allowed_file_types: ['document'],
                        allowed_file_extensions: ['.pdf', '.docx'],
                        allowed_file_upload_methods: ['local_file'],
                        max_length: 5,
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'documents',
                name: 'Documents',
                required: true,
                type: 'file-list',
                config: {
                    allowed_file_types: ['document'],
                    allowed_file_extensions: ['.pdf', '.docx'],
                    allowed_file_upload_methods: ['local_file'],
                    number_limits: 5,
                },
                hide: false,
                default: '',
            });
        });
        /**
         * Test conversion of external_data_tool type
         * External data tools have custom configuration and icons
         */
        it('should convert external_data_tool to prompt variable', () => {
            const userInputs = [
                {
                    external_data_tool: {
                        label: 'API Data',
                        variable: 'api_data',
                        type: 'api',
                        enabled: true,
                        required: false,
                        config: { endpoint: 'https://api.example.com' },
                        icon: 'api-icon',
                        icon_background: '#FF5733',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result[0]).toEqual({
                key: 'api_data',
                name: 'API Data',
                required: false,
                type: 'api',
                enabled: true,
                config: { endpoint: 'https://api.example.com' },
                icon: 'api-icon',
                icon_background: '#FF5733',
                is_context_var: false,
                hide: false,
            });
        });
        /**
         * Test handling of dataset_query_variable
         * When a variable matches the dataset_query_variable, is_context_var should be true
         */
        it('should mark variable as context var when matching dataset_query_variable', () => {
            const userInputs = [
                {
                    'text-input': {
                        label: 'Query',
                        variable: 'query',
                        required: true,
                        max_length: 200,
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs, 'query');
            expect(result[0].is_context_var).toBe(true);
        });
        /**
         * Test conversion of multiple mixed input types
         * Should handle an array with different input types correctly
         */
        it('should convert multiple mixed input types', () => {
            const userInputs = [
                {
                    'text-input': {
                        label: 'Name',
                        variable: 'name',
                        required: true,
                        max_length: 50,
                        default: '',
                        hide: false,
                    },
                },
                {
                    number: {
                        label: 'Age',
                        variable: 'age',
                        required: false,
                        default: '',
                        hide: false,
                    },
                },
                {
                    select: {
                        label: 'Gender',
                        variable: 'gender',
                        required: true,
                        options: ['Male', 'Female', 'Other'],
                        default: '',
                        hide: false,
                    },
                },
            ];
            const result = (0, model_config_1.userInputsFormToPromptVariables)(userInputs);
            expect(result).toHaveLength(3);
            expect(result[0].type).toBe('string');
            expect(result[1].type).toBe('number');
            expect(result[2].type).toBe('select');
        });
    });
    describe('promptVariablesToUserInputsForm', () => {
        /**
         * Test conversion of string prompt variable back to text-input
         */
        it('should convert string prompt variable to text-input', () => {
            const promptVariables = [
                {
                    key: 'user_name',
                    name: 'User Name',
                    required: true,
                    type: 'string',
                    max_length: 100,
                    options: [],
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                'text-input': {
                    label: 'User Name',
                    variable: 'user_name',
                    required: true,
                    max_length: 100,
                    default: '',
                    hide: undefined,
                },
            });
        });
        /**
         * Test conversion of paragraph prompt variable
         */
        it('should convert paragraph prompt variable to paragraph input', () => {
            const promptVariables = [
                {
                    key: 'description',
                    name: 'Description',
                    required: false,
                    type: 'paragraph',
                    max_length: 500,
                    options: [],
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result[0]).toEqual({
                paragraph: {
                    label: 'Description',
                    variable: 'description',
                    required: false,
                    max_length: 500,
                    default: '',
                    hide: undefined,
                },
            });
        });
        /**
         * Test conversion of number prompt variable
         */
        it('should convert number prompt variable to number input', () => {
            const promptVariables = [
                {
                    key: 'age',
                    name: 'Age',
                    required: true,
                    type: 'number',
                    options: [],
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result[0]).toEqual({
                number: {
                    label: 'Age',
                    variable: 'age',
                    required: true,
                    default: '',
                    hide: undefined,
                },
            });
        });
        /**
         * Test conversion of checkbox prompt variable
         */
        it('should convert checkbox prompt variable to checkbox input', () => {
            const promptVariables = [
                {
                    key: 'accept_terms',
                    name: 'Accept Terms',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result[0]).toEqual({
                checkbox: {
                    label: 'Accept Terms',
                    variable: 'accept_terms',
                    required: true,
                    default: '',
                    hide: undefined,
                },
            });
        });
        /**
         * Test conversion of select prompt variable
         */
        it('should convert select prompt variable to select input', () => {
            const promptVariables = [
                {
                    key: 'country',
                    name: 'Country',
                    required: true,
                    type: 'select',
                    options: ['USA', 'Canada', 'Mexico'],
                    default: 'USA',
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result[0]).toEqual({
                select: {
                    label: 'Country',
                    variable: 'country',
                    required: true,
                    options: ['USA', 'Canada', 'Mexico'],
                    default: 'USA',
                    hide: undefined,
                },
            });
        });
        /**
         * Test filtering of invalid prompt variables
         * Variables without key or name should be filtered out
         */
        it('should filter out variables with empty key or name', () => {
            const promptVariables = [
                {
                    key: '',
                    name: 'Empty Key',
                    required: true,
                    type: 'string',
                    options: [],
                },
                {
                    key: 'valid',
                    name: '',
                    required: true,
                    type: 'string',
                    options: [],
                },
                {
                    key: '  ',
                    name: 'Whitespace Key',
                    required: true,
                    type: 'string',
                    options: [],
                },
                {
                    key: 'valid_key',
                    name: 'Valid Name',
                    required: true,
                    type: 'string',
                    options: [],
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result).toHaveLength(1);
            expect(result[0]['text-input']?.variable).toBe('valid_key');
        });
        /**
         * Test conversion of external data tool prompt variable
         */
        it('should convert external data tool prompt variable', () => {
            const promptVariables = [
                {
                    key: 'api_data',
                    name: 'API Data',
                    required: false,
                    type: 'api',
                    enabled: true,
                    config: { endpoint: 'https://api.example.com' },
                    icon: 'api-icon',
                    icon_background: '#FF5733',
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result[0]).toEqual({
                external_data_tool: {
                    label: 'API Data',
                    variable: 'api_data',
                    enabled: true,
                    type: 'api',
                    config: { endpoint: 'https://api.example.com' },
                    required: false,
                    icon: 'api-icon',
                    icon_background: '#FF5733',
                    hide: undefined,
                },
            });
        });
        /**
         * Test that required defaults to true when not explicitly set to false
         */
        it('should default required to true when not false', () => {
            const promptVariables = [
                {
                    key: 'test1',
                    name: 'Test 1',
                    required: undefined,
                    type: 'string',
                    options: [],
                },
                {
                    key: 'test2',
                    name: 'Test 2',
                    required: false,
                    type: 'string',
                    options: [],
                },
            ];
            const result = (0, model_config_1.promptVariablesToUserInputsForm)(promptVariables);
            expect(result[0]['text-input']?.required).toBe(true);
            expect(result[1]['text-input']?.required).toBe(false);
        });
    });
    describe('formatBooleanInputs', () => {
        /**
         * Test that null or undefined inputs are handled gracefully
         */
        it('should return inputs unchanged when useInputs is null', () => {
            const inputs = { key1: 'value1', key2: 'value2' };
            const result = (0, model_config_1.formatBooleanInputs)(null, inputs);
            expect(result).toEqual(inputs);
        });
        it('should return inputs unchanged when useInputs is undefined', () => {
            const inputs = { key1: 'value1', key2: 'value2' };
            const result = (0, model_config_1.formatBooleanInputs)(undefined, inputs);
            expect(result).toEqual(inputs);
        });
        /**
         * Test conversion of boolean input values to actual boolean type
         * This is important for proper type handling in the backend
         * Note: checkbox inputs are converted to type 'checkbox' by userInputsFormToPromptVariables
         */
        it('should convert boolean inputs to boolean type', () => {
            const useInputs = [
                {
                    key: 'accept_terms',
                    name: 'Accept Terms',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
                {
                    key: 'subscribe',
                    name: 'Subscribe',
                    required: false,
                    type: 'checkbox',
                    options: [],
                },
            ];
            const inputs = {
                accept_terms: 'true',
                subscribe: '',
                other_field: 'value',
            };
            const result = (0, model_config_1.formatBooleanInputs)(useInputs, inputs);
            expect(result).toEqual({
                accept_terms: true,
                subscribe: false,
                other_field: 'value',
            });
        });
        /**
         * Test that non-boolean inputs are not affected
         */
        it('should not modify non-boolean inputs', () => {
            const useInputs = [
                {
                    key: 'name',
                    name: 'Name',
                    required: true,
                    type: 'string',
                    options: [],
                },
                {
                    key: 'age',
                    name: 'Age',
                    required: true,
                    type: 'number',
                    options: [],
                },
            ];
            const inputs = {
                name: 'John Doe',
                age: 30,
            };
            const result = (0, model_config_1.formatBooleanInputs)(useInputs, inputs);
            expect(result).toEqual(inputs);
        });
        /**
         * Test handling of truthy and falsy values for boolean conversion
         * Note: checkbox inputs are converted to type 'checkbox' by userInputsFormToPromptVariables
         */
        it('should handle various truthy and falsy values', () => {
            const useInputs = [
                {
                    key: 'bool1',
                    name: 'Bool 1',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
                {
                    key: 'bool2',
                    name: 'Bool 2',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
                {
                    key: 'bool3',
                    name: 'Bool 3',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
                {
                    key: 'bool4',
                    name: 'Bool 4',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
            ];
            const inputs = {
                bool1: 1,
                bool2: 0,
                bool3: 'yes',
                bool4: null,
            };
            const result = (0, model_config_1.formatBooleanInputs)(useInputs, inputs);
            expect(result?.bool1).toBe(true);
            expect(result?.bool2).toBe(false);
            expect(result?.bool3).toBe(true);
            expect(result?.bool4).toBe(false);
        });
        /**
         * Test that the function creates a new object and doesn't mutate the original
         * Note: checkbox inputs are converted to type 'checkbox' by userInputsFormToPromptVariables
         */
        it('should not mutate original inputs object', () => {
            const useInputs = [
                {
                    key: 'flag',
                    name: 'Flag',
                    required: true,
                    type: 'checkbox',
                    options: [],
                },
            ];
            const inputs = { flag: 'true', other: 'value' };
            const originalInputs = { ...inputs };
            (0, model_config_1.formatBooleanInputs)(useInputs, inputs);
            expect(inputs).toEqual(originalInputs);
        });
    });
    describe('Round-trip conversion', () => {
        /**
         * Test that converting from UserInputForm to PromptVariable and back
         * preserves the essential data (though some fields may have defaults applied)
         */
        it('should preserve data through round-trip conversion', () => {
            const originalUserInputs = [
                {
                    'text-input': {
                        label: 'Name',
                        variable: 'name',
                        required: true,
                        max_length: 50,
                        default: '',
                        hide: false,
                    },
                },
                {
                    select: {
                        label: 'Type',
                        variable: 'type',
                        required: false,
                        options: ['A', 'B', 'C'],
                        default: 'A',
                        hide: false,
                    },
                },
            ];
            const promptVars = (0, model_config_1.userInputsFormToPromptVariables)(originalUserInputs);
            const backToUserInputs = (0, model_config_1.promptVariablesToUserInputsForm)(promptVars);
            expect(backToUserInputs).toHaveLength(2);
            expect(backToUserInputs[0]['text-input']?.variable).toBe('name');
            expect(backToUserInputs[1].select?.variable).toBe('type');
            expect(backToUserInputs[1].select?.options).toEqual(['A', 'B', 'C']);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtY29uZmlnLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RlbC1jb25maWcuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsaURBSXVCO0FBRXZCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsUUFBUSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUMvQzs7O1dBR0c7UUFDSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUEsOENBQStCLEVBQUMsSUFBSSxDQUFDLENBQUE7WUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGOzs7V0FHRztRQUNILEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsTUFBTSxVQUFVLEdBQXdCO2dCQUN0QztvQkFDRSxZQUFZLEVBQUU7d0JBQ1osS0FBSyxFQUFFLFdBQVc7d0JBQ2xCLFFBQVEsRUFBRSxXQUFXO3dCQUNyQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxVQUFVLEVBQUUsR0FBRzt3QkFDZixPQUFPLEVBQUUsRUFBRTt3QkFDWCxJQUFJLEVBQUUsS0FBSztxQkFDWjtpQkFDRjthQUNGLENBQUE7WUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFBLDhDQUErQixFQUFDLFVBQVUsQ0FBQyxDQUFBO1lBRTFELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsR0FBRyxFQUFFLFdBQVc7Z0JBQ2hCLElBQUksRUFBRSxXQUFXO2dCQUNqQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxJQUFJLEVBQUUsUUFB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QUcsSUFBQSw4Q0FBK0IsRUFBQyxrQkFBa0IsQ0FBQyxDQUFBO1lBQ3RFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSw4Q0FBK0IsRUFBQyxVQUFVLENBQUMsQ0FBQTtZQUVwRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEMsTUFBTSxDQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN6RSxNQUFNLENBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNsRSxNQUFNLENBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMvRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFByb21wdFZhcmlhYmxlIH0gZnJvbSAnQC9tb2RlbHMvZGVidWcnXG5pbXBvcnQgdHlwZSB7IFVzZXJJbnB1dEZvcm1JdGVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG4vKipcbiAqIFRlc3Qgc3VpdGUgZm9yIG1vZGVsIGNvbmZpZ3VyYXRpb24gdHJhbnNmb3JtYXRpb24gdXRpbGl0aWVzXG4gKlxuICogVGhpcyBtb2R1bGUgaGFuZGxlcyB0aGUgY29udmVyc2lvbiBiZXR3ZWVuIHR3byBkaWZmZXJlbnQgcmVwcmVzZW50YXRpb25zIG9mIHVzZXIgaW5wdXQgZm9ybXM6XG4gKiAxLiBVc2VySW5wdXRGb3JtSXRlbTogVGhlIGZvcm0gc3RydWN0dXJlIHVzZWQgaW4gdGhlIFVJXG4gKiAyLiBQcm9tcHRWYXJpYWJsZTogVGhlIHZhcmlhYmxlIHN0cnVjdHVyZSB1c2VkIGluIHByb21wdHMgYW5kIG1vZGVsIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBLZXkgZnVuY3Rpb25zOlxuICogLSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzOiBDb252ZXJ0cyBVSSBmb3JtIGl0ZW1zIHRvIHByb21wdCB2YXJpYWJsZXNcbiAqIC0gcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybTogQ29udmVydHMgcHJvbXB0IHZhcmlhYmxlcyBiYWNrIHRvIGZvcm0gaXRlbXNcbiAqIC0gZm9ybWF0Qm9vbGVhbklucHV0czogRW5zdXJlcyBib29sZWFuIGlucHV0cyBhcmUgcHJvcGVybHkgdHlwZWRcbiAqL1xuaW1wb3J0IHtcbiAgZm9ybWF0Qm9vbGVhbklucHV0cyxcbiAgcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybSxcbiAgdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcyxcbn0gZnJvbSAnLi9tb2RlbC1jb25maWcnXG5cbmRlc2NyaWJlKCdNb2RlbCBDb25maWcgVXRpbGl0aWVzJywgKCkgPT4ge1xuICBkZXNjcmliZSgndXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcycsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IGhhbmRsaW5nIG9mIG51bGwgb3IgdW5kZWZpbmVkIGlucHV0XG4gICAgICogU2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIG5vIGlucHV0cyBwcm92aWRlZFxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IGZvciBudWxsIGlucHV0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcyhudWxsKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIHRleHQtaW5wdXQgKHN0cmluZykgdHlwZVxuICAgICAqIFRleHQgaW5wdXRzIGFyZSB0aGUgbW9zdCBjb21tb24gZm9ybSBmaWVsZCB0eXBlXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHRleHQtaW5wdXQgdG8gc3RyaW5nIHByb21wdCB2YXJpYWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dHM6IFVzZXJJbnB1dEZvcm1JdGVtW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAndGV4dC1pbnB1dCc6IHtcbiAgICAgICAgICAgIGxhYmVsOiAnVXNlciBOYW1lJyxcbiAgICAgICAgICAgIHZhcmlhYmxlOiAndXNlcl9uYW1lJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgbWF4X2xlbmd0aDogMTAwLFxuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKHVzZXJJbnB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCgxKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9FcXVhbCh7XG4gICAgICAgIGtleTogJ3VzZXJfbmFtZScsXG4gICAgICAgIG5hbWU6ICdVc2VyIE5hbWUnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIG1heF9sZW5ndGg6IDEwMCxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIGlzX2NvbnRleHRfdmFyOiBmYWxzZSxcbiAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIHBhcmFncmFwaCB0eXBlXG4gICAgICogUGFyYWdyYXBocyBhcmUgbXVsdGktbGluZSB0ZXh0IGlucHV0c1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgY29udmVydCBwYXJhZ3JhcGggdG8gcGFyYWdyYXBoIHByb21wdCB2YXJpYWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dHM6IFVzZXJJbnB1dEZvcm1JdGVtW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwYXJhZ3JhcGg6IHtcbiAgICAgICAgICAgIGxhYmVsOiAnRGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgdmFyaWFibGU6ICdkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICBtYXhfbGVuZ3RoOiA1MDAsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHVzZXJJbnB1dHNGb3JtVG9Qcm9tcHRWYXJpYWJsZXModXNlcklucHV0cylcblxuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9FcXVhbCh7XG4gICAgICAgIGtleTogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgbmFtZTogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB0eXBlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgbWF4X2xlbmd0aDogNTAwLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgaXNfY29udGV4dF92YXI6IGZhbHNlLFxuICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGNvbnZlcnNpb24gb2YgbnVtYmVyIHR5cGVcbiAgICAgKiBOdW1iZXIgaW5wdXRzIHNob3VsZCBwcmVzZXJ2ZSBudW1lcmljIGNvbnN0cmFpbnRzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IG51bWJlciBpbnB1dCB0byBudW1iZXIgcHJvbXB0IHZhcmlhYmxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcklucHV0czogVXNlcklucHV0Rm9ybUl0ZW1bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG51bWJlcjoge1xuICAgICAgICAgICAgbGFiZWw6ICdBZ2UnLFxuICAgICAgICAgICAgdmFyaWFibGU6ICdhZ2UnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKHVzZXJJbnB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvRXF1YWwoe1xuICAgICAgICBrZXk6ICdhZ2UnLFxuICAgICAgICBuYW1lOiAnQWdlJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIGNoZWNrYm94IChib29sZWFuKSB0eXBlXG4gICAgICogQ2hlY2tib3hlcyBhcmUgY29udmVydGVkIHRvICdjaGVja2JveCcgdHlwZSBpbiBwcm9tcHQgdmFyaWFibGVzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGNoZWNrYm94IHRvIGNoZWNrYm94IHByb21wdCB2YXJpYWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dHM6IFVzZXJJbnB1dEZvcm1JdGVtW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBjaGVja2JveDoge1xuICAgICAgICAgICAgbGFiZWw6ICdBY2NlcHQgVGVybXMnLFxuICAgICAgICAgICAgdmFyaWFibGU6ICdhY2NlcHRfdGVybXMnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKHVzZXJJbnB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvRXF1YWwoe1xuICAgICAgICBrZXk6ICdhY2NlcHRfdGVybXMnLFxuICAgICAgICBuYW1lOiAnQWNjZXB0IFRlcm1zJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGNvbnZlcnNpb24gb2Ygc2VsZWN0IChkcm9wZG93bikgdHlwZVxuICAgICAqIFNlbGVjdCBpbnB1dHMgaW5jbHVkZSBvcHRpb25zIGFycmF5XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNlbGVjdCBpbnB1dCB0byBzZWxlY3QgcHJvbXB0IHZhcmlhYmxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcklucHV0czogVXNlcklucHV0Rm9ybUl0ZW1bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgbGFiZWw6ICdDb3VudHJ5JyxcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnY291bnRyeScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IFsnVVNBJywgJ0NhbmFkYScsICdNZXhpY28nXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdVU0EnLFxuICAgICAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcyh1c2VySW5wdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0VxdWFsKHtcbiAgICAgICAga2V5OiAnY291bnRyeScsXG4gICAgICAgIG5hbWU6ICdDb3VudHJ5JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBbJ1VTQScsICdDYW5hZGEnLCAnTWV4aWNvJ10sXG4gICAgICAgIGlzX2NvbnRleHRfdmFyOiBmYWxzZSxcbiAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgIGRlZmF1bHQ6ICdVU0EnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIGZpbGUgdXBsb2FkIHR5cGVcbiAgICAgKiBGaWxlIGlucHV0cyBpbmNsdWRlIGNvbmZpZ3VyYXRpb24gZm9yIGFsbG93ZWQgdHlwZXMgYW5kIHVwbG9hZCBtZXRob2RzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGZpbGUgaW5wdXQgdG8gZmlsZSBwcm9tcHQgdmFyaWFibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VySW5wdXRzOiBVc2VySW5wdXRGb3JtSXRlbVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZmlsZToge1xuICAgICAgICAgICAgbGFiZWw6ICdQcm9maWxlIFBpY3R1cmUnLFxuICAgICAgICAgICAgdmFyaWFibGU6ICdwcm9maWxlX3BpYycsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFsnaW1hZ2UnXSxcbiAgICAgICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBbJy5qcGcnLCAnLnBuZyddLFxuICAgICAgICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddLFxuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9IGFzIGFueSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcyh1c2VySW5wdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0VxdWFsKHtcbiAgICAgICAga2V5OiAncHJvZmlsZV9waWMnLFxuICAgICAgICBuYW1lOiAnUHJvZmlsZSBQaWN0dXJlJyxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB0eXBlOiAnZmlsZScsXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIGFsbG93ZWRfZmlsZV90eXBlczogWydpbWFnZSddLFxuICAgICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBbJy5qcGcnLCAnLnBuZyddLFxuICAgICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogWydsb2NhbF9maWxlJywgJ3JlbW90ZV91cmwnXSxcbiAgICAgICAgICBudW1iZXJfbGltaXRzOiAxLFxuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGNvbnZlcnNpb24gb2YgZmlsZS1saXN0IHR5cGVcbiAgICAgKiBGaWxlIGxpc3RzIGFsbG93IG11bHRpcGxlIGZpbGUgdXBsb2FkcyB3aXRoIGEgbWF4X2xlbmd0aCBjb25zdHJhaW50XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGZpbGUtbGlzdCBpbnB1dCB0byBmaWxlLWxpc3QgcHJvbXB0IHZhcmlhYmxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcklucHV0czogVXNlcklucHV0Rm9ybUl0ZW1bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICdmaWxlLWxpc3QnOiB7XG4gICAgICAgICAgICBsYWJlbDogJ0RvY3VtZW50cycsXG4gICAgICAgICAgICB2YXJpYWJsZTogJ2RvY3VtZW50cycsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93ZWRfZmlsZV90eXBlczogWydkb2N1bWVudCddLFxuICAgICAgICAgICAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IFsnLnBkZicsICcuZG9jeCddLFxuICAgICAgICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbJ2xvY2FsX2ZpbGUnXSxcbiAgICAgICAgICAgIG1heF9sZW5ndGg6IDUsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKHVzZXJJbnB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvRXF1YWwoe1xuICAgICAgICBrZXk6ICdkb2N1bWVudHMnLFxuICAgICAgICBuYW1lOiAnRG9jdW1lbnRzJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdmaWxlLWxpc3QnLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFsnZG9jdW1lbnQnXSxcbiAgICAgICAgICBhbGxvd2VkX2ZpbGVfZXh0ZW5zaW9uczogWycucGRmJywgJy5kb2N4J10sXG4gICAgICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbJ2xvY2FsX2ZpbGUnXSxcbiAgICAgICAgICBudW1iZXJfbGltaXRzOiA1LFxuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGNvbnZlcnNpb24gb2YgZXh0ZXJuYWxfZGF0YV90b29sIHR5cGVcbiAgICAgKiBFeHRlcm5hbCBkYXRhIHRvb2xzIGhhdmUgY3VzdG9tIGNvbmZpZ3VyYXRpb24gYW5kIGljb25zXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGV4dGVybmFsX2RhdGFfdG9vbCB0byBwcm9tcHQgdmFyaWFibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VySW5wdXRzOiBVc2VySW5wdXRGb3JtSXRlbVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZXh0ZXJuYWxfZGF0YV90b29sOiB7XG4gICAgICAgICAgICBsYWJlbDogJ0FQSSBEYXRhJyxcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnYXBpX2RhdGEnLFxuICAgICAgICAgICAgdHlwZTogJ2FwaScsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlnOiB7IGVuZHBvaW50OiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20nIH0sXG4gICAgICAgICAgICBpY29uOiAnYXBpLWljb24nLFxuICAgICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGNTczMycsXG4gICAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9IGFzIGFueSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcyh1c2VySW5wdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0VxdWFsKHtcbiAgICAgICAga2V5OiAnYXBpX2RhdGEnLFxuICAgICAgICBuYW1lOiAnQVBJIERhdGEnLFxuICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIHR5cGU6ICdhcGknLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBjb25maWc6IHsgZW5kcG9pbnQ6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbScgfSxcbiAgICAgICAgaWNvbjogJ2FwaS1pY29uJyxcbiAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGNTczMycsXG4gICAgICAgIGlzX2NvbnRleHRfdmFyOiBmYWxzZSxcbiAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGhhbmRsaW5nIG9mIGRhdGFzZXRfcXVlcnlfdmFyaWFibGVcbiAgICAgKiBXaGVuIGEgdmFyaWFibGUgbWF0Y2hlcyB0aGUgZGF0YXNldF9xdWVyeV92YXJpYWJsZSwgaXNfY29udGV4dF92YXIgc2hvdWxkIGJlIHRydWVcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIG1hcmsgdmFyaWFibGUgYXMgY29udGV4dCB2YXIgd2hlbiBtYXRjaGluZyBkYXRhc2V0X3F1ZXJ5X3ZhcmlhYmxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcklucHV0czogVXNlcklucHV0Rm9ybUl0ZW1bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICd0ZXh0LWlucHV0Jzoge1xuICAgICAgICAgICAgbGFiZWw6ICdRdWVyeScsXG4gICAgICAgICAgICB2YXJpYWJsZTogJ3F1ZXJ5JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgbWF4X2xlbmd0aDogMjAwLFxuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKHVzZXJJbnB1dHMsICdxdWVyeScpXG5cbiAgICAgIGV4cGVjdChyZXN1bHRbMF0uaXNfY29udGV4dF92YXIpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIG11bHRpcGxlIG1peGVkIGlucHV0IHR5cGVzXG4gICAgICogU2hvdWxkIGhhbmRsZSBhbiBhcnJheSB3aXRoIGRpZmZlcmVudCBpbnB1dCB0eXBlcyBjb3JyZWN0bHlcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbXVsdGlwbGUgbWl4ZWQgaW5wdXQgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VySW5wdXRzOiBVc2VySW5wdXRGb3JtSXRlbVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgJ3RleHQtaW5wdXQnOiB7XG4gICAgICAgICAgICBsYWJlbDogJ05hbWUnLFxuICAgICAgICAgICAgdmFyaWFibGU6ICduYW1lJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgbWF4X2xlbmd0aDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBudW1iZXI6IHtcbiAgICAgICAgICAgIGxhYmVsOiAnQWdlJyxcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnYWdlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSBhcyBhbnksXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICAgIGxhYmVsOiAnR2VuZGVyJyxcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnZ2VuZGVyJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgb3B0aW9uczogWydNYWxlJywgJ0ZlbWFsZScsICdPdGhlciddLFxuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzKHVzZXJJbnB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXS50eXBlKS50b0JlKCdzdHJpbmcnKVxuICAgICAgZXhwZWN0KHJlc3VsdFsxXS50eXBlKS50b0JlKCdudW1iZXInKVxuICAgICAgZXhwZWN0KHJlc3VsdFsyXS50eXBlKS50b0JlKCdzZWxlY3QnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3Byb21wdFZhcmlhYmxlc1RvVXNlcklucHV0c0Zvcm0nLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIHN0cmluZyBwcm9tcHQgdmFyaWFibGUgYmFjayB0byB0ZXh0LWlucHV0XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHN0cmluZyBwcm9tcHQgdmFyaWFibGUgdG8gdGV4dC1pbnB1dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb21wdFZhcmlhYmxlczogUHJvbXB0VmFyaWFibGVbXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ3VzZXJfbmFtZScsXG4gICAgICAgICAgbmFtZTogJ1VzZXIgTmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgbWF4X2xlbmd0aDogMTAwLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtKHByb21wdFZhcmlhYmxlcylcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlTGVuZ3RoKDEpXG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0VxdWFsKHtcbiAgICAgICAgJ3RleHQtaW5wdXQnOiB7XG4gICAgICAgICAgbGFiZWw6ICdVc2VyIE5hbWUnLFxuICAgICAgICAgIHZhcmlhYmxlOiAndXNlcl9uYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiAxMDAsXG4gICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgaGlkZTogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIHBhcmFncmFwaCBwcm9tcHQgdmFyaWFibGVcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgcGFyYWdyYXBoIHByb21wdCB2YXJpYWJsZSB0byBwYXJhZ3JhcGggaW5wdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9tcHRWYXJpYWJsZXM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdkZXNjcmlwdGlvbicsXG4gICAgICAgICAgbmFtZTogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgICAgbWF4X2xlbmd0aDogNTAwLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtKHByb21wdFZhcmlhYmxlcylcblxuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9FcXVhbCh7XG4gICAgICAgIHBhcmFncmFwaDoge1xuICAgICAgICAgIGxhYmVsOiAnRGVzY3JpcHRpb24nLFxuICAgICAgICAgIHZhcmlhYmxlOiAnZGVzY3JpcHRpb24nLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiA1MDAsXG4gICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgaGlkZTogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIG51bWJlciBwcm9tcHQgdmFyaWFibGVcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbnVtYmVyIHByb21wdCB2YXJpYWJsZSB0byBudW1iZXIgaW5wdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9tcHRWYXJpYWJsZXM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdhZ2UnLFxuICAgICAgICAgIG5hbWU6ICdBZ2UnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtKHByb21wdFZhcmlhYmxlcylcblxuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9FcXVhbCh7XG4gICAgICAgIG51bWJlcjoge1xuICAgICAgICAgIGxhYmVsOiAnQWdlJyxcbiAgICAgICAgICB2YXJpYWJsZTogJ2FnZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgaGlkZTogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIGNoZWNrYm94IHByb21wdCB2YXJpYWJsZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgY29udmVydCBjaGVja2JveCBwcm9tcHQgdmFyaWFibGUgdG8gY2hlY2tib3ggaW5wdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9tcHRWYXJpYWJsZXM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdhY2NlcHRfdGVybXMnLFxuICAgICAgICAgIG5hbWU6ICdBY2NlcHQgVGVybXMnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHByb21wdFZhcmlhYmxlc1RvVXNlcklucHV0c0Zvcm0ocHJvbXB0VmFyaWFibGVzKVxuXG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0VxdWFsKHtcbiAgICAgICAgY2hlY2tib3g6IHtcbiAgICAgICAgICBsYWJlbDogJ0FjY2VwdCBUZXJtcycsXG4gICAgICAgICAgdmFyaWFibGU6ICdhY2NlcHRfdGVybXMnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgIGhpZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgY29udmVyc2lvbiBvZiBzZWxlY3QgcHJvbXB0IHZhcmlhYmxlXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNlbGVjdCBwcm9tcHQgdmFyaWFibGUgdG8gc2VsZWN0IGlucHV0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAga2V5OiAnY291bnRyeScsXG4gICAgICAgICAgbmFtZTogJ0NvdW50cnknLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgIG9wdGlvbnM6IFsnVVNBJywgJ0NhbmFkYScsICdNZXhpY28nXSxcbiAgICAgICAgICBkZWZhdWx0OiAnVVNBJyxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybShwcm9tcHRWYXJpYWJsZXMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvRXF1YWwoe1xuICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICBsYWJlbDogJ0NvdW50cnknLFxuICAgICAgICAgIHZhcmlhYmxlOiAnY291bnRyeScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgb3B0aW9uczogWydVU0EnLCAnQ2FuYWRhJywgJ01leGljbyddLFxuICAgICAgICAgIGRlZmF1bHQ6ICdVU0EnLFxuICAgICAgICAgIGhpZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgZmlsdGVyaW5nIG9mIGludmFsaWQgcHJvbXB0IHZhcmlhYmxlc1xuICAgICAqIFZhcmlhYmxlcyB3aXRob3V0IGtleSBvciBuYW1lIHNob3VsZCBiZSBmaWx0ZXJlZCBvdXRcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGZpbHRlciBvdXQgdmFyaWFibGVzIHdpdGggZW1wdHkga2V5IG9yIG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9tcHRWYXJpYWJsZXM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICcnLFxuICAgICAgICAgIG5hbWU6ICdFbXB0eSBLZXknLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAndmFsaWQnLFxuICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAnICAnLFxuICAgICAgICAgIG5hbWU6ICdXaGl0ZXNwYWNlIEtleScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICd2YWxpZF9rZXknLFxuICAgICAgICAgIG5hbWU6ICdWYWxpZCBOYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybShwcm9tcHRWYXJpYWJsZXMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCgxKVxuICAgICAgZXhwZWN0KChyZXN1bHRbMF0gYXMgYW55KVsndGV4dC1pbnB1dCddPy52YXJpYWJsZSkudG9CZSgndmFsaWRfa2V5JylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb252ZXJzaW9uIG9mIGV4dGVybmFsIGRhdGEgdG9vbCBwcm9tcHQgdmFyaWFibGVcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgZXh0ZXJuYWwgZGF0YSB0b29sIHByb21wdCB2YXJpYWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb21wdFZhcmlhYmxlczogUHJvbXB0VmFyaWFibGVbXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ2FwaV9kYXRhJyxcbiAgICAgICAgICBuYW1lOiAnQVBJIERhdGEnLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYXBpJyxcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZzogeyBlbmRwb2ludDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyB9LFxuICAgICAgICAgIGljb246ICdhcGktaWNvbicsXG4gICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGNTczMycsXG4gICAgICAgIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHByb21wdFZhcmlhYmxlc1RvVXNlcklucHV0c0Zvcm0ocHJvbXB0VmFyaWFibGVzKVxuXG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0VxdWFsKHtcbiAgICAgICAgZXh0ZXJuYWxfZGF0YV90b29sOiB7XG4gICAgICAgICAgbGFiZWw6ICdBUEkgRGF0YScsXG4gICAgICAgICAgdmFyaWFibGU6ICdhcGlfZGF0YScsXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnYXBpJyxcbiAgICAgICAgICBjb25maWc6IHsgZW5kcG9pbnQ6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbScgfSxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgaWNvbjogJ2FwaS1pY29uJyxcbiAgICAgICAgICBpY29uX2JhY2tncm91bmQ6ICcjRkY1NzMzJyxcbiAgICAgICAgICBoaWRlOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgcmVxdWlyZWQgZGVmYXVsdHMgdG8gdHJ1ZSB3aGVuIG5vdCBleHBsaWNpdGx5IHNldCB0byBmYWxzZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZGVmYXVsdCByZXF1aXJlZCB0byB0cnVlIHdoZW4gbm90IGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAga2V5OiAndGVzdDEnLFxuICAgICAgICAgIG5hbWU6ICdUZXN0IDEnLFxuICAgICAgICAgIHJlcXVpcmVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICd0ZXN0MicsXG4gICAgICAgICAgbmFtZTogJ1Rlc3QgMicsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwcm9tcHRWYXJpYWJsZXNUb1VzZXJJbnB1dHNGb3JtKHByb21wdFZhcmlhYmxlcylcblxuICAgICAgZXhwZWN0KChyZXN1bHRbMF0gYXMgYW55KVsndGV4dC1pbnB1dCddPy5yZXF1aXJlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KChyZXN1bHRbMV0gYXMgYW55KVsndGV4dC1pbnB1dCddPy5yZXF1aXJlZCkudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdmb3JtYXRCb29sZWFuSW5wdXRzJywgKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCBudWxsIG9yIHVuZGVmaW5lZCBpbnB1dHMgYXJlIGhhbmRsZWQgZ3JhY2VmdWxseVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGlucHV0cyB1bmNoYW5nZWQgd2hlbiB1c2VJbnB1dHMgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0cyA9IHsga2V5MTogJ3ZhbHVlMScsIGtleTI6ICd2YWx1ZTInIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdEJvb2xlYW5JbnB1dHMobnVsbCwgaW5wdXRzKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChpbnB1dHMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGlucHV0cyB1bmNoYW5nZWQgd2hlbiB1c2VJbnB1dHMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRzID0geyBrZXkxOiAndmFsdWUxJywga2V5MjogJ3ZhbHVlMicgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0Qm9vbGVhbklucHV0cyh1bmRlZmluZWQsIGlucHV0cylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoaW5wdXRzKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGNvbnZlcnNpb24gb2YgYm9vbGVhbiBpbnB1dCB2YWx1ZXMgdG8gYWN0dWFsIGJvb2xlYW4gdHlwZVxuICAgICAqIFRoaXMgaXMgaW1wb3J0YW50IGZvciBwcm9wZXIgdHlwZSBoYW5kbGluZyBpbiB0aGUgYmFja2VuZFxuICAgICAqIE5vdGU6IGNoZWNrYm94IGlucHV0cyBhcmUgY29udmVydGVkIHRvIHR5cGUgJ2NoZWNrYm94JyBieSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGJvb2xlYW4gaW5wdXRzIHRvIGJvb2xlYW4gdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZUlucHV0czogUHJvbXB0VmFyaWFibGVbXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ2FjY2VwdF90ZXJtcycsXG4gICAgICAgICAgbmFtZTogJ0FjY2VwdCBUZXJtcycsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ3N1YnNjcmliZScsXG4gICAgICAgICAgbmFtZTogJ1N1YnNjcmliZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IGlucHV0cyA9IHtcbiAgICAgICAgYWNjZXB0X3Rlcm1zOiAndHJ1ZScsXG4gICAgICAgIHN1YnNjcmliZTogJycsXG4gICAgICAgIG90aGVyX2ZpZWxkOiAndmFsdWUnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRCb29sZWFuSW5wdXRzKHVzZUlucHV0cywgaW5wdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgYWNjZXB0X3Rlcm1zOiB0cnVlLFxuICAgICAgICBzdWJzY3JpYmU6IGZhbHNlLFxuICAgICAgICBvdGhlcl9maWVsZDogJ3ZhbHVlJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCBub24tYm9vbGVhbiBpbnB1dHMgYXJlIG5vdCBhZmZlY3RlZFxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgbm90IG1vZGlmeSBub24tYm9vbGVhbiBpbnB1dHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VJbnB1dHM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICduYW1lJyxcbiAgICAgICAgICBuYW1lOiAnTmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdhZ2UnLFxuICAgICAgICAgIG5hbWU6ICdBZ2UnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCBpbnB1dHMgPSB7XG4gICAgICAgIG5hbWU6ICdKb2huIERvZScsXG4gICAgICAgIGFnZTogMzAsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdEJvb2xlYW5JbnB1dHModXNlSW5wdXRzLCBpbnB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoaW5wdXRzKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGhhbmRsaW5nIG9mIHRydXRoeSBhbmQgZmFsc3kgdmFsdWVzIGZvciBib29sZWFuIGNvbnZlcnNpb25cbiAgICAgKiBOb3RlOiBjaGVja2JveCBpbnB1dHMgYXJlIGNvbnZlcnRlZCB0byB0eXBlICdjaGVja2JveCcgYnkgdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlc1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhcmlvdXMgdHJ1dGh5IGFuZCBmYWxzeSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VJbnB1dHM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdib29sMScsXG4gICAgICAgICAgbmFtZTogJ0Jvb2wgMScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ2Jvb2wyJyxcbiAgICAgICAgICBuYW1lOiAnQm9vbCAyJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAnYm9vbDMnLFxuICAgICAgICAgIG5hbWU6ICdCb29sIDMnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdib29sNCcsXG4gICAgICAgICAgbmFtZTogJ0Jvb2wgNCcsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgaW5wdXRzID0ge1xuICAgICAgICBib29sMTogMSxcbiAgICAgICAgYm9vbDI6IDAsXG4gICAgICAgIGJvb2wzOiAneWVzJyxcbiAgICAgICAgYm9vbDQ6IG51bGwgYXMgYW55LFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRCb29sZWFuSW5wdXRzKHVzZUlucHV0cywgaW5wdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0Py5ib29sMSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdD8uYm9vbDIpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QocmVzdWx0Py5ib29sMykudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdD8uYm9vbDQpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCB0aGUgZnVuY3Rpb24gY3JlYXRlcyBhIG5ldyBvYmplY3QgYW5kIGRvZXNuJ3QgbXV0YXRlIHRoZSBvcmlnaW5hbFxuICAgICAqIE5vdGU6IGNoZWNrYm94IGlucHV0cyBhcmUgY29udmVydGVkIHRvIHR5cGUgJ2NoZWNrYm94JyBieSB1c2VySW5wdXRzRm9ybVRvUHJvbXB0VmFyaWFibGVzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBub3QgbXV0YXRlIG9yaWdpbmFsIGlucHV0cyBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VJbnB1dHM6IFByb21wdFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdmbGFnJyxcbiAgICAgICAgICBuYW1lOiAnRmxhZycsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgaW5wdXRzID0geyBmbGFnOiAndHJ1ZScsIG90aGVyOiAndmFsdWUnIH1cbiAgICAgIGNvbnN0IG9yaWdpbmFsSW5wdXRzID0geyAuLi5pbnB1dHMgfVxuXG4gICAgICBmb3JtYXRCb29sZWFuSW5wdXRzKHVzZUlucHV0cywgaW5wdXRzKVxuXG4gICAgICBleHBlY3QoaW5wdXRzKS50b0VxdWFsKG9yaWdpbmFsSW5wdXRzKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JvdW5kLXRyaXAgY29udmVyc2lvbicsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgY29udmVydGluZyBmcm9tIFVzZXJJbnB1dEZvcm0gdG8gUHJvbXB0VmFyaWFibGUgYW5kIGJhY2tcbiAgICAgKiBwcmVzZXJ2ZXMgdGhlIGVzc2VudGlhbCBkYXRhICh0aG91Z2ggc29tZSBmaWVsZHMgbWF5IGhhdmUgZGVmYXVsdHMgYXBwbGllZClcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIGRhdGEgdGhyb3VnaCByb3VuZC10cmlwIGNvbnZlcnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbFVzZXJJbnB1dHM6IFVzZXJJbnB1dEZvcm1JdGVtW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAndGV4dC1pbnB1dCc6IHtcbiAgICAgICAgICAgIGxhYmVsOiAnTmFtZScsXG4gICAgICAgICAgICB2YXJpYWJsZTogJ25hbWUnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBtYXhfbGVuZ3RoOiA1MCxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgbGFiZWw6ICdUeXBlJyxcbiAgICAgICAgICAgIHZhcmlhYmxlOiAndHlwZScsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICBvcHRpb25zOiBbJ0EnLCAnQicsICdDJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnQScsXG4gICAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCBwcm9tcHRWYXJzID0gdXNlcklucHV0c0Zvcm1Ub1Byb21wdFZhcmlhYmxlcyhvcmlnaW5hbFVzZXJJbnB1dHMpXG4gICAgICBjb25zdCBiYWNrVG9Vc2VySW5wdXRzID0gcHJvbXB0VmFyaWFibGVzVG9Vc2VySW5wdXRzRm9ybShwcm9tcHRWYXJzKVxuXG4gICAgICBleHBlY3QoYmFja1RvVXNlcklucHV0cykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICBleHBlY3QoKGJhY2tUb1VzZXJJbnB1dHNbMF0gYXMgYW55KVsndGV4dC1pbnB1dCddPy52YXJpYWJsZSkudG9CZSgnbmFtZScpXG4gICAgICBleHBlY3QoKGJhY2tUb1VzZXJJbnB1dHNbMV0gYXMgYW55KS5zZWxlY3Q/LnZhcmlhYmxlKS50b0JlKCd0eXBlJylcbiAgICAgIGV4cGVjdCgoYmFja1RvVXNlcklucHV0c1sxXSBhcyBhbnkpLnNlbGVjdD8ub3B0aW9ucykudG9FcXVhbChbJ0EnLCAnQicsICdDJ10pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=