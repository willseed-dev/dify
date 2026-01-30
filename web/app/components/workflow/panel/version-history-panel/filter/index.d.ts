import type { FC } from 'react';
import { WorkflowVersionFilterOptions } from '../../../types';
type FilterProps = {
    filterValue: WorkflowVersionFilterOptions;
    isOnlyShowNamedVersions: boolean;
    onClickFilterItem: (filter: WorkflowVersionFilterOptions) => void;
    handleSwitch: (isOnlyShowNamedVersions: boolean) => void;
};
declare const Filter: FC<FilterProps>;
export default Filter;
