import { DataSourceType } from '@/models/datasets';
type DataSourceTypeSelectorProps = {
    currentType: DataSourceType;
    disabled: boolean;
    onChange: (type: DataSourceType) => void;
    onClearPreviews: (type: DataSourceType) => void;
};
/**
 * Data source type selector component for choosing between file, notion, and web sources.
 */
declare function DataSourceTypeSelector({ currentType, disabled, onChange, onClearPreviews, }: DataSourceTypeSelectorProps): any;
export default DataSourceTypeSelector;
