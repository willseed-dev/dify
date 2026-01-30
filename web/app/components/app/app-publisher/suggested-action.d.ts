import type { HTMLProps, PropsWithChildren } from 'react';
export type SuggestedActionProps = PropsWithChildren<HTMLProps<HTMLAnchorElement> & {
    icon?: React.ReactNode;
    link?: string;
    disabled?: boolean;
}>;
declare const SuggestedAction: ({ icon, link, disabled, children, className, onClick, ...props }: SuggestedActionProps) => any;
export default SuggestedAction;
