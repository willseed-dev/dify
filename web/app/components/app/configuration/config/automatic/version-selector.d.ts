import * as React from 'react';
type VersionSelectorProps = {
    versionLen: number;
    value: number;
    onChange: (index: number) => void;
};
declare const VersionSelector: React.FC<VersionSelectorProps>;
export default VersionSelector;
