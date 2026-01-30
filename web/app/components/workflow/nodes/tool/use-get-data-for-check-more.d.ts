import type { ToolNodeType } from './types';
type Params = {
    id: string;
    payload: ToolNodeType;
};
declare const useGetDataForCheckMore: ({ id, payload, }: Params) => {
    getData: () => {
        toolInputsSchema: InputVar[];
        notAuthed: boolean;
        toolSettingSchema: any;
        language: any;
    };
};
export default useGetDataForCheckMore;
