import type { FC } from 'react';
type JsonImporterProps = {
    onSubmit: (schema: any) => void;
    updateBtnWidth: (width: number) => void;
};
declare const JsonImporter: FC<JsonImporterProps>;
export default JsonImporter;
