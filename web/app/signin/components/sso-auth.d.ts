import type { FC } from 'react';
import { SSOProtocol } from '@/types/feature';
type SSOAuthProps = {
    protocol: SSOProtocol | '';
};
declare const SSOAuth: FC<SSOAuthProps>;
export default SSOAuth;
