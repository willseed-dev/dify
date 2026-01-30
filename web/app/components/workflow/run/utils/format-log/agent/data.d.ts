export declare const agentNodeData: {
    in: {
        node_type: any;
        execution_metadata: {
            agent_log: ({
                id: string;
                label: string;
                parent_id?: undefined;
            } | {
                id: string;
                parent_id: string;
                label: string;
            })[];
        };
    }[];
    expect: {
        agentLog: {
            id: string;
            label: string;
            children: ({
                id: string;
                parent_id: string;
                label: string;
                children: {
                    id: string;
                    parent_id: string;
                    label: string;
                    children: ({
                        id: string;
                        parent_id: string;
                        label: string;
                        children: {
                            id: string;
                            parent_id: string;
                            label: string;
                        }[];
                    } | {
                        id: string;
                        parent_id: string;
                        label: string;
                        children?: undefined;
                    })[];
                }[];
            } | {
                id: string;
                parent_id: string;
                label: string;
                children: {
                    id: string;
                    parent_id: string;
                    label: string;
                }[];
            })[];
        }[];
        node_type: any;
        execution_metadata: {
            agent_log: ({
                id: string;
                label: string;
                parent_id?: undefined;
            } | {
                id: string;
                parent_id: string;
                label: string;
            })[];
        };
    }[];
};
export declare const oneStepCircle: {
    in: {
        node_type: any;
        execution_metadata: {
            agent_log: ({
                id: string;
                label: string;
                parent_id?: undefined;
            } | {
                id: string;
                parent_id: string;
                label: string;
            })[];
        };
    }[];
    expect: {
        agentLog: {
            id: string;
            label: string;
            hasCircle: boolean;
            children: never[];
        }[];
        node_type: any;
        execution_metadata: {
            agent_log: ({
                id: string;
                label: string;
                parent_id?: undefined;
            } | {
                id: string;
                parent_id: string;
                label: string;
            })[];
        };
    }[];
};
export declare const multiStepsCircle: {
    in: {
        node_type: any;
        execution_metadata: {
            agent_log: ({
                id: string;
                label: string;
                parent_id?: undefined;
            } | {
                id: string;
                parent_id: string;
                label: string;
            })[];
        };
    }[];
    expect: {
        agentLog: {
            id: string;
            label: string;
            children: ({
                id: string;
                parent_id: string;
                label: string;
                children: {
                    id: string;
                    parent_id: string;
                    label: string;
                    children: never[];
                    hasCircle: boolean;
                }[];
            } | {
                id: string;
                parent_id: string;
                label: string;
                children?: undefined;
            })[];
        }[];
        node_type: any;
        execution_metadata: {
            agent_log: ({
                id: string;
                label: string;
                parent_id?: undefined;
            } | {
                id: string;
                parent_id: string;
                label: string;
            })[];
        };
    }[];
};
