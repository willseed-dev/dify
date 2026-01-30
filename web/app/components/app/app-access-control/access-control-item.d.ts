import type { FC, PropsWithChildren } from 'react';
import type { AccessMode } from '@/models/access-control';
type AccessControlItemProps = PropsWithChildren<{
    type: AccessMode;
}>;
declare const AccessControlItem: FC<AccessControlItemProps>;
export default AccessControlItem;
