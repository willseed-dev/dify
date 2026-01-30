import type { InvitationResult } from '@/models/common';
import 'react-multi-email/dist/style.css';
type IInviteModalProps = {
    isEmailSetup: boolean;
    onCancel: () => void;
    onSend: (invitationResults: InvitationResult[]) => void;
};
declare const InviteModal: ({ isEmailSetup, onCancel, onSend, }: IInviteModalProps) => any;
export default InviteModal;
