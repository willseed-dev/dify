import type * as React from 'react';
import type { IRadioProps } from './component/radio';
import Group from './component/group';
type CompoundedComponent = {
    Group: typeof Group;
} & React.ForwardRefExoticComponent<IRadioProps & React.RefAttributes<HTMLElement>>;
declare const Radio: CompoundedComponent;
export default Radio;
