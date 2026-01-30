export type ExpireNoticeModalPayloadProps = {
    expireAt: number;
    expired: boolean;
};
export type Props = {
    onClose: () => void;
} & ExpireNoticeModalPayloadProps;
declare const _default: any;
export default _default;
