import type { InputForm } from './type';
export declare const processOpeningStatement: (openingStatement: string, inputs: Record<string, any>, inputsForm: InputForm[]) => string;
export declare const processInputFileFromServer: (fileItem: Record<string, any>) => {
    type: any;
    transfer_method: any;
    url: any;
    upload_file_id: any;
};
export declare const getProcessedInputs: (inputs: Record<string, any>, inputsForm: InputForm[]) => {
    [x: string]: any;
};
