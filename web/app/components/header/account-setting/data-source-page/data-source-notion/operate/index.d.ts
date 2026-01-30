type OperateProps = {
    payload: {
        id: string;
        total: number;
    };
    onAuthAgain: () => void;
};
export default function Operate({ payload, onAuthAgain, }: OperateProps): any;
export {};
