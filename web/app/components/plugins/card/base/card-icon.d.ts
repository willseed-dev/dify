declare const Icon: ({ className, src, installed, installFailed, size, }: {
    className?: string;
    src: string | {
        content: string;
        background: string;
    };
    installed?: boolean;
    installFailed?: boolean;
    size?: "xs" | "tiny" | "small" | "medium" | "large";
}) => any;
export default Icon;
