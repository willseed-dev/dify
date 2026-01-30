import * as React from 'react';
type SetURLProps = {
    repoUrl: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onCancel: () => void;
};
declare const SetURL: React.FC<SetURLProps>;
export default SetURL;
