import type { UpdateFromGitHubPayload } from '../../types';
import * as React from 'react';
type InstallFromGitHubProps = {
    updatePayload?: UpdateFromGitHubPayload;
    onClose: () => void;
    onSuccess: () => void;
};
declare const InstallFromGitHub: React.FC<InstallFromGitHubProps>;
export default InstallFromGitHub;
