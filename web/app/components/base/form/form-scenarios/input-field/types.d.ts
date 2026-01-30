import type { DeepKeys, FieldListeners } from '@tanstack/react-form';
import type { NumberConfiguration, SelectConfiguration, ShowCondition } from '../base/types';
export declare enum InputFieldType {
    textInput = "textInput",
    numberInput = "numberInput",
    numberSlider = "numberSlider",
    checkbox = "checkbox",
    options = "options",
    select = "select",
    inputTypeSelect = "inputTypeSelect",
    uploadMethod = "uploadMethod",
    fileTypes = "fileTypes"
}
export type InputTypeSelectConfiguration = {
    supportFile: boolean;
};
export type NumberSliderConfiguration = {
    description: string;
    max?: number;
    min?: number;
};
export type InputFieldConfiguration = {
    label: string;
    variable: string;
    maxLength?: number;
    placeholder?: string;
    required: boolean;
    showOptional?: boolean;
    showConditions: ShowCondition[];
    type: InputFieldType;
    tooltip?: string;
    listeners?: FieldListeners<Record<string, any>, DeepKeys<Record<string, any>>>;
} & NumberConfiguration & Partial<InputTypeSelectConfiguration> & Partial<NumberSliderConfiguration> & Partial<SelectConfiguration>;
