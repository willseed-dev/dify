import type { InvitationResult } from '@/models/common';
export type SuccessInvitationResult = Extract<InvitationResult, {
    status: 'success';
}>;
export type FailedInvitationResult = Extract<InvitationResult, {
    status: 'failed';
}>;
type IInvitedModalProps = {
    invitationResults: InvitationResult[];
    onCancel: () => void;
};
declare const InvitedModal: ({ invitationResults, onCancel, }: IInvitedModalProps) => any;
export default InvitedModal;
