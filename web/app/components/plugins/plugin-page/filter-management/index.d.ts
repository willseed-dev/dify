import * as React from 'react';
export type FilterState = {
    categories: string[];
    tags: string[];
    searchQuery: string;
};
type FilterManagementProps = {
    onFilterChange: (filters: FilterState) => void;
};
declare const FilterManagement: React.FC<FilterManagementProps>;
export default FilterManagement;
