export type AvatarProps = {
    name: string;
    avatar: string | null;
    size?: number;
    className?: string;
    textClassName?: string;
    onError?: (x: boolean) => void;
};
declare const Avatar: ({ name, avatar, size, className, textClassName, onError, }: AvatarProps) => any;
export default Avatar;
