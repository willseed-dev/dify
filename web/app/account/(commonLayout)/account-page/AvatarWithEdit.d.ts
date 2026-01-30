import type { AvatarProps } from '@/app/components/base/avatar';
type AvatarWithEditProps = AvatarProps & {
    onSave?: () => void;
};
declare const AvatarWithEdit: ({ onSave, ...props }: AvatarWithEditProps) => any;
export default AvatarWithEdit;
