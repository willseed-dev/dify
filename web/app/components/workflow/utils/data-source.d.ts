import type { DataSourceNodeType } from '../nodes/data-source/types';
import type { InputVar, ToolWithProvider } from '../types';
export declare const getDataSourceCheckParams: (toolData: DataSourceNodeType, dataSourceList: ToolWithProvider[], language: string) => {
    dataSourceInputsSchema: InputVar[];
    notAuthed: boolean;
    language: string;
};
