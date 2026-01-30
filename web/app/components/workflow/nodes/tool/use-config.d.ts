import type { ToolNodeType } from './types';
declare const useConfig: (id: string, payload: ToolNodeType) => {
    readOnly: any;
    inputs: any;
    currTool: any;
    toolSettingSchema: any;
    toolSettingValue: any;
    setToolSettingValue: any;
    toolInputVarSchema: any;
    setInputVar: any;
    currCollection: any;
    isShowAuthBtn: boolean;
    showSetAuth: any;
    showSetAuthModal: any;
    hideSetAuthModal: any;
    handleSaveAuth: any;
    isLoading: any;
    outputSchema: any;
    hasObjectOutput: any;
    getMoreDataForCheckValid: () => {
        toolInputsSchema: InputVar[];
        notAuthed: boolean;
        toolSettingSchema: any;
        language: any;
    };
};
export default useConfig;
