import type { ComponentProps, FC, ReactNode } from 'react';
export type PreviewContainerProps = ComponentProps<'div'> & {
    header: ReactNode;
    mainClassName?: string;
    ref?: React.Ref<HTMLDivElement>;
};
declare const PreviewContainer: FC<PreviewContainerProps>;
export default PreviewContainer;
