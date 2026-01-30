import type { IDrawerProps } from '@/app/components/base/drawer';
type IFloatRightContainerProps = {
    isMobile: boolean;
    children?: React.ReactNode;
} & IDrawerProps;
declare const FloatRightContainer: ({ isMobile, children, isOpen, ...drawerProps }: IFloatRightContainerProps) => any;
export default FloatRightContainer;
