import type { ComponentProps, FC } from 'react';
export type PreviewHeaderProps = Omit<ComponentProps<'div'>, 'title'> & {
    title: string;
};
export declare const PreviewHeader: FC<PreviewHeaderProps>;
