import * as React from 'react';
type InstallFromLocalPackageProps = {
    file: File;
    onSuccess: () => void;
    onClose: () => void;
};
declare const InstallFromLocalPackage: React.FC<InstallFromLocalPackageProps>;
export default InstallFromLocalPackage;
