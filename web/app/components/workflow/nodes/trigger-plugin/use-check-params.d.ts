import type { PluginTriggerNodeType } from './types';
type Params = {
    id: string;
    payload: PluginTriggerNodeType;
};
declare const useGetDataForCheckMore: ({ payload, }: Params) => {
    getData: any;
};
export default useGetDataForCheckMore;
