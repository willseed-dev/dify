"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeOutputVars = exports.updateNodeVars = exports.findUsedVarNodes = exports.getNodeUsedVarPassToServerKey = exports.getNodeUsedVars = exports.getNodeInfoById = exports.toNodeAvailableVars = exports.getVarType = exports.toNodeOutputVars = exports.removeFileVars = exports.varTypeToStructType = exports.inputVarTypeToVarType = exports.hasValidChildren = exports.isSpecialVar = exports.isRagVariableVar = exports.isConversationVar = exports.isENV = exports.isGlobalVar = exports.isSystemVar = void 0;
const array_1 = require("es-toolkit/array");
const compat_1 = require("es-toolkit/compat");
const immer_1 = require("immer");
const constants_1 = require("@/app/components/workflow/constants");
const default_1 = require("@/app/components/workflow/nodes/data-source/default");
const default_2 = require("@/app/components/workflow/nodes/tool/default");
const default_3 = require("@/app/components/workflow/nodes/trigger-plugin/default");
const types_1 = require("@/app/components/workflow/types");
const config_1 = require("@/config");
const app_1 = require("@/types/app");
const constants_2 = require("../../../constants");
const types_2 = require("../../../llm/types");
const types_3 = require("../../../tool/types");
const isSystemVar = (valueSelector) => {
    return valueSelector[0] === 'sys' || valueSelector[1] === 'sys';
};
exports.isSystemVar = isSystemVar;
const isGlobalVar = (valueSelector) => {
    if (!(0, exports.isSystemVar)(valueSelector))
        return false;
    const second = valueSelector[1];
    if (['query', 'files'].includes(second))
        return false;
    return true;
};
exports.isGlobalVar = isGlobalVar;
const isENV = (valueSelector) => {
    return valueSelector[0] === 'env';
};
exports.isENV = isENV;
const isConversationVar = (valueSelector) => {
    return valueSelector[0] === 'conversation';
};
exports.isConversationVar = isConversationVar;
const isRagVariableVar = (valueSelector) => {
    if (!valueSelector)
        return false;
    return valueSelector[0] === 'rag';
};
exports.isRagVariableVar = isRagVariableVar;
const isSpecialVar = (prefix) => {
    return ['sys', 'env', 'conversation', 'rag'].includes(prefix);
};
exports.isSpecialVar = isSpecialVar;
const hasValidChildren = (children) => {
    return (children
        && ((Array.isArray(children) && children.length > 0)
            || (!Array.isArray(children)
                && Object.keys(children?.schema?.properties || {})
                    .length > 0)));
};
exports.hasValidChildren = hasValidChildren;
const inputVarTypeToVarType = (type) => {
    return ({
        [types_1.InputVarType.number]: types_1.VarType.number,
        [types_1.InputVarType.checkbox]: types_1.VarType.boolean,
        [types_1.InputVarType.singleFile]: types_1.VarType.file,
        [types_1.InputVarType.multiFiles]: types_1.VarType.arrayFile,
        [types_1.InputVarType.jsonObject]: types_1.VarType.object,
    }[type] || types_1.VarType.string);
};
exports.inputVarTypeToVarType = inputVarTypeToVarType;
const structTypeToVarType = (type, isArray) => {
    if (isArray) {
        return ({
            [types_2.Type.string]: types_1.VarType.arrayString,
            [types_2.Type.number]: types_1.VarType.arrayNumber,
            [types_2.Type.object]: types_1.VarType.arrayObject,
        }[type] || types_1.VarType.string);
    }
    return ({
        [types_2.Type.string]: types_1.VarType.string,
        [types_2.Type.number]: types_1.VarType.number,
        [types_2.Type.boolean]: types_1.VarType.boolean,
        [types_2.Type.object]: types_1.VarType.object,
        [types_2.Type.array]: types_1.VarType.array,
    }[type] || types_1.VarType.string);
};
const varTypeToStructType = (type) => {
    return ({
        [types_1.VarType.string]: types_2.Type.string,
        [types_1.VarType.number]: types_2.Type.number,
        [types_1.VarType.boolean]: types_2.Type.boolean,
        [types_1.VarType.object]: types_2.Type.object,
        [types_1.VarType.array]: types_2.Type.array,
        [types_1.VarType.arrayString]: types_2.Type.array,
        [types_1.VarType.arrayNumber]: types_2.Type.array,
        [types_1.VarType.arrayObject]: types_2.Type.array,
        [types_1.VarType.arrayFile]: types_2.Type.array,
    }[type] || types_2.Type.string);
};
exports.varTypeToStructType = varTypeToStructType;
const findExceptVarInStructuredProperties = (properties, filterVar) => {
    const res = (0, immer_1.produce)(properties, (draft) => {
        Object.keys(properties).forEach((key) => {
            const item = properties[key];
            const isObj = item.type === types_2.Type.object;
            const isArray = item.type === types_2.Type.array;
            const arrayType = item.items?.type;
            if (!isObj
                && !filterVar({
                    variable: key,
                    type: structTypeToVarType(isArray ? arrayType : item.type, isArray),
                }, [key])) {
                delete properties[key];
                return;
            }
            if (item.type === types_2.Type.object && item.properties) {
                item.properties = findExceptVarInStructuredProperties(item.properties, filterVar);
            }
        });
        return draft;
    });
    return res;
};
const findExceptVarInStructuredOutput = (structuredOutput, filterVar) => {
    const res = (0, immer_1.produce)(structuredOutput, (draft) => {
        const properties = draft.schema.properties;
        Object.keys(properties).forEach((key) => {
            const item = properties[key];
            const isObj = item.type === types_2.Type.object;
            const isArray = item.type === types_2.Type.array;
            const arrayType = item.items?.type;
            if (!isObj
                && !filterVar({
                    variable: key,
                    type: structTypeToVarType(isArray ? arrayType : item.type, isArray),
                }, [key])) {
                delete properties[key];
                return;
            }
            if (item.type === types_2.Type.object && item.properties) {
                item.properties = findExceptVarInStructuredProperties(item.properties, filterVar);
            }
        });
        return draft;
    });
    return res;
};
const findExceptVarInObject = (obj, filterVar, value_selector, isFile) => {
    const { children } = obj;
    const isStructuredOutput = !!children?.schema?.properties;
    let childrenResult;
    if (isStructuredOutput) {
        childrenResult = findExceptVarInStructuredOutput(children, filterVar);
    }
    else if (Array.isArray(children)) {
        childrenResult = children
            .map((item) => {
            const { children: itemChildren } = item;
            const currSelector = [...value_selector, item.variable];
            if (!itemChildren) {
                return {
                    item,
                    filteredObj: null,
                    passesFilter: filterVar(item, currSelector),
                };
            }
            const filteredObj = findExceptVarInObject(item, filterVar, currSelector, false);
            const itemHasValidChildren = (0, exports.hasValidChildren)(filteredObj.children);
            let passesFilter;
            if ((item.type === types_1.VarType.object || item.type === types_1.VarType.file)
                && itemChildren) {
                passesFilter = itemHasValidChildren || filterVar(item, currSelector);
            }
            else {
                passesFilter = itemHasValidChildren;
            }
            return {
                item,
                filteredObj,
                passesFilter,
            };
        })
            .filter(({ passesFilter }) => passesFilter)
            .map(({ item, filteredObj }) => {
            const { children: itemChildren } = item;
            if (!itemChildren || !filteredObj)
                return item;
            return {
                ...item,
                children: filteredObj.children,
            };
        });
    }
    else {
        childrenResult = [];
    }
    const res = {
        variable: obj.variable,
        type: isFile ? types_1.VarType.file : types_1.VarType.object,
        children: childrenResult,
        schemaType: obj.schemaType,
    };
    return res;
};
const formatItem = (item, isChatMode, filterVar, allPluginInfoList, ragVars, schemaTypeDefinitions = []) => {
    const { id, data } = item;
    const res = {
        nodeId: id,
        title: data.title,
        vars: [],
    };
    switch (data.type) {
        case types_1.BlockEnum.Start: {
            const { variables } = data;
            res.vars = variables.map((v) => {
                const type = (0, exports.inputVarTypeToVarType)(v.type);
                const varRes = {
                    variable: v.variable,
                    type,
                    isParagraph: v.type === types_1.InputVarType.paragraph,
                    isSelect: v.type === types_1.InputVarType.select,
                    options: v.options,
                    required: v.required,
                };
                try {
                    if (type === types_1.VarType.object && v.json_schema) {
                        varRes.children = {
                            schema: typeof v.json_schema === 'string' ? JSON.parse(v.json_schema) : v.json_schema,
                        };
                    }
                }
                catch (error) {
                    console.error('Error formatting variable:', error);
                }
                return varRes;
            });
            if (isChatMode) {
                res.vars.push({
                    variable: 'sys.query',
                    type: types_1.VarType.string,
                });
            }
            res.vars.push({
                variable: 'sys.files',
                type: types_1.VarType.arrayFile,
            });
            break;
        }
        case types_1.BlockEnum.TriggerWebhook: {
            const { variables = [], } = data;
            res.vars = variables.map((v) => {
                const type = v.value_type || types_1.VarType.string;
                const varRes = {
                    variable: v.variable,
                    type,
                    isParagraph: false,
                    isSelect: false,
                    options: v.options,
                    required: v.required,
                };
                return varRes;
            });
            break;
        }
        case types_1.BlockEnum.LLM: {
            res.vars = [...constants_1.LLM_OUTPUT_STRUCT];
            if (data.structured_output_enabled
                && data.structured_output?.schema?.properties
                && Object.keys(data.structured_output.schema.properties).length > 0) {
                res.vars.push({
                    variable: 'structured_output',
                    type: types_1.VarType.object,
                    children: data.structured_output,
                });
            }
            break;
        }
        case types_1.BlockEnum.KnowledgeRetrieval: {
            res.vars = constants_1.KNOWLEDGE_RETRIEVAL_OUTPUT_STRUCT;
            break;
        }
        case types_1.BlockEnum.Code: {
            const { outputs } = data;
            res.vars = outputs
                ? Object.keys(outputs).map((key) => {
                    return {
                        variable: key,
                        type: outputs[key].type,
                    };
                })
                : [];
            break;
        }
        case types_1.BlockEnum.TemplateTransform: {
            res.vars = constants_1.TEMPLATE_TRANSFORM_OUTPUT_STRUCT;
            break;
        }
        case types_1.BlockEnum.QuestionClassifier: {
            res.vars = constants_1.QUESTION_CLASSIFIER_OUTPUT_STRUCT;
            break;
        }
        case types_1.BlockEnum.HttpRequest: {
            res.vars = constants_1.HTTP_REQUEST_OUTPUT_STRUCT;
            break;
        }
        case types_1.BlockEnum.VariableAssigner: {
            const { output_type, advanced_settings } = data;
            const isGroup = !!advanced_settings?.group_enabled;
            if (!isGroup) {
                res.vars = [
                    {
                        variable: 'output',
                        type: output_type,
                    },
                ];
            }
            else {
                res.vars = advanced_settings?.groups.map((group) => {
                    return {
                        variable: group.group_name,
                        type: types_1.VarType.object,
                        children: [
                            {
                                variable: 'output',
                                type: group.output_type,
                            },
                        ],
                    };
                });
            }
            break;
        }
        // eslint-disable-next-line sonarjs/no-duplicated-branches
        case types_1.BlockEnum.VariableAggregator: {
            const { output_type, advanced_settings } = data;
            const isGroup = !!advanced_settings?.group_enabled;
            if (!isGroup) {
                res.vars = [
                    {
                        variable: 'output',
                        type: output_type,
                    },
                ];
            }
            else {
                res.vars = advanced_settings?.groups.map((group) => {
                    return {
                        variable: group.group_name,
                        type: types_1.VarType.object,
                        children: [
                            {
                                variable: 'output',
                                type: group.output_type,
                            },
                        ],
                    };
                });
            }
            break;
        }
        case types_1.BlockEnum.Tool: {
            const toolOutputVars = default_2.default.getOutputVars?.(data, allPluginInfoList, [], { schemaTypeDefinitions }) || [];
            res.vars = toolOutputVars;
            break;
        }
        case types_1.BlockEnum.ParameterExtractor: {
            res.vars = [
                ...(data.parameters || []).map((p) => {
                    return {
                        variable: p.name,
                        type: p.type,
                    };
                }),
                ...constants_1.PARAMETER_EXTRACTOR_COMMON_STRUCT,
            ];
            break;
        }
        case types_1.BlockEnum.Iteration: {
            res.vars = [
                {
                    variable: 'output',
                    type: data.output_type || types_1.VarType.arrayString,
                },
            ];
            break;
        }
        case types_1.BlockEnum.Loop: {
            const { loop_variables } = data;
            res.isLoop = true;
            res.vars
                = loop_variables?.map((v) => {
                    return {
                        variable: v.label,
                        type: v.var_type,
                        isLoopVariable: true,
                        nodeId: res.nodeId,
                    };
                }) || [];
            break;
        }
        case types_1.BlockEnum.DocExtractor: {
            res.vars = [
                {
                    variable: 'text',
                    type: data.is_array_file
                        ? types_1.VarType.arrayString
                        : types_1.VarType.string,
                },
            ];
            break;
        }
        case types_1.BlockEnum.ListFilter: {
            if (!data.var_type)
                break;
            res.vars = [
                {
                    variable: 'result',
                    type: data.var_type,
                },
                {
                    variable: 'first_record',
                    type: data.item_var_type,
                },
                {
                    variable: 'last_record',
                    type: data.item_var_type,
                },
            ];
            break;
        }
        case types_1.BlockEnum.Agent: {
            const payload = data;
            const outputs = [];
            Object.keys(payload.output_schema?.properties || {}).forEach((outputKey) => {
                const output = payload.output_schema.properties[outputKey];
                outputs.push({
                    variable: outputKey,
                    type: output.type === 'array'
                        ? `Array[${output.items?.type ? output.items.type.slice(0, 1).toLocaleUpperCase() + output.items.type.slice(1) : 'Unknown'}]`
                        : `${output.type ? output.type.slice(0, 1).toLocaleUpperCase() + output.type.slice(1) : 'Unknown'}`,
                });
            });
            res.vars = [...outputs, ...constants_1.TOOL_OUTPUT_STRUCT, ...constants_1.AGENT_OUTPUT_STRUCT];
            break;
        }
        case types_1.BlockEnum.DataSource: {
            const payload = data;
            const dataSourceVars = default_1.default.getOutputVars?.(payload, allPluginInfoList, ragVars, { schemaTypeDefinitions }) || [];
            res.vars = dataSourceVars;
            break;
        }
        case types_1.BlockEnum.TriggerPlugin: {
            const outputSchema = default_3.default.getOutputVars?.(data, allPluginInfoList, [], { schemaTypeDefinitions }) || [];
            res.vars = outputSchema;
            break;
        }
        case 'env': {
            res.vars = data.envList.map((env) => {
                return {
                    variable: `env.${env.name}`,
                    type: env.value_type,
                    description: env.description,
                };
            });
            break;
        }
        case 'conversation': {
            res.vars = data.chatVarList.map((chatVar) => {
                return {
                    variable: `conversation.${chatVar.name}`,
                    type: chatVar.value_type,
                    description: chatVar.description,
                };
            });
            break;
        }
        case 'global': {
            res.vars = data.globalVarList;
            break;
        }
        case 'rag': {
            res.vars = data.ragVariables.map((ragVar) => {
                return {
                    variable: `rag.shared.${ragVar.variable}`,
                    type: (0, exports.inputVarTypeToVarType)(ragVar.type),
                    des: ragVar.label,
                    isRagVariable: true,
                };
            });
            break;
        }
    }
    const { error_strategy } = data;
    if (error_strategy) {
        res.vars = [
            ...res.vars,
            {
                variable: 'error_message',
                type: types_1.VarType.string,
                isException: true,
            },
            {
                variable: 'error_type',
                type: types_1.VarType.string,
                isException: true,
            },
        ];
    }
    const selector = [id];
    res.vars = res.vars
        .filter((v) => {
        const isCurrentMatched = filterVar(v, (() => {
            const variableArr = v.variable.split('.');
            const [first] = variableArr;
            if ((0, exports.isSpecialVar)(first))
                return variableArr;
            return [...selector, ...variableArr];
        })());
        if (isCurrentMatched)
            return true;
        const isFile = v.type === types_1.VarType.file;
        const children = (() => {
            if (isFile) {
                return constants_2.OUTPUT_FILE_SUB_VARIABLES.map((key) => {
                    const def = constants_1.FILE_STRUCT.find(c => c.variable === key);
                    return {
                        variable: key,
                        type: def?.type || types_1.VarType.string,
                    };
                });
            }
            return v.children;
        })();
        if (!children)
            return false;
        const obj = findExceptVarInObject(isFile ? { ...v, children } : v, filterVar, selector, isFile);
        return (0, exports.hasValidChildren)(obj?.children);
    })
        .map((v) => {
        const isFile = v.type === types_1.VarType.file;
        const { children } = (() => {
            if (isFile) {
                return {
                    children: constants_2.OUTPUT_FILE_SUB_VARIABLES.map((key) => {
                        const def = constants_1.FILE_STRUCT.find(c => c.variable === key);
                        return {
                            variable: key,
                            type: def?.type || types_1.VarType.string,
                        };
                    }),
                };
            }
            return v;
        })();
        if (!children)
            return v;
        return findExceptVarInObject(isFile ? { ...v, children } : v, filterVar, selector, isFile);
    });
    return res;
};
const removeFileVars = (nodeWithVars) => {
    return nodeWithVars
        .map((item) => {
        return {
            ...item,
            vars: item.vars.filter(v => v.type !== types_1.VarType.file && v.type !== types_1.VarType.arrayFile),
        };
    })
        .filter(item => item.vars.length > 0);
};
exports.removeFileVars = removeFileVars;
const toNodeOutputVars = (nodes, isChatMode, filterVar = (_payload, _selector) => true, environmentVariables = [], conversationVariables = [], ragVariables = [], allPluginInfoList, schemaTypeDefinitions) => {
    // ENV_NODE data format
    const ENV_NODE = {
        id: 'env',
        data: {
            title: 'ENVIRONMENT',
            type: 'env',
            envList: environmentVariables,
        },
    };
    // CHAT_VAR_NODE data format
    const CHAT_VAR_NODE = {
        id: 'conversation',
        data: {
            title: 'CONVERSATION',
            type: 'conversation',
            chatVarList: conversationVariables,
        },
    };
    // GLOBAL_VAR_NODE data format
    const GLOBAL_VAR_NODE = {
        id: 'global',
        data: {
            title: 'SYSTEM',
            type: 'global',
            globalVarList: (0, constants_1.getGlobalVars)(isChatMode),
        },
    };
    // RAG_PIPELINE_NODE data format
    const RAG_PIPELINE_NODE = {
        id: 'rag',
        data: {
            title: 'SHARED INPUTS',
            type: 'rag',
            ragVariables: ragVariables.filter(ragVariable => ragVariable.belong_to_node_id === 'shared'),
        },
    };
    // Sort nodes in reverse chronological order (most recent first)
    const sortedNodes = [...nodes].sort((a, b) => {
        if (a.data.type === types_1.BlockEnum.Start)
            return 1;
        if (b.data.type === types_1.BlockEnum.Start)
            return -1;
        if (a.data.type === 'env')
            return 1;
        if (b.data.type === 'env')
            return -1;
        if (a.data.type === 'conversation')
            return 1;
        if (b.data.type === 'conversation')
            return -1;
        if (a.data.type === 'global')
            return 1;
        if (b.data.type === 'global')
            return -1;
        // sort nodes by x position
        return (b.position?.x || 0) - (a.position?.x || 0);
    });
    const res = [
        ...sortedNodes.filter(node => constants_1.SUPPORT_OUTPUT_VARS_NODE.includes(node?.data?.type)),
        ...(environmentVariables.length > 0 ? [ENV_NODE] : []),
        ...(isChatMode && conversationVariables.length > 0 ? [CHAT_VAR_NODE] : []),
        GLOBAL_VAR_NODE,
        ...(RAG_PIPELINE_NODE.data.ragVariables.length > 0
            ? [RAG_PIPELINE_NODE]
            : []),
    ]
        .map((node) => {
        let ragVariablesInDataSource = [];
        if (node.data.type === types_1.BlockEnum.DataSource) {
            ragVariablesInDataSource = ragVariables.filter(ragVariable => ragVariable.belong_to_node_id === node.id);
        }
        return {
            ...formatItem(node, isChatMode, filterVar, allPluginInfoList, ragVariablesInDataSource.map((ragVariable) => {
                return {
                    variable: `rag.${node.id}.${ragVariable.variable}`,
                    type: (0, exports.inputVarTypeToVarType)(ragVariable.type),
                    description: ragVariable.label,
                    isRagVariable: true,
                };
            }), schemaTypeDefinitions),
            isStartNode: node.data.type === types_1.BlockEnum.Start,
        };
    })
        .filter(item => item.vars.length > 0);
    return res;
};
exports.toNodeOutputVars = toNodeOutputVars;
const getIterationItemType = ({ valueSelector, beforeNodesOutputVars, }) => {
    const outputVarNodeId = valueSelector[0];
    const isSystem = (0, exports.isSystemVar)(valueSelector);
    const isChatVar = (0, exports.isConversationVar)(valueSelector);
    const targetVar = isSystem
        ? beforeNodesOutputVars.find(v => v.isStartNode)
        : beforeNodesOutputVars.find(v => v.nodeId === outputVarNodeId);
    if (!targetVar)
        return types_1.VarType.string;
    let arrayType = types_1.VarType.string;
    let curr = targetVar.vars;
    if (isSystem || isChatVar) {
        arrayType = curr.find((v) => v.variable === valueSelector.join('.'))?.type;
    }
    else {
        for (let i = 1; i < valueSelector.length; i++) {
            const key = valueSelector[i];
            const isLast = i === valueSelector.length - 1;
            curr = Array.isArray(curr) ? curr.find(v => v.variable === key) : [];
            if (isLast)
                arrayType = curr?.type;
            else if (curr?.type === types_1.VarType.object || curr?.type === types_1.VarType.file)
                curr = curr.children || [];
        }
    }
    switch (arrayType) {
        case types_1.VarType.arrayString:
            return types_1.VarType.string;
        case types_1.VarType.arrayNumber:
            return types_1.VarType.number;
        case types_1.VarType.arrayBoolean:
            return types_1.VarType.boolean;
        case types_1.VarType.arrayObject:
            return types_1.VarType.object;
        case types_1.VarType.array:
            return types_1.VarType.arrayObject; // Use more specific type instead of any
        case types_1.VarType.arrayFile:
            return types_1.VarType.file;
        default:
            return types_1.VarType.string;
    }
};
const getLoopItemType = ({ valueSelector, beforeNodesOutputVars, }) => {
    const outputVarNodeId = valueSelector[0];
    const isSystem = (0, exports.isSystemVar)(valueSelector);
    const targetVar = isSystem
        ? beforeNodesOutputVars.find(v => v.isStartNode)
        : beforeNodesOutputVars.find(v => v.nodeId === outputVarNodeId);
    if (!targetVar)
        return types_1.VarType.string;
    let arrayType = types_1.VarType.string;
    let curr = targetVar.vars;
    if (isSystem) {
        arrayType = curr.find((v) => v.variable === valueSelector.join('.'))?.type;
    }
    else {
        valueSelector.slice(1).forEach((key, i) => {
            const isLast = i === valueSelector.length - 2;
            curr = curr?.find((v) => v.variable === key);
            if (isLast) {
                arrayType = curr?.type;
            }
            else {
                if (curr?.type === types_1.VarType.object || curr?.type === types_1.VarType.file)
                    curr = curr.children;
            }
        });
    }
    switch (arrayType) {
        case types_1.VarType.arrayString:
            return types_1.VarType.string;
        case types_1.VarType.arrayNumber:
            return types_1.VarType.number;
        case types_1.VarType.arrayObject:
            return types_1.VarType.object;
        case types_1.VarType.arrayBoolean:
            return types_1.VarType.boolean;
        case types_1.VarType.array:
            return types_1.VarType.any;
        case types_1.VarType.arrayFile:
            return types_1.VarType.file;
        default:
            return types_1.VarType.string;
    }
};
const getVarType = ({ parentNode, valueSelector, isIterationItem, isLoopItem, availableNodes, isChatMode, isConstant, environmentVariables = [], conversationVariables = [], ragVariables = [], allPluginInfoList, schemaTypeDefinitions, preferSchemaType, }) => {
    if (isConstant)
        return types_1.VarType.string;
    const beforeNodesOutputVars = (0, exports.toNodeOutputVars)(availableNodes, isChatMode, undefined, environmentVariables, conversationVariables, ragVariables, allPluginInfoList, schemaTypeDefinitions);
    const isIterationInnerVar = parentNode?.data.type === types_1.BlockEnum.Iteration;
    if (isIterationItem) {
        return getIterationItemType({
            valueSelector,
            beforeNodesOutputVars,
        });
    }
    if (isIterationInnerVar) {
        if (valueSelector[1] === 'item') {
            const itemType = getIterationItemType({
                valueSelector: parentNode?.data?.iterator_selector || [],
                beforeNodesOutputVars,
            });
            return itemType;
        }
        if (valueSelector[1] === 'index')
            return types_1.VarType.number;
    }
    const isLoopInnerVar = parentNode?.data.type === types_1.BlockEnum.Loop;
    if (isLoopItem) {
        return getLoopItemType({
            valueSelector,
            beforeNodesOutputVars,
        });
    }
    if (isLoopInnerVar) {
        if (valueSelector[1] === 'item') {
            const itemType = getLoopItemType({
                valueSelector: parentNode?.data?.iterator_selector || [],
                beforeNodesOutputVars,
            });
            return itemType;
        }
        if (valueSelector[1] === 'index')
            return types_1.VarType.number;
    }
    const isGlobal = (0, exports.isGlobalVar)(valueSelector);
    const isInStartNodeSysVar = (0, exports.isSystemVar)(valueSelector) && !isGlobal;
    const isEnv = (0, exports.isENV)(valueSelector);
    const isChatVar = (0, exports.isConversationVar)(valueSelector);
    const isSharedRagVariable = (0, exports.isRagVariableVar)(valueSelector) && valueSelector[1] === 'shared';
    const isInNodeRagVariable = (0, exports.isRagVariableVar)(valueSelector) && valueSelector[1] !== 'shared';
    const startNode = availableNodes.find((node) => {
        return node?.data.type === types_1.BlockEnum.Start;
    });
    const targetVarNodeId = (() => {
        if (isInStartNodeSysVar)
            return startNode?.id;
        if (isGlobal)
            return 'global';
        if (isInNodeRagVariable)
            return valueSelector[1];
        return valueSelector[0];
    })();
    const targetVar = beforeNodesOutputVars.find(v => v.nodeId === targetVarNodeId);
    if (!targetVar)
        return types_1.VarType.string;
    let type = types_1.VarType.string;
    let curr = targetVar.vars;
    if (isInStartNodeSysVar || isEnv || isChatVar || isSharedRagVariable || isGlobal) {
        return curr.find((v) => v.variable === valueSelector.join('.'))?.type;
    }
    else {
        const targetVar = curr.find((v) => {
            if (isInNodeRagVariable)
                return v.variable === valueSelector.join('.');
            return v.variable === valueSelector[1];
        });
        if (!targetVar)
            return types_1.VarType.string;
        if (isInNodeRagVariable)
            return targetVar.type;
        const isStructuredOutputVar = !!targetVar.children?.schema?.properties;
        if (isStructuredOutputVar) {
            if (valueSelector.length === 2) {
                // root
                return preferSchemaType && targetVar.schemaType
                    ? targetVar.schemaType
                    : types_1.VarType.object;
            }
            let currProperties = targetVar.children.schema;
            valueSelector.slice(2).forEach((key, i) => {
                const isLast = i === valueSelector.length - 3;
                if (!currProperties)
                    return;
                currProperties = currProperties.properties[key];
                if (isLast)
                    type = structTypeToVarType(currProperties?.type);
            });
            return type;
        }
        valueSelector.slice(1).forEach((key, i) => {
            const isLast = i === valueSelector.length - 2;
            if (Array.isArray(curr))
                curr = curr?.find((v) => v.variable === key);
            if (isLast) {
                type
                    = preferSchemaType && curr?.schemaType ? curr?.schemaType : curr?.type;
            }
            else {
                if (curr?.type === types_1.VarType.object || curr?.type === types_1.VarType.file)
                    curr = curr.children;
            }
        });
        return type;
    }
};
exports.getVarType = getVarType;
// node output vars + parent inner vars(if in iteration or other wrap node)
const toNodeAvailableVars = ({ parentNode, t, beforeNodes, isChatMode, environmentVariables, conversationVariables, ragVariables, filterVar, allPluginInfoList, schemaTypeDefinitions, }) => {
    const beforeNodesOutputVars = (0, exports.toNodeOutputVars)(beforeNodes, isChatMode, filterVar, environmentVariables, conversationVariables, ragVariables, allPluginInfoList, schemaTypeDefinitions);
    const isInIteration = parentNode?.data.type === types_1.BlockEnum.Iteration;
    if (isInIteration) {
        const iterationNode = parentNode;
        const itemType = (0, exports.getVarType)({
            parentNode: iterationNode,
            isIterationItem: true,
            valueSelector: iterationNode?.data.iterator_selector || [],
            availableNodes: beforeNodes,
            isChatMode,
            environmentVariables,
            conversationVariables,
            allPluginInfoList,
            schemaTypeDefinitions,
        });
        const itemChildren = itemType === types_1.VarType.file
            ? {
                children: constants_2.OUTPUT_FILE_SUB_VARIABLES.map((key) => {
                    return {
                        variable: key,
                        type: key === 'size' ? types_1.VarType.number : types_1.VarType.string,
                    };
                }),
            }
            : {};
        const iterationVar = {
            nodeId: iterationNode?.id,
            title: t('nodes.iteration.currentIteration', { ns: 'workflow' }),
            vars: [
                {
                    variable: 'item',
                    type: itemType,
                    ...itemChildren,
                },
                {
                    variable: 'index',
                    type: types_1.VarType.number,
                },
            ],
        };
        const iterationIndex = beforeNodesOutputVars.findIndex(v => v.nodeId === iterationNode?.id);
        if (iterationIndex > -1)
            beforeNodesOutputVars.splice(iterationIndex, 1);
        beforeNodesOutputVars.unshift(iterationVar);
    }
    return beforeNodesOutputVars;
};
exports.toNodeAvailableVars = toNodeAvailableVars;
const getNodeInfoById = (nodes, id) => {
    if (!(0, compat_1.isArray)(nodes))
        return;
    return nodes.find((node) => node.id === id);
};
exports.getNodeInfoById = getNodeInfoById;
const matchNotSystemVars = (prompts) => {
    if (!prompts)
        return [];
    const allVars = [];
    prompts.forEach((prompt) => {
        config_1.VAR_REGEX.lastIndex = 0;
        if (typeof prompt !== 'string')
            return;
        allVars.push(...(prompt.match(config_1.VAR_REGEX) || []));
    });
    const uniqVars = (0, array_1.uniq)(allVars).map(v => v.replaceAll('{{#', '').replace('#}}', '').split('.'));
    return uniqVars;
};
const replaceOldVarInText = (text, oldVar, newVar) => {
    if (!text || typeof text !== 'string')
        return text;
    if (!newVar || newVar.length === 0)
        return text;
    return text.replaceAll(`{{#${oldVar.join('.')}#}}`, `{{#${newVar.join('.')}#}}`);
};
const getNodeUsedVars = (node) => {
    const { data } = node;
    const { type } = data;
    let res = [];
    switch (type) {
        case types_1.BlockEnum.End: {
            res = data.outputs?.map((output) => {
                return output.value_selector;
            });
            break;
        }
        case types_1.BlockEnum.Answer: {
            res = matchNotSystemVars([data.answer]);
            break;
        }
        case types_1.BlockEnum.LLM: {
            const payload = data;
            const isChatModel = payload.model?.mode === app_1.AppModeEnum.CHAT;
            let prompts = [];
            if (isChatModel) {
                prompts
                    = payload.prompt_template?.map(p => p.text) || [];
                if (payload.memory?.query_prompt_template)
                    prompts.push(payload.memory.query_prompt_template);
            }
            else {
                prompts = [payload.prompt_template.text];
            }
            const inputVars = matchNotSystemVars(prompts);
            const contextVar = data.context?.variable_selector
                ? [data.context?.variable_selector]
                : [];
            res = [...inputVars, ...contextVar];
            break;
        }
        case types_1.BlockEnum.KnowledgeRetrieval: {
            const { query_variable_selector, query_attachment_selector = [], } = data;
            res = [query_variable_selector, query_attachment_selector];
            break;
        }
        case types_1.BlockEnum.IfElse: {
            res = [];
            res.push(...(data.cases || [])
                .flatMap(c => c.conditions || [])
                .flatMap((c) => {
                const selectors = [];
                if (c.variable_selector)
                    selectors.push(c.variable_selector);
                // Handle sub-variable conditions
                if (c.sub_variable_condition && c.sub_variable_condition.conditions) {
                    selectors.push(...c.sub_variable_condition.conditions
                        .map(subC => subC.variable_selector || [])
                        .filter(sel => sel.length > 0));
                }
                return selectors;
            }));
            break;
        }
        case types_1.BlockEnum.Code: {
            res = data.variables?.map((v) => {
                return v.value_selector;
            });
            break;
        }
        case types_1.BlockEnum.TemplateTransform: {
            res = data.variables?.map((v) => {
                return v.value_selector;
            });
            break;
        }
        case types_1.BlockEnum.QuestionClassifier: {
            const payload = data;
            res = [payload.query_variable_selector];
            const varInInstructions = matchNotSystemVars([payload.instruction || '']);
            res.push(...varInInstructions);
            const classes = payload.classes.map(c => c.name);
            res.push(...matchNotSystemVars(classes));
            break;
        }
        case types_1.BlockEnum.HttpRequest: {
            const payload = data;
            res = matchNotSystemVars([
                payload.url,
                payload.headers,
                payload.params,
                typeof payload.body.data === 'string'
                    ? payload.body.data
                    : payload.body.data.map(d => d.value).join(''),
            ]);
            break;
        }
        case types_1.BlockEnum.Tool: {
            const payload = data;
            const mixVars = matchNotSystemVars(Object.keys(payload.tool_parameters)
                ?.filter(key => payload.tool_parameters[key].type === types_3.VarType.mixed)
                .map(key => payload.tool_parameters[key].value));
            const vars = Object.keys(payload.tool_parameters)
                .filter(key => payload.tool_parameters[key].type === types_3.VarType.variable)
                .map(key => payload.tool_parameters[key].value) || [];
            res = [...mixVars, ...vars];
            break;
        }
        case types_1.BlockEnum.DataSource: {
            const payload = data;
            const mixVars = matchNotSystemVars(Object.keys(payload.datasource_parameters)
                ?.filter(key => payload.datasource_parameters[key].type === types_3.VarType.mixed)
                .map(key => payload.datasource_parameters[key].value));
            const vars = Object.keys(payload.datasource_parameters)
                .filter(key => payload.datasource_parameters[key].type === types_3.VarType.variable)
                .map(key => payload.datasource_parameters[key].value)
                || [];
            res = [...mixVars, ...vars];
            break;
        }
        case types_1.BlockEnum.VariableAssigner: {
            res = data?.variables;
            break;
        }
        case types_1.BlockEnum.VariableAggregator: {
            res = data?.variables;
            break;
        }
        case types_1.BlockEnum.ParameterExtractor: {
            const payload = data;
            res = [payload.query];
            const varInInstructions = matchNotSystemVars([payload.instruction || '']);
            res.push(...varInInstructions);
            break;
        }
        case types_1.BlockEnum.Iteration: {
            res = [data.iterator_selector];
            break;
        }
        case types_1.BlockEnum.Loop: {
            const payload = data;
            res
                = payload.break_conditions?.map((c) => {
                    return c.variable_selector || [];
                }) || [];
            break;
        }
        case types_1.BlockEnum.ListFilter: {
            res = [data.variable];
            break;
        }
        case types_1.BlockEnum.Agent: {
            const payload = data;
            const valueSelectors = [];
            if (!payload.agent_parameters)
                break;
            Object.keys(payload.agent_parameters || {}).forEach((key) => {
                const { value } = payload.agent_parameters[key];
                if (typeof value === 'string')
                    valueSelectors.push(...matchNotSystemVars([value]));
            });
            res = valueSelectors;
            break;
        }
    }
    return res || [];
};
exports.getNodeUsedVars = getNodeUsedVars;
// can be used in iteration node
const getNodeUsedVarPassToServerKey = (node, valueSelector) => {
    const { data } = node;
    const { type } = data;
    let res = '';
    switch (type) {
        case types_1.BlockEnum.LLM: {
            const payload = data;
            res = [`#${valueSelector.join('.')}#`];
            if (payload.context?.variable_selector.join('.') === valueSelector.join('.'))
                res.push('#context#');
            break;
        }
        case types_1.BlockEnum.KnowledgeRetrieval: {
            res = 'query';
            break;
        }
        case types_1.BlockEnum.IfElse: {
            const findConditionInCases = (cases) => {
                for (const caseItem of cases) {
                    for (const condition of caseItem.conditions || []) {
                        if (condition.variable_selector?.join('.') === valueSelector.join('.'))
                            return condition;
                        if (condition.sub_variable_condition) {
                            const found = findConditionInCases([condition.sub_variable_condition]);
                            if (found)
                                return found;
                        }
                    }
                }
                return undefined;
            };
            const targetVar = findConditionInCases(data.cases || []);
            if (targetVar)
                res = `#${valueSelector.join('.')}#`;
            break;
        }
        case types_1.BlockEnum.Code: {
            const targetVar = data.variables?.find(v => Array.isArray(v.value_selector)
                && v.value_selector
                && v.value_selector.join('.') === valueSelector.join('.'));
            if (targetVar)
                res = targetVar.variable;
            break;
        }
        case types_1.BlockEnum.TemplateTransform: {
            const targetVar = data.variables?.find(v => Array.isArray(v.value_selector)
                && v.value_selector
                && v.value_selector.join('.') === valueSelector.join('.'));
            if (targetVar)
                res = targetVar.variable;
            break;
        }
        case types_1.BlockEnum.QuestionClassifier: {
            res = 'query';
            break;
        }
        case types_1.BlockEnum.HttpRequest: {
            res = `#${valueSelector.join('.')}#`;
            break;
        }
        case types_1.BlockEnum.Tool: {
            res = `#${valueSelector.join('.')}#`;
            break;
        }
        case types_1.BlockEnum.VariableAssigner: {
            res = `#${valueSelector.join('.')}#`;
            break;
        }
        case types_1.BlockEnum.VariableAggregator: {
            res = `#${valueSelector.join('.')}#`;
            break;
        }
        case types_1.BlockEnum.ParameterExtractor: {
            res = 'query';
            break;
        }
    }
    return res;
};
exports.getNodeUsedVarPassToServerKey = getNodeUsedVarPassToServerKey;
const findUsedVarNodes = (varSelector, availableNodes) => {
    const res = [];
    availableNodes.forEach((node) => {
        const vars = (0, exports.getNodeUsedVars)(node);
        if (vars.find(v => v.join('.') === varSelector.join('.')))
            res.push(node);
    });
    return res;
};
exports.findUsedVarNodes = findUsedVarNodes;
const updateNodeVars = (oldNode, oldVarSelector, newVarSelector) => {
    const newNode = (0, immer_1.produce)(oldNode, (draft) => {
        const { data } = draft;
        const { type } = data;
        switch (type) {
            case types_1.BlockEnum.End: {
                const payload = data;
                if (payload.outputs) {
                    payload.outputs = payload.outputs.map((output) => {
                        if (output.value_selector.join('.') === oldVarSelector.join('.'))
                            output.value_selector = newVarSelector;
                        return output;
                    });
                }
                break;
            }
            case types_1.BlockEnum.Answer: {
                const payload = data;
                if (payload.variables) {
                    payload.variables = payload.variables.map((v) => {
                        if (v.value_selector.join('.') === oldVarSelector.join('.'))
                            v.value_selector = newVarSelector;
                        return v;
                    });
                }
                break;
            }
            case types_1.BlockEnum.LLM: {
                const payload = data;
                const isChatModel = payload.model?.mode === app_1.AppModeEnum.CHAT;
                if (isChatModel) {
                    payload.prompt_template = payload.prompt_template.map((prompt) => {
                        return {
                            ...prompt,
                            text: replaceOldVarInText(prompt.text, oldVarSelector, newVarSelector),
                        };
                    });
                    if (payload.memory?.query_prompt_template) {
                        payload.memory.query_prompt_template = replaceOldVarInText(payload.memory.query_prompt_template, oldVarSelector, newVarSelector);
                    }
                }
                else {
                    payload.prompt_template = {
                        ...payload.prompt_template,
                        text: replaceOldVarInText(payload.prompt_template.text, oldVarSelector, newVarSelector),
                    };
                }
                if (payload.context?.variable_selector?.join('.')
                    === oldVarSelector.join('.')) {
                    payload.context.variable_selector = newVarSelector;
                }
                break;
            }
            case types_1.BlockEnum.KnowledgeRetrieval: {
                const payload = data;
                if (payload.query_variable_selector.join('.') === oldVarSelector.join('.'))
                    payload.query_variable_selector = newVarSelector;
                if (payload.query_attachment_selector?.join('.') === oldVarSelector.join('.'))
                    payload.query_attachment_selector = newVarSelector;
                break;
            }
            case types_1.BlockEnum.IfElse: {
                const payload = data;
                if (payload.cases) {
                    payload.cases = payload.cases.map((caseItem) => {
                        if (caseItem.conditions) {
                            caseItem.conditions = caseItem.conditions.map((c) => {
                                if (c.variable_selector?.join('.') === oldVarSelector.join('.'))
                                    c.variable_selector = newVarSelector;
                                // Handle sub-variable conditions
                                if (c.sub_variable_condition
                                    && c.sub_variable_condition.conditions) {
                                    c.sub_variable_condition.conditions
                                        = c.sub_variable_condition.conditions.map((subC) => {
                                            if (subC.variable_selector?.join('.')
                                                === oldVarSelector.join('.')) {
                                                subC.variable_selector = newVarSelector;
                                            }
                                            return subC;
                                        });
                                }
                                return c;
                            });
                        }
                        return caseItem;
                    });
                }
                break;
            }
            case types_1.BlockEnum.Code: {
                const payload = data;
                if (payload.variables) {
                    payload.variables = payload.variables.map((v) => {
                        if (v.value_selector.join('.') === oldVarSelector.join('.'))
                            v.value_selector = newVarSelector;
                        return v;
                    });
                }
                break;
            }
            case types_1.BlockEnum.TemplateTransform: {
                const payload = data;
                if (payload.variables) {
                    payload.variables = payload.variables.map((v) => {
                        if (v.value_selector.join('.') === oldVarSelector.join('.'))
                            v.value_selector = newVarSelector;
                        return v;
                    });
                }
                break;
            }
            case types_1.BlockEnum.QuestionClassifier: {
                const payload = data;
                if (payload.query_variable_selector.join('.') === oldVarSelector.join('.'))
                    payload.query_variable_selector = newVarSelector;
                payload.instruction = replaceOldVarInText(payload.instruction, oldVarSelector, newVarSelector);
                break;
            }
            case types_1.BlockEnum.HttpRequest: {
                const payload = data;
                payload.url = replaceOldVarInText(payload.url, oldVarSelector, newVarSelector);
                payload.headers = replaceOldVarInText(payload.headers, oldVarSelector, newVarSelector);
                payload.params = replaceOldVarInText(payload.params, oldVarSelector, newVarSelector);
                if (typeof payload.body.data === 'string') {
                    payload.body.data = replaceOldVarInText(payload.body.data, oldVarSelector, newVarSelector);
                }
                else {
                    payload.body.data = payload.body.data.map((d) => {
                        return {
                            ...d,
                            value: replaceOldVarInText(d.value || '', oldVarSelector, newVarSelector),
                        };
                    });
                }
                break;
            }
            case types_1.BlockEnum.Tool: {
                const payload = data;
                const hasShouldRenameVar = Object.keys(payload.tool_parameters)?.filter(key => payload.tool_parameters[key].type !== types_3.VarType.constant);
                if (hasShouldRenameVar) {
                    Object.keys(payload.tool_parameters).forEach((key) => {
                        const value = payload.tool_parameters[key];
                        const { type } = value;
                        if (type === types_3.VarType.variable
                            && value.value.join('.') === oldVarSelector.join('.')) {
                            payload.tool_parameters[key] = {
                                ...value,
                                value: newVarSelector,
                            };
                        }
                        if (type === types_3.VarType.mixed) {
                            payload.tool_parameters[key] = {
                                ...value,
                                value: replaceOldVarInText(payload.tool_parameters[key].value, oldVarSelector, newVarSelector),
                            };
                        }
                    });
                }
                break;
            }
            case types_1.BlockEnum.DataSource: {
                const payload = data;
                const hasShouldRenameVar = Object.keys(payload.datasource_parameters)?.filter(key => payload.datasource_parameters[key].type !== types_3.VarType.constant);
                if (hasShouldRenameVar) {
                    Object.keys(payload.datasource_parameters).forEach((key) => {
                        const value = payload.datasource_parameters[key];
                        const { type } = value;
                        if (type === types_3.VarType.variable
                            && value.value.join('.') === oldVarSelector.join('.')) {
                            payload.datasource_parameters[key] = {
                                ...value,
                                value: newVarSelector,
                            };
                        }
                        if (type === types_3.VarType.mixed) {
                            payload.datasource_parameters[key] = {
                                ...value,
                                value: replaceOldVarInText(payload.datasource_parameters[key].value, oldVarSelector, newVarSelector),
                            };
                        }
                    });
                }
                break;
            }
            case types_1.BlockEnum.VariableAssigner: {
                const payload = data;
                if (payload.variables) {
                    payload.variables = payload.variables.map((v) => {
                        if (v.join('.') === oldVarSelector.join('.'))
                            v = newVarSelector;
                        return v;
                    });
                }
                break;
            }
            // eslint-disable-next-line sonarjs/no-duplicated-branches
            case types_1.BlockEnum.VariableAggregator: {
                const payload = data;
                if (payload.variables) {
                    payload.variables = payload.variables.map((v) => {
                        if (v.join('.') === oldVarSelector.join('.'))
                            v = newVarSelector;
                        return v;
                    });
                }
                break;
            }
            case types_1.BlockEnum.ParameterExtractor: {
                const payload = data;
                if (payload.query.join('.') === oldVarSelector.join('.'))
                    payload.query = newVarSelector;
                payload.instruction = replaceOldVarInText(payload.instruction, oldVarSelector, newVarSelector);
                break;
            }
            case types_1.BlockEnum.Iteration: {
                const payload = data;
                if (payload.iterator_selector.join('.') === oldVarSelector.join('.'))
                    payload.iterator_selector = newVarSelector;
                break;
            }
            case types_1.BlockEnum.Loop: {
                const payload = data;
                if (payload.break_conditions) {
                    payload.break_conditions = payload.break_conditions.map((c) => {
                        if (c.variable_selector?.join('.') === oldVarSelector.join('.'))
                            c.variable_selector = newVarSelector;
                        return c;
                    });
                }
                break;
            }
            case types_1.BlockEnum.ListFilter: {
                const payload = data;
                if (payload.variable.join('.') === oldVarSelector.join('.'))
                    payload.variable = newVarSelector;
                break;
            }
        }
    });
    return newNode;
};
exports.updateNodeVars = updateNodeVars;
const varToValueSelectorList = (v, parentValueSelector, res) => {
    if (!v.variable)
        return;
    res.push([...parentValueSelector, v.variable]);
    const isStructuredOutput = !!v.children?.schema?.properties;
    if (v.children?.length > 0) {
        v.children.forEach((child) => {
            varToValueSelectorList(child, [...parentValueSelector, v.variable], res);
        });
    }
    if (isStructuredOutput) {
        Object.keys(v.children?.schema?.properties || {}).forEach((key) => {
            const type = v.children?.schema?.properties[key].type;
            const isArray = type === types_2.Type.array;
            const arrayType = v.children?.schema?.properties[key].items?.type;
            varToValueSelectorList({
                variable: key,
                type: structTypeToVarType(isArray ? arrayType : type, isArray),
            }, [...parentValueSelector, v.variable], res);
        });
    }
};
const varsToValueSelectorList = (vars, parentValueSelector, res) => {
    if (Array.isArray(vars)) {
        vars.forEach((v) => {
            varToValueSelectorList(v, parentValueSelector, res);
        });
    }
    varToValueSelectorList(vars, parentValueSelector, res);
};
const getNodeOutputVars = (node, isChatMode) => {
    const { data, id } = node;
    const { type } = data;
    let res = [];
    switch (type) {
        case types_1.BlockEnum.Start: {
            const { variables } = data;
            res = variables.map((v) => {
                return [id, v.variable];
            });
            if (isChatMode) {
                res.push([id, 'sys', 'query']);
                res.push([id, 'sys', 'files']);
            }
            break;
        }
        case types_1.BlockEnum.LLM: {
            const vars = [...constants_1.LLM_OUTPUT_STRUCT];
            const llmNodeData = data;
            if (llmNodeData.structured_output_enabled
                && llmNodeData.structured_output?.schema?.properties
                && Object.keys(llmNodeData.structured_output.schema.properties).length > 0) {
                vars.push({
                    variable: 'structured_output',
                    type: types_1.VarType.object,
                    children: llmNodeData.structured_output,
                });
            }
            varsToValueSelectorList(vars, [id], res);
            break;
        }
        case types_1.BlockEnum.KnowledgeRetrieval: {
            varsToValueSelectorList(constants_1.KNOWLEDGE_RETRIEVAL_OUTPUT_STRUCT, [id], res);
            break;
        }
        case types_1.BlockEnum.Code: {
            const { outputs } = data;
            Object.keys(outputs).forEach((key) => {
                res.push([id, key]);
            });
            break;
        }
        case types_1.BlockEnum.TemplateTransform: {
            varsToValueSelectorList(constants_1.TEMPLATE_TRANSFORM_OUTPUT_STRUCT, [id], res);
            break;
        }
        case types_1.BlockEnum.QuestionClassifier: {
            varsToValueSelectorList(constants_1.QUESTION_CLASSIFIER_OUTPUT_STRUCT, [id], res);
            break;
        }
        case types_1.BlockEnum.HttpRequest: {
            varsToValueSelectorList(constants_1.HTTP_REQUEST_OUTPUT_STRUCT, [id], res);
            break;
        }
        case types_1.BlockEnum.VariableAssigner: {
            res.push([id, 'output']);
            break;
        }
        case types_1.BlockEnum.VariableAggregator: {
            res.push([id, 'output']);
            break;
        }
        case types_1.BlockEnum.Tool: {
            varsToValueSelectorList(constants_1.TOOL_OUTPUT_STRUCT, [id], res);
            break;
        }
        case types_1.BlockEnum.ParameterExtractor: {
            const { parameters } = data;
            if (parameters?.length > 0) {
                parameters.forEach((p) => {
                    res.push([id, p.name]);
                });
            }
            break;
        }
        case types_1.BlockEnum.Iteration: {
            res.push([id, 'output']);
            break;
        }
        case types_1.BlockEnum.Loop: {
            res.push([id, 'output']);
            break;
        }
        case types_1.BlockEnum.DocExtractor: {
            res.push([id, 'text']);
            break;
        }
        case types_1.BlockEnum.ListFilter: {
            res.push([id, 'result']);
            res.push([id, 'first_record']);
            res.push([id, 'last_record']);
            break;
        }
    }
    return res;
};
exports.getNodeOutputVars = getNodeOutputVars;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFtQ0EsNENBQXVDO0FBQ3ZDLDhDQUEyQztBQUMzQyxpQ0FBK0I7QUFDL0IsbUVBWTRDO0FBQzVDLGlGQUF1RjtBQUN2RiwwRUFBMEU7QUFDMUUsb0ZBQTZGO0FBQzdGLDJEQUl3QztBQUN4QyxxQ0FBb0M7QUFDcEMscUNBQXlDO0FBQ3pDLGtEQUE4RDtBQUM5RCw4Q0FHMkI7QUFDM0IsK0NBQTREO0FBRXJELE1BQU0sV0FBVyxHQUFHLENBQUMsYUFBNEIsRUFBRSxFQUFFO0lBQzFELE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFBO0FBQ2pFLENBQUMsQ0FBQTtBQUZZLFFBQUEsV0FBVyxlQUV2QjtBQUVNLE1BQU0sV0FBVyxHQUFHLENBQUMsYUFBNEIsRUFBRSxFQUFFO0lBQzFELElBQUksQ0FBQyxJQUFBLG1CQUFXLEVBQUMsYUFBYSxDQUFDO1FBQzdCLE9BQU8sS0FBSyxDQUFBO0lBQ2QsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRS9CLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNyQyxPQUFPLEtBQUssQ0FBQTtJQUNkLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBUlksUUFBQSxXQUFXLGVBUXZCO0FBRU0sTUFBTSxLQUFLLEdBQUcsQ0FBQyxhQUE0QixFQUFFLEVBQUU7SUFDcEQsT0FBTyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFBO0FBQ25DLENBQUMsQ0FBQTtBQUZZLFFBQUEsS0FBSyxTQUVqQjtBQUVNLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxhQUE0QixFQUFFLEVBQUU7SUFDaEUsT0FBTyxhQUFhLENBQUMs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QyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtZQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7WUFDN0IsTUFBSztRQUNQLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDLENBQUE7QUF0SFksUUFBQSxpQkFBaUIscUJBc0g3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQWdlbnROb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2FnZW50L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBBbnN3ZXJOb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2Fuc3dlci90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29kZU5vZGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vY29kZS90eXBlcydcbmltcG9ydCB0eXBlIHsgRG9jRXh0cmFjdG9yTm9kZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9kb2N1bWVudC1leHRyYWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEVuZE5vZGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vZW5kL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBIdHRwTm9kZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9odHRwL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJZkVsc2VOb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2lmLWVsc2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEl0ZXJhdGlvbk5vZGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vaXRlcmF0aW9uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBLbm93bGVkZ2VSZXRyaWV2YWxOb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2tub3dsZWRnZS1yZXRyaWV2YWwvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExpc3RGaWx0ZXJOb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2xpc3Qtb3BlcmF0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExMTU5vZGVUeXBlLCBTdHJ1Y3R1cmVkT3V0cHV0IH0gZnJvbSAnLi4vLi4vLi4vbGxtL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBMb29wTm9kZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9sb29wL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQYXJhbWV0ZXJFeHRyYWN0b3JOb2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3BhcmFtZXRlci1leHRyYWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFF1ZXN0aW9uQ2xhc3NpZmllck5vZGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vcXVlc3Rpb24tY2xhc3NpZmllci90eXBlcydcbmltcG9ydCB0eXBlIHsgVGVtcGxhdGVUcmFuc2Zvcm1Ob2RlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3RlbXBsYXRlLXRyYW5zZm9ybS90eXBlcydcbmltcG9ydCB0eXBlIHsgVG9vbE5vZGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdG9vbC90eXBlcydcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZU5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kYXRhLXNvdXJjZS90eXBlcydcbmltcG9ydCB0eXBlIHsgQ2FzZUl0ZW0sIENvbmRpdGlvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvaWYtZWxzZS90eXBlcydcbmltcG9ydCB0eXBlIHsgRmllbGQgYXMgU3RydWN0RmllbGQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2xsbS90eXBlcydcbmltcG9ydCB0eXBlIHsgU3RhcnROb2RlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvc3RhcnQvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFBsdWdpblRyaWdnZXJOb2RlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvdHJpZ2dlci1wbHVnaW4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFdlYmhvb2tUcmlnZ2VyTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3RyaWdnZXItd2ViaG9vay90eXBlcydcbmltcG9ydCB0eXBlIHsgVmFyaWFibGVBc3NpZ25lck5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy92YXJpYWJsZS1hc3NpZ25lci90eXBlcydcbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uVmFyaWFibGUsXG4gIEVudmlyb25tZW50VmFyaWFibGUsXG4gIE5vZGUsXG4gIE5vZGVPdXRQdXRWYXIsXG4gIFRvb2xXaXRoUHJvdmlkZXIsXG4gIFZhbHVlU2VsZWN0b3IsXG4gIFZhcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB0eXBlIHsgUHJvbXB0SXRlbSB9IGZyb20gJ0AvbW9kZWxzL2RlYnVnJ1xuaW1wb3J0IHR5cGUgeyBSQUdQaXBlbGluZVZhcmlhYmxlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgdHlwZSB7IFNjaGVtYVR5cGVEZWZpbml0aW9uIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyB1bmlxIH0gZnJvbSAnZXMtdG9vbGtpdC9hcnJheSdcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICdlcy10b29sa2l0L2NvbXBhdCdcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7XG4gIEFHRU5UX09VVFBVVF9TVFJVQ1QsXG4gIEZJTEVfU1RSVUNULFxuICBnZXRHbG9iYWxWYXJzLFxuICBIVFRQX1JFUVVFU1RfT1VUUFVUX1NUUlVDVCxcbiAgS05PV0xFREdFX1JFVFJJRVZBTF9PVVRQVVRfU1RSVUNULFxuICBMTE1fT1VUUFVUX1NUUlVDVCxcbiAgUEFSQU1FVEVSX0VYVFJBQ1RPUl9DT01NT05fU1RSVUNULFxuICBRVUVTVElPTl9DTEFTU0lGSUVSX09VVFBVVF9TVFJVQ1QsXG4gIFNVUFBPUlRfT1VUUFVUX1ZBUlNfTk9ERSxcbiAgVEVNUExBVEVfVFJBTlNGT1JNX09VVFBVVF9TVFJVQ1QsXG4gIFRPT0xfT1VUUFVUX1NUUlVDVCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9jb25zdGFudHMnXG5pbXBvcnQgRGF0YVNvdXJjZU5vZGVEZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvZGF0YS1zb3VyY2UvZGVmYXVsdCdcbmltcG9ydCBUb29sTm9kZURlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy90b29sL2RlZmF1bHQnXG5pbXBvcnQgUGx1Z2luVHJpZ2dlck5vZGVEZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvdHJpZ2dlci1wbHVnaW4vZGVmYXVsdCdcbmltcG9ydCB7XG4gIEJsb2NrRW51bSxcbiAgSW5wdXRWYXJUeXBlLFxuICBWYXJUeXBlLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgVkFSX1JFR0VYIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgT1VUUFVUX0ZJTEVfU1VCX1ZBUklBQkxFUyB9IGZyb20gJy4uLy4uLy4uL2NvbnN0YW50cydcbmltcG9ydCB7XG5cbiAgVHlwZSxcbn0gZnJvbSAnLi4vLi4vLi4vbGxtL3R5cGVzJ1xuaW1wb3J0IHsgVmFyVHlwZSBhcyBUb29sVmFyVHlwZSB9IGZyb20gJy4uLy4uLy4uL3Rvb2wvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBpc1N5c3RlbVZhciA9ICh2YWx1ZVNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yKSA9PiB7XG4gIHJldHVybiB2YWx1ZVNlbGVjdG9yWzBdID09PSAnc3lzJyB8fCB2YWx1ZVNlbGVjdG9yWzFdID09PSAnc3lzJ1xufVxuXG5leHBvcnQgY29uc3QgaXNHbG9iYWxWYXIgPSAodmFsdWVTZWxlY3RvcjogVmFsdWVTZWxlY3RvcikgPT4ge1xuICBpZiAoIWlzU3lzdGVtVmFyKHZhbHVlU2VsZWN0b3IpKVxuICAgIHJldHVybiBmYWxzZVxuICBjb25zdCBzZWNvbmQgPSB2YWx1ZVNlbGVjdG9yWzFdXG5cbiAgaWYgKFsncXVlcnknLCAnZmlsZXMnXS5pbmNsdWRlcyhzZWNvbmQpKVxuICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgY29uc3QgaXNFTlYgPSAodmFsdWVTZWxlY3RvcjogVmFsdWVTZWxlY3RvcikgPT4ge1xuICByZXR1cm4gdmFsdWVTZWxlY3RvclswXSA9PT0gJ2Vudidcbn1cblxuZXhwb3J0IGNvbnN0IGlzQ29udmVyc2F0aW9uVmFyID0gKHZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IHtcbiAgcmV0dXJuIHZhbHVlU2VsZWN0b3JbMF0gPT09ICdjb252ZXJzYXRpb24nXG59XG5cbmV4cG9ydCBjb25zdCBpc1JhZ1ZhcmlhYmxlVmFyID0gKHZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IHtcbiAgaWYgKCF2YWx1ZVNlbGVjdG9yKVxuICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gdmFsdWVTZWxlY3RvclswXSA9PT0gJ3JhZydcbn1cblxuZXhwb3J0IGNvbnN0IGlzU3BlY2lhbFZhciA9IChwcmVmaXg6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gWydzeXMnLCAnZW52JywgJ2NvbnZlcnNhdGlvbicsICdyYWcnXS5pbmNsdWRlcyhwcmVmaXgpXG59XG5cbmV4cG9ydCBjb25zdCBoYXNWYWxpZENoaWxkcmVuID0gKGNoaWxkcmVuOiBhbnkpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIChcbiAgICBjaGlsZHJlblxuICAgICYmICgoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMClcbiAgICAgIHx8ICghQXJyYXkuaXNBcnJheShjaGlsZHJlbilcbiAgICAgICAgJiYgT2JqZWN0LmtleXMoKGNoaWxkcmVuIGFzIFN0cnVjdHVyZWRPdXRwdXQpPy5zY2hlbWE/LnByb3BlcnRpZXMgfHwge30pXG4gICAgICAgICAgLmxlbmd0aCA+IDApKVxuICApXG59XG5cbmV4cG9ydCBjb25zdCBpbnB1dFZhclR5cGVUb1ZhclR5cGUgPSAodHlwZTogSW5wdXRWYXJUeXBlKTogVmFyVHlwZSA9PiB7XG4gIHJldHVybiAoXG4gICAgKFxuICAgICAge1xuICAgICAgICBbSW5wdXRWYXJUeXBlLm51bWJlcl06IFZhclR5cGUubnVtYmVyLFxuICAgICAgICBbSW5wdXRWYXJUeXBlLmNoZWNrYm94XTogVmFyVHlwZS5ib29sZWFuLFxuICAgICAgICBbSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGVdOiBWYXJUeXBlLmZpbGUsXG4gICAgICAgIFtJbnB1dFZhclR5cGUubXVsdGlGaWxlc106IFZhclR5cGUuYXJyYXlGaWxlLFxuICAgICAgICBbSW5wdXRWYXJUeXBlLmpzb25PYmplY3RdOiBWYXJUeXBlLm9iamVjdCxcbiAgICAgIH0gYXMgYW55XG4gICAgKVt0eXBlXSB8fCBWYXJUeXBlLnN0cmluZ1xuICApXG59XG5cbmNvbnN0IHN0cnVjdFR5cGVUb1ZhclR5cGUgPSAodHlwZTogVHlwZSwgaXNBcnJheT86IGJvb2xlYW4pOiBWYXJUeXBlID0+IHtcbiAgaWYgKGlzQXJyYXkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgKFxuICAgICAgICB7XG4gICAgICAgICAgW1R5cGUuc3RyaW5nXTogVmFyVHlwZS5hcnJheVN0cmluZyxcbiAgICAgICAgICBbVHlwZS5udW1iZXJdOiBWYXJUeXBlLmFycmF5TnVtYmVyLFxuICAgICAgICAgIFtUeXBlLm9iamVjdF06IFZhclR5cGUuYXJyYXlPYmplY3QsXG4gICAgICAgIH0gYXMgYW55XG4gICAgICApW3R5cGVdIHx8IFZhclR5cGUuc3RyaW5nXG4gICAgKVxuICB9XG4gIHJldHVybiAoXG4gICAgKFxuICAgICAge1xuICAgICAgICBbVHlwZS5zdHJpbmddOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgW1R5cGUubnVtYmVyXTogVmFyVHlwZS5udW1iZXIsXG4gICAgICAgIFtUeXBlLmJvb2xlYW5dOiBWYXJUeXBlLmJvb2xlYW4sXG4gICAgICAgIFtUeXBlLm9iamVjdF06IFZhclR5cGUub2JqZWN0LFxuICAgICAgICBbVHlwZS5hcnJheV06IFZhclR5cGUuYXJyYXksXG4gICAgICB9IGFzIGFueVxuICAgIClbdHlwZV0gfHwgVmFyVHlwZS5zdHJpbmdcbiAgKVxufVxuXG5leHBvcnQgY29uc3QgdmFyVHlwZVRvU3RydWN0VHlwZSA9ICh0eXBlOiBWYXJUeXBlKTogVHlwZSA9PiB7XG4gIHJldHVybiAoXG4gICAgKFxuICAgICAge1xuICAgICAgICBbVmFyVHlwZS5zdHJpbmddOiBUeXBlLnN0cmluZyxcbiAgICAgICAgW1ZhclR5cGUubnVtYmVyXTogVHlwZS5udW1iZXIsXG4gICAgICAgIFtWYXJUeXBlLmJvb2xlYW5dOiBUeXBlLmJvb2xlYW4sXG4gICAgICAgIFtWYXJUeXBlLm9iamVjdF06IFR5cGUub2JqZWN0LFxuICAgICAgICBbVmFyVHlwZS5hcnJheV06IFR5cGUuYXJyYXksXG4gICAgICAgIFtWYXJUeXBlLmFycmF5U3RyaW5nXTogVHlwZS5hcnJheSxcbiAgICAgICAgW1ZhclR5cGUuYXJyYXlOdW1iZXJdOiBUeXBlLmFycmF5LFxuICAgICAgICBbVmFyVHlwZS5hcnJheU9iamVjdF06IFR5cGUuYXJyYXksXG4gICAgICAgIFtWYXJUeXBlLmFycmF5RmlsZV06IFR5cGUuYXJyYXksXG4gICAgICB9IGFzIGFueVxuICAgIClbdHlwZV0gfHwgVHlwZS5zdHJpbmdcbiAgKVxufVxuXG5jb25zdCBmaW5kRXhjZXB0VmFySW5TdHJ1Y3R1cmVkUHJvcGVydGllcyA9IChcbiAgcHJvcGVydGllczogUmVjb3JkPHN0cmluZywgU3RydWN0RmllbGQ+LFxuICBmaWx0ZXJWYXI6IChwYXlsb2FkOiBWYXIsIHNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yKSA9PiBib29sZWFuLFxuKTogUmVjb3JkPHN0cmluZywgU3RydWN0RmllbGQ+ID0+IHtcbiAgY29uc3QgcmVzID0gcHJvZHVjZShwcm9wZXJ0aWVzLCAoZHJhZnQpID0+IHtcbiAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBwcm9wZXJ0aWVzW2tleV1cbiAgICAgIGNvbnN0IGlzT2JqID0gaXRlbS50eXBlID09PSBUeXBlLm9iamVjdFxuICAgICAgY29uc3QgaXNBcnJheSA9IGl0ZW0udHlwZSA9PT0gVHlwZS5hcnJheVxuICAgICAgY29uc3QgYXJyYXlUeXBlID0gaXRlbS5pdGVtcz8udHlwZVxuXG4gICAgICBpZiAoXG4gICAgICAgICFpc09ialxuICAgICAgICAmJiAhZmlsdGVyVmFyKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiBrZXksXG4gICAgICAgICAgICB0eXBlOiBzdHJ1Y3RUeXBlVG9WYXJUeXBlKFxuICAgICAgICAgICAgICBpc0FycmF5ID8gYXJyYXlUeXBlISA6IGl0ZW0udHlwZSxcbiAgICAgICAgICAgICAgaXNBcnJheSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBba2V5XSxcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIGRlbGV0ZSBwcm9wZXJ0aWVzW2tleV1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoaXRlbS50eXBlID09PSBUeXBlLm9iamVjdCAmJiBpdGVtLnByb3BlcnRpZXMpIHtcbiAgICAgICAgaXRlbS5wcm9wZXJ0aWVzID0gZmluZEV4Y2VwdFZhckluU3RydWN0dXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgaXRlbS5wcm9wZXJ0aWVzLFxuICAgICAgICAgIGZpbHRlclZhcixcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGRyYWZ0XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuY29uc3QgZmluZEV4Y2VwdFZhckluU3RydWN0dXJlZE91dHB1dCA9IChcbiAgc3RydWN0dXJlZE91dHB1dDogU3RydWN0dXJlZE91dHB1dCxcbiAgZmlsdGVyVmFyOiAocGF5bG9hZDogVmFyLCBzZWxlY3RvcjogVmFsdWVTZWxlY3RvcikgPT4gYm9vbGVhbixcbik6IFN0cnVjdHVyZWRPdXRwdXQgPT4ge1xuICBjb25zdCByZXMgPSBwcm9kdWNlKHN0cnVjdHVyZWRPdXRwdXQsIChkcmFmdCkgPT4ge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBkcmFmdC5zY2hlbWEucHJvcGVydGllc1xuICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHByb3BlcnRpZXNba2V5XVxuICAgICAgY29uc3QgaXNPYmogPSBpdGVtLnR5cGUgPT09IFR5cGUub2JqZWN0XG4gICAgICBjb25zdCBpc0FycmF5ID0gaXRlbS50eXBlID09PSBUeXBlLmFycmF5XG4gICAgICBjb25zdCBhcnJheVR5cGUgPSBpdGVtLml0ZW1zPy50eXBlXG4gICAgICBpZiAoXG4gICAgICAgICFpc09ialxuICAgICAgICAmJiAhZmlsdGVyVmFyKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiBrZXksXG4gICAgICAgICAgICB0eXBlOiBzdHJ1Y3RUeXBlVG9WYXJUeXBlKFxuICAgICAgICAgICAgICBpc0FycmF5ID8gYXJyYXlUeXBlISA6IGl0ZW0udHlwZSxcbiAgICAgICAgICAgICAgaXNBcnJheSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBba2V5XSxcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIGRlbGV0ZSBwcm9wZXJ0aWVzW2tleV1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoaXRlbS50eXBlID09PSBUeXBlLm9iamVjdCAmJiBpdGVtLnByb3BlcnRpZXMpIHtcbiAgICAgICAgaXRlbS5wcm9wZXJ0aWVzID0gZmluZEV4Y2VwdFZhckluU3RydWN0dXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgaXRlbS5wcm9wZXJ0aWVzLFxuICAgICAgICAgIGZpbHRlclZhcixcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGRyYWZ0XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuY29uc3QgZmluZEV4Y2VwdFZhckluT2JqZWN0ID0gKFxuICBvYmo6IGFueSxcbiAgZmlsdGVyVmFyOiAocGF5bG9hZDogVmFyLCBzZWxlY3RvcjogVmFsdWVTZWxlY3RvcikgPT4gYm9vbGVhbixcbiAgdmFsdWVfc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IsXG4gIGlzRmlsZT86IGJvb2xlYW4sXG4pOiBWYXIgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBvYmpcbiAgY29uc3QgaXNTdHJ1Y3R1cmVkT3V0cHV0ID0gISEoY2hpbGRyZW4gYXMgU3RydWN0dXJlZE91dHB1dCk/LnNjaGVtYT8ucHJvcGVydGllc1xuXG4gIGxldCBjaGlsZHJlblJlc3VsdDogVmFyW10gfCBTdHJ1Y3R1cmVkT3V0cHV0IHwgdW5kZWZpbmVkXG5cbiAgaWYgKGlzU3RydWN0dXJlZE91dHB1dCkge1xuICAgIGNoaWxkcmVuUmVzdWx0ID0gZmluZEV4Y2VwdFZhckluU3RydWN0dXJlZE91dHB1dChjaGlsZHJlbiwgZmlsdGVyVmFyKVxuICB9XG4gIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgY2hpbGRyZW5SZXN1bHQgPSBjaGlsZHJlblxuICAgICAgLm1hcCgoaXRlbTogVmFyKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW46IGl0ZW1DaGlsZHJlbiB9ID0gaXRlbVxuICAgICAgICBjb25zdCBjdXJyU2VsZWN0b3IgPSBbLi4udmFsdWVfc2VsZWN0b3IsIGl0ZW0udmFyaWFibGVdXG5cbiAgICAgICAgaWYgKCFpdGVtQ2hpbGRyZW4pIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgIGZpbHRlcmVkT2JqOiBudWxsLFxuICAgICAgICAgICAgcGFzc2VzRmlsdGVyOiBmaWx0ZXJWYXIoaXRlbSwgY3VyclNlbGVjdG9yKSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWx0ZXJlZE9iaiA9IGZpbmRFeGNlcHRWYXJJbk9iamVjdChcbiAgICAgICAgICBpdGVtLFxuICAgICAgICAgIGZpbHRlclZhcixcbiAgICAgICAgICBjdXJyU2VsZWN0b3IsXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgaXRlbUhhc1ZhbGlkQ2hpbGRyZW4gPSBoYXNWYWxpZENoaWxkcmVuKGZpbHRlcmVkT2JqLmNoaWxkcmVuKVxuXG4gICAgICAgIGxldCBwYXNzZXNGaWx0ZXJcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChpdGVtLnR5cGUgPT09IFZhclR5cGUub2JqZWN0IHx8IGl0ZW0udHlwZSA9PT0gVmFyVHlwZS5maWxlKVxuICAgICAgICAgICYmIGl0ZW1DaGlsZHJlblxuICAgICAgICApIHtcbiAgICAgICAgICBwYXNzZXNGaWx0ZXIgPSBpdGVtSGFzVmFsaWRDaGlsZHJlbiB8fCBmaWx0ZXJWYXIoaXRlbSwgY3VyclNlbGVjdG9yKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHBhc3Nlc0ZpbHRlciA9IGl0ZW1IYXNWYWxpZENoaWxkcmVuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgZmlsdGVyZWRPYmosXG4gICAgICAgICAgcGFzc2VzRmlsdGVyLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmZpbHRlcigoeyBwYXNzZXNGaWx0ZXIgfSkgPT4gcGFzc2VzRmlsdGVyKVxuICAgICAgLm1hcCgoeyBpdGVtLCBmaWx0ZXJlZE9iaiB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW46IGl0ZW1DaGlsZHJlbiB9ID0gaXRlbVxuICAgICAgICBpZiAoIWl0ZW1DaGlsZHJlbiB8fCAhZmlsdGVyZWRPYmopXG4gICAgICAgICAgcmV0dXJuIGl0ZW1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgY2hpbGRyZW46IGZpbHRlcmVkT2JqLmNoaWxkcmVuLFxuICAgICAgICB9XG4gICAgICB9KVxuICB9XG4gIGVsc2Uge1xuICAgIGNoaWxkcmVuUmVzdWx0ID0gW11cbiAgfVxuXG4gIGNvbnN0IHJlczogVmFyID0ge1xuICAgIHZhcmlhYmxlOiBvYmoudmFyaWFibGUsXG4gICAgdHlwZTogaXNGaWxlID8gVmFyVHlwZS5maWxlIDogVmFyVHlwZS5vYmplY3QsXG4gICAgY2hpbGRyZW46IGNoaWxkcmVuUmVzdWx0LFxuICAgIHNjaGVtYVR5cGU6IG9iai5zY2hlbWFUeXBlLFxuICB9XG5cbiAgcmV0dXJuIHJlc1xufVxuXG5jb25zdCBmb3JtYXRJdGVtID0gKFxuICBpdGVtOiBhbnksXG4gIGlzQ2hhdE1vZGU6IGJvb2xlYW4sXG4gIGZpbHRlclZhcjogKHBheWxvYWQ6IFZhciwgc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IGJvb2xlYW4sXG4gIGFsbFBsdWdpbkluZm9MaXN0OiBSZWNvcmQ8c3RyaW5nLCBUb29sV2l0aFByb3ZpZGVyW10+LFxuICByYWdWYXJzPzogVmFyW10sXG4gIHNjaGVtYVR5cGVEZWZpbml0aW9uczogU2NoZW1hVHlwZURlZmluaXRpb25bXSA9IFtdLFxuKTogTm9kZU91dFB1dFZhciA9PiB7XG4gIGNvbnN0IHsgaWQsIGRhdGEgfSA9IGl0ZW1cblxuICBjb25zdCByZXM6IE5vZGVPdXRQdXRWYXIgPSB7XG4gICAgbm9kZUlkOiBpZCxcbiAgICB0aXRsZTogZGF0YS50aXRsZSxcbiAgICB2YXJzOiBbXSxcbiAgfVxuICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgIGNhc2UgQmxvY2tFbnVtLlN0YXJ0OiB7XG4gICAgICBjb25zdCB7IHZhcmlhYmxlcyB9ID0gZGF0YSBhcyBTdGFydE5vZGVUeXBlXG4gICAgICByZXMudmFycyA9IHZhcmlhYmxlcy5tYXAoKHYpID0+IHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGlucHV0VmFyVHlwZVRvVmFyVHlwZSh2LnR5cGUpXG4gICAgICAgIGNvbnN0IHZhclJlczogVmFyID0ge1xuICAgICAgICAgIHZhcmlhYmxlOiB2LnZhcmlhYmxlLFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgaXNQYXJhZ3JhcGg6IHYudHlwZSA9PT0gSW5wdXRWYXJUeXBlLnBhcmFncmFwaCxcbiAgICAgICAgICBpc1NlbGVjdDogdi50eXBlID09PSBJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgICAgIG9wdGlvbnM6IHYub3B0aW9ucyxcbiAgICAgICAgICByZXF1aXJlZDogdi5yZXF1aXJlZCxcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlID09PSBWYXJUeXBlLm9iamVjdCAmJiB2Lmpzb25fc2NoZW1hKSB7XG4gICAgICAgICAgICB2YXJSZXMuY2hpbGRyZW4gPSB7XG4gICAgICAgICAgICAgIHNjaGVtYTogdHlwZW9mIHYuanNvbl9zY2hlbWEgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZSh2Lmpzb25fc2NoZW1hKSA6IHYuanNvbl9zY2hlbWEsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZvcm1hdHRpbmcgdmFyaWFibGU6JywgZXJyb3IpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFyUmVzXG4gICAgICB9KVxuICAgICAgaWYgKGlzQ2hhdE1vZGUpIHtcbiAgICAgICAgcmVzLnZhcnMucHVzaCh7XG4gICAgICAgICAgdmFyaWFibGU6ICdzeXMucXVlcnknLFxuICAgICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmVzLnZhcnMucHVzaCh7XG4gICAgICAgIHZhcmlhYmxlOiAnc3lzLmZpbGVzJyxcbiAgICAgICAgdHlwZTogVmFyVHlwZS5hcnJheUZpbGUsXG4gICAgICB9KVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vazoge1xuICAgICAgY29uc3Qge1xuICAgICAgICB2YXJpYWJsZXMgPSBbXSxcbiAgICAgIH0gPSBkYXRhIGFzIFdlYmhvb2tUcmlnZ2VyTm9kZVR5cGVcbiAgICAgIHJlcy52YXJzID0gdmFyaWFibGVzLm1hcCgodikgPT4ge1xuICAgICAgICBjb25zdCB0eXBlID0gdi52YWx1ZV90eXBlIHx8IFZhclR5cGUuc3RyaW5nXG4gICAgICAgIGNvbnN0IHZhclJlczogVmFyID0ge1xuICAgICAgICAgIHZhcmlhYmxlOiB2LnZhcmlhYmxlLFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgaXNQYXJhZ3JhcGg6IGZhbHNlLFxuICAgICAgICAgIGlzU2VsZWN0OiBmYWxzZSxcbiAgICAgICAgICBvcHRpb25zOiB2Lm9wdGlvbnMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHYucmVxdWlyZWQsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhclJlc1xuICAgICAgfSlcblxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5MTE06IHtcbiAgICAgIHJlcy52YXJzID0gWy4uLkxMTV9PVVRQVVRfU1RSVUNUXVxuICAgICAgaWYgKFxuICAgICAgICBkYXRhLnN0cnVjdHVyZWRfb3V0cHV0X2VuYWJsZWRcbiAgICAgICAgJiYgZGF0YS5zdHJ1Y3R1cmVkX291dHB1dD8uc2NoZW1hPy5wcm9wZXJ0aWVzXG4gICAgICAgICYmIE9iamVjdC5rZXlzKGRhdGEuc3RydWN0dXJlZF9vdXRwdXQuc2NoZW1hLnByb3BlcnRpZXMpLmxlbmd0aCA+IDBcbiAgICAgICkge1xuICAgICAgICByZXMudmFycy5wdXNoKHtcbiAgICAgICAgICB2YXJpYWJsZTogJ3N0cnVjdHVyZWRfb3V0cHV0JyxcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLm9iamVjdCxcbiAgICAgICAgICBjaGlsZHJlbjogZGF0YS5zdHJ1Y3R1cmVkX291dHB1dCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgYnJlYWtcbiAgICB9XG4gICAgY2FzZSBCbG9ja0VudW0uS25vd2xlZGdlUmV0cmlldmFsOiB7XG4gICAgICByZXMudmFycyA9IEtOT1dMRURHRV9SRVRSSUVWQUxfT1VUUFVUX1NUUlVDVFxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5Db2RlOiB7XG4gICAgICBjb25zdCB7IG91dHB1dHMgfSA9IGRhdGEgYXMgQ29kZU5vZGVUeXBlXG4gICAgICByZXMudmFycyA9IG91dHB1dHNcbiAgICAgICAgPyBPYmplY3Qua2V5cyhvdXRwdXRzKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFyaWFibGU6IGtleSxcbiAgICAgICAgICAgICAgdHlwZTogb3V0cHV0c1trZXldLnR5cGUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgOiBbXVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5UZW1wbGF0ZVRyYW5zZm9ybToge1xuICAgICAgcmVzLnZhcnMgPSBURU1QTEFURV9UUkFOU0ZPUk1fT1VUUFVUX1NUUlVDVFxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5RdWVzdGlvbkNsYXNzaWZpZXI6IHtcbiAgICAgIHJlcy52YXJzID0gUVVFU1RJT05fQ0xBU1NJRklFUl9PVVRQVVRfU1RSVUNUXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkh0dHBSZXF1ZXN0OiB7XG4gICAgICByZXMudmFycyA9IEhUVFBfUkVRVUVTVF9PVVRQVVRfU1RSVUNUXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXI6IHtcbiAgICAgIGNvbnN0IHsgb3V0cHV0X3R5cGUsIGFkdmFuY2VkX3NldHRpbmdzIH1cbiAgICAgICAgPSBkYXRhIGFzIFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZVxuICAgICAgY29uc3QgaXNHcm91cCA9ICEhYWR2YW5jZWRfc2V0dGluZ3M/Lmdyb3VwX2VuYWJsZWRcbiAgICAgIGlmICghaXNHcm91cCkge1xuICAgICAgICByZXMudmFycyA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YXJpYWJsZTogJ291dHB1dCcsXG4gICAgICAgICAgICB0eXBlOiBvdXRwdXRfdHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzLnZhcnMgPSBhZHZhbmNlZF9zZXR0aW5ncz8uZ3JvdXBzLm1hcCgoZ3JvdXApID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFyaWFibGU6IGdyb3VwLmdyb3VwX25hbWUsXG4gICAgICAgICAgICB0eXBlOiBWYXJUeXBlLm9iamVjdCxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZTogJ291dHB1dCcsXG4gICAgICAgICAgICAgICAgdHlwZTogZ3JvdXAub3V0cHV0X3R5cGUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNvbmFyanMvbm8tZHVwbGljYXRlZC1icmFuY2hlc1xuICAgIGNhc2UgQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvcjoge1xuICAgICAgY29uc3QgeyBvdXRwdXRfdHlwZSwgYWR2YW5jZWRfc2V0dGluZ3MgfVxuICAgICAgICA9IGRhdGEgYXMgVmFyaWFibGVBc3NpZ25lck5vZGVUeXBlXG4gICAgICBjb25zdCBpc0dyb3VwID0gISFhZHZhbmNlZF9zZXR0aW5ncz8uZ3JvdXBfZW5hYmxlZFxuICAgICAgaWYgKCFpc0dyb3VwKSB7XG4gICAgICAgIHJlcy52YXJzID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnb3V0cHV0JyxcbiAgICAgICAgICAgIHR5cGU6IG91dHB1dF90eXBlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXMudmFycyA9IGFkdmFuY2VkX3NldHRpbmdzPy5ncm91cHMubWFwKChncm91cCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYWJsZTogZ3JvdXAuZ3JvdXBfbmFtZSxcbiAgICAgICAgICAgIHR5cGU6IFZhclR5cGUub2JqZWN0LFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhcmlhYmxlOiAnb3V0cHV0JyxcbiAgICAgICAgICAgICAgICB0eXBlOiBncm91cC5vdXRwdXRfdHlwZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5Ub29sOiB7XG4gICAgICBjb25zdCB0b29sT3V0cHV0VmFyc1xuICAgICAgICA9IFRvb2xOb2RlRGVmYXVsdC5nZXRPdXRwdXRWYXJzPy4oXG4gICAgICAgICAgZGF0YSBhcyBUb29sTm9kZVR5cGUsXG4gICAgICAgICAgYWxsUGx1Z2luSW5mb0xpc3QsXG4gICAgICAgICAgW10sXG4gICAgICAgICAgeyBzY2hlbWFUeXBlRGVmaW5pdGlvbnMgfSxcbiAgICAgICAgKSB8fCBbXVxuICAgICAgcmVzLnZhcnMgPSB0b29sT3V0cHV0VmFyc1xuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5QYXJhbWV0ZXJFeHRyYWN0b3I6IHtcbiAgICAgIHJlcy52YXJzID0gW1xuICAgICAgICAuLi4oKGRhdGEgYXMgUGFyYW1ldGVyRXh0cmFjdG9yTm9kZVR5cGUpLnBhcmFtZXRlcnMgfHwgW10pLm1hcCgocCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYWJsZTogcC5uYW1lLFxuICAgICAgICAgICAgdHlwZTogcC50eXBlIGFzIHVua25vd24gYXMgVmFyVHlwZSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAuLi5QQVJBTUVURVJfRVhUUkFDVE9SX0NPTU1PTl9TVFJVQ1QsXG4gICAgICBdXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkl0ZXJhdGlvbjoge1xuICAgICAgcmVzLnZhcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB2YXJpYWJsZTogJ291dHB1dCcsXG4gICAgICAgICAgdHlwZTogKGRhdGEgYXMgSXRlcmF0aW9uTm9kZVR5cGUpLm91dHB1dF90eXBlIHx8IFZhclR5cGUuYXJyYXlTdHJpbmcsXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkxvb3A6IHtcbiAgICAgIGNvbnN0IHsgbG9vcF92YXJpYWJsZXMgfSA9IGRhdGEgYXMgTG9vcE5vZGVUeXBlXG4gICAgICByZXMuaXNMb29wID0gdHJ1ZVxuICAgICAgcmVzLnZhcnNcbiAgICAgICAgPSBsb29wX3ZhcmlhYmxlcz8ubWFwKCh2KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiB2LmxhYmVsLFxuICAgICAgICAgICAgdHlwZTogdi52YXJfdHlwZSxcbiAgICAgICAgICAgIGlzTG9vcFZhcmlhYmxlOiB0cnVlLFxuICAgICAgICAgICAgbm9kZUlkOiByZXMubm9kZUlkLFxuICAgICAgICAgIH1cbiAgICAgICAgfSkgfHwgW11cblxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5Eb2NFeHRyYWN0b3I6IHtcbiAgICAgIHJlcy52YXJzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdmFyaWFibGU6ICd0ZXh0JyxcbiAgICAgICAgICB0eXBlOiAoZGF0YSBhcyBEb2NFeHRyYWN0b3JOb2RlVHlwZSkuaXNfYXJyYXlfZmlsZVxuICAgICAgICAgICAgPyBWYXJUeXBlLmFycmF5U3RyaW5nXG4gICAgICAgICAgICA6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICB9LFxuICAgICAgXVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5MaXN0RmlsdGVyOiB7XG4gICAgICBpZiAoIShkYXRhIGFzIExpc3RGaWx0ZXJOb2RlVHlwZSkudmFyX3R5cGUpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIHJlcy52YXJzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdmFyaWFibGU6ICdyZXN1bHQnLFxuICAgICAgICAgIHR5cGU6IChkYXRhIGFzIExpc3RGaWx0ZXJOb2RlVHlwZSkudmFyX3R5cGUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB2YXJpYWJsZTogJ2ZpcnN0X3JlY29yZCcsXG4gICAgICAgICAgdHlwZTogKGRhdGEgYXMgTGlzdEZpbHRlck5vZGVUeXBlKS5pdGVtX3Zhcl90eXBlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdmFyaWFibGU6ICdsYXN0X3JlY29yZCcsXG4gICAgICAgICAgdHlwZTogKGRhdGEgYXMgTGlzdEZpbHRlck5vZGVUeXBlKS5pdGVtX3Zhcl90eXBlLFxuICAgICAgICB9LFxuICAgICAgXVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5BZ2VudDoge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgQWdlbnROb2RlVHlwZVxuICAgICAgY29uc3Qgb3V0cHV0czogVmFyW10gPSBbXVxuICAgICAgT2JqZWN0LmtleXMocGF5bG9hZC5vdXRwdXRfc2NoZW1hPy5wcm9wZXJ0aWVzIHx8IHt9KS5mb3JFYWNoKFxuICAgICAgICAob3V0cHV0S2V5KSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3V0cHV0ID0gcGF5bG9hZC5vdXRwdXRfc2NoZW1hLnByb3BlcnRpZXNbb3V0cHV0S2V5XVxuICAgICAgICAgIG91dHB1dHMucHVzaCh7XG4gICAgICAgICAgICB2YXJpYWJsZTogb3V0cHV0S2V5LFxuICAgICAgICAgICAgdHlwZTpcbiAgICAgICAgICAgICAgb3V0cHV0LnR5cGUgPT09ICdhcnJheSdcbiAgICAgICAgICAgICAgICA/IChgQXJyYXlbJHtvdXRwdXQuaXRlbXM/LnR5cGUgPyBvdXRwdXQuaXRlbXMudHlwZS5zbGljZSgwLCAxKS50b0xvY2FsZVVwcGVyQ2FzZSgpICsgb3V0cHV0Lml0ZW1zLnR5cGUuc2xpY2UoMSkgOiAnVW5rbm93bid9XWAgYXMgVmFyVHlwZSlcbiAgICAgICAgICAgICAgICA6IChgJHtvdXRwdXQudHlwZSA/IG91dHB1dC50eXBlLnNsaWNlKDAsIDEpLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyBvdXRwdXQudHlwZS5zbGljZSgxKSA6ICdVbmtub3duJ31gIGFzIFZhclR5cGUpLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgICByZXMudmFycyA9IFsuLi5vdXRwdXRzLCAuLi5UT09MX09VVFBVVF9TVFJVQ1QsIC4uLkFHRU5UX09VVFBVVF9TVFJVQ1RdXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkRhdGFTb3VyY2U6IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIERhdGFTb3VyY2VOb2RlVHlwZVxuICAgICAgY29uc3QgZGF0YVNvdXJjZVZhcnNcbiAgICAgICAgPSBEYXRhU291cmNlTm9kZURlZmF1bHQuZ2V0T3V0cHV0VmFycz8uKFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgICAgYWxsUGx1Z2luSW5mb0xpc3QsXG4gICAgICAgICAgcmFnVmFycyxcbiAgICAgICAgICB7IHNjaGVtYVR5cGVEZWZpbml0aW9ucyB9LFxuICAgICAgICApIHx8IFtdXG4gICAgICByZXMudmFycyA9IGRhdGFTb3VyY2VWYXJzXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW46IHtcbiAgICAgIGNvbnN0IG91dHB1dFNjaGVtYSA9IFBsdWdpblRyaWdnZXJOb2RlRGVmYXVsdC5nZXRPdXRwdXRWYXJzPy4oXG4gICAgICAgIGRhdGEgYXMgUGx1Z2luVHJpZ2dlck5vZGVUeXBlLFxuICAgICAgICBhbGxQbHVnaW5JbmZvTGlzdCxcbiAgICAgICAgW10sXG4gICAgICAgIHsgc2NoZW1hVHlwZURlZmluaXRpb25zIH0sXG4gICAgICApIHx8IFtdXG4gICAgICByZXMudmFycyA9IG91dHB1dFNjaGVtYVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlICdlbnYnOiB7XG4gICAgICByZXMudmFycyA9IGRhdGEuZW52TGlzdC5tYXAoKGVudjogRW52aXJvbm1lbnRWYXJpYWJsZSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhcmlhYmxlOiBgZW52LiR7ZW52Lm5hbWV9YCxcbiAgICAgICAgICB0eXBlOiBlbnYudmFsdWVfdHlwZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZW52LmRlc2NyaXB0aW9uLFxuICAgICAgICB9XG4gICAgICB9KSBhcyBWYXJbXVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlICdjb252ZXJzYXRpb24nOiB7XG4gICAgICByZXMudmFycyA9IGRhdGEuY2hhdFZhckxpc3QubWFwKChjaGF0VmFyOiBDb252ZXJzYXRpb25WYXJpYWJsZSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhcmlhYmxlOiBgY29udmVyc2F0aW9uLiR7Y2hhdFZhci5uYW1lfWAsXG4gICAgICAgICAgdHlwZTogY2hhdFZhci52YWx1ZV90eXBlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBjaGF0VmFyLmRlc2NyaXB0aW9uLFxuICAgICAgICB9XG4gICAgICB9KSBhcyBWYXJbXVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlICdnbG9iYWwnOiB7XG4gICAgICByZXMudmFycyA9IGRhdGEuZ2xvYmFsVmFyTGlzdFxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlICdyYWcnOiB7XG4gICAgICByZXMudmFycyA9IGRhdGEucmFnVmFyaWFibGVzLm1hcCgocmFnVmFyOiBSQUdQaXBlbGluZVZhcmlhYmxlKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFyaWFibGU6IGByYWcuc2hhcmVkLiR7cmFnVmFyLnZhcmlhYmxlfWAsXG4gICAgICAgICAgdHlwZTogaW5wdXRWYXJUeXBlVG9WYXJUeXBlKHJhZ1Zhci50eXBlIGFzIGFueSksXG4gICAgICAgICAgZGVzOiByYWdWYXIubGFiZWwsXG4gICAgICAgICAgaXNSYWdWYXJpYWJsZTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgfSkgYXMgVmFyW11cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgY29uc3QgeyBlcnJvcl9zdHJhdGVneSB9ID0gZGF0YVxuXG4gIGlmIChlcnJvcl9zdHJhdGVneSkge1xuICAgIHJlcy52YXJzID0gW1xuICAgICAgLi4ucmVzLnZhcnMsXG4gICAgICB7XG4gICAgICAgIHZhcmlhYmxlOiAnZXJyb3JfbWVzc2FnZScsXG4gICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICBpc0V4Y2VwdGlvbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhcmlhYmxlOiAnZXJyb3JfdHlwZScsXG4gICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICBpc0V4Y2VwdGlvbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgXVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBbaWRdXG4gIHJlcy52YXJzID0gcmVzLnZhcnNcbiAgICAuZmlsdGVyKCh2KSA9PiB7XG4gICAgICBjb25zdCBpc0N1cnJlbnRNYXRjaGVkID0gZmlsdGVyVmFyKFxuICAgICAgICB2LFxuICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHZhcmlhYmxlQXJyID0gdi52YXJpYWJsZS5zcGxpdCgnLicpXG4gICAgICAgICAgY29uc3QgW2ZpcnN0XSA9IHZhcmlhYmxlQXJyXG4gICAgICAgICAgaWYgKGlzU3BlY2lhbFZhcihmaXJzdCkpXG4gICAgICAgICAgICByZXR1cm4gdmFyaWFibGVBcnJcblxuICAgICAgICAgIHJldHVybiBbLi4uc2VsZWN0b3IsIC4uLnZhcmlhYmxlQXJyXVxuICAgICAgICB9KSgpLFxuICAgICAgKVxuICAgICAgaWYgKGlzQ3VycmVudE1hdGNoZWQpXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgIGNvbnN0IGlzRmlsZSA9IHYudHlwZSA9PT0gVmFyVHlwZS5maWxlXG4gICAgICBjb25zdCBjaGlsZHJlbiA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChpc0ZpbGUpIHtcbiAgICAgICAgICByZXR1cm4gT1VUUFVUX0ZJTEVfU1VCX1ZBUklBQkxFUy5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVmID0gRklMRV9TVFJVQ1QuZmluZChjID0+IGMudmFyaWFibGUgPT09IGtleSlcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHZhcmlhYmxlOiBrZXksXG4gICAgICAgICAgICAgIHR5cGU6IGRlZj8udHlwZSB8fCBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2LmNoaWxkcmVuXG4gICAgICB9KSgpXG4gICAgICBpZiAoIWNoaWxkcmVuKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgY29uc3Qgb2JqID0gZmluZEV4Y2VwdFZhckluT2JqZWN0KFxuICAgICAgICBpc0ZpbGUgPyB7IC4uLnYsIGNoaWxkcmVuIH0gOiB2LFxuICAgICAgICBmaWx0ZXJWYXIsXG4gICAgICAgIHNlbGVjdG9yLFxuICAgICAgICBpc0ZpbGUsXG4gICAgICApXG4gICAgICByZXR1cm4gaGFzVmFsaWRDaGlsZHJlbihvYmo/LmNoaWxkcmVuKVxuICAgIH0pXG4gICAgLm1hcCgodikgPT4ge1xuICAgICAgY29uc3QgaXNGaWxlID0gdi50eXBlID09PSBWYXJUeXBlLmZpbGVcbiAgICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChpc0ZpbGUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hpbGRyZW46IE9VVFBVVF9GSUxFX1NVQl9WQVJJQUJMRVMubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZGVmID0gRklMRV9TVFJVQ1QuZmluZChjID0+IGMudmFyaWFibGUgPT09IGtleSlcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZToga2V5LFxuICAgICAgICAgICAgICAgIHR5cGU6IGRlZj8udHlwZSB8fCBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2XG4gICAgICB9KSgpXG5cbiAgICAgIGlmICghY2hpbGRyZW4pXG4gICAgICAgIHJldHVybiB2XG5cbiAgICAgIHJldHVybiBmaW5kRXhjZXB0VmFySW5PYmplY3QoXG4gICAgICAgIGlzRmlsZSA/IHsgLi4udiwgY2hpbGRyZW4gfSA6IHYsXG4gICAgICAgIGZpbHRlclZhcixcbiAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgIGlzRmlsZSxcbiAgICAgIClcbiAgICB9KVxuXG4gIHJldHVybiByZXNcbn1cblxuZXhwb3J0IGNvbnN0IHJlbW92ZUZpbGVWYXJzID0gKG5vZGVXaXRoVmFyczogTm9kZU91dFB1dFZhcltdKSA9PiB7XG4gIHJldHVybiBub2RlV2l0aFZhcnNcbiAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5pdGVtLFxuICAgICAgICB2YXJzOiBpdGVtLnZhcnMuZmlsdGVyKFxuICAgICAgICAgIHYgPT4gdi50eXBlICE9PSBWYXJUeXBlLmZpbGUgJiYgdi50eXBlICE9PSBWYXJUeXBlLmFycmF5RmlsZSxcbiAgICAgICAgKSxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtLnZhcnMubGVuZ3RoID4gMClcbn1cblxuZXhwb3J0IGNvbnN0IHRvTm9kZU91dHB1dFZhcnMgPSAoXG4gIG5vZGVzOiBhbnlbXSxcbiAgaXNDaGF0TW9kZTogYm9vbGVhbixcbiAgZmlsdGVyVmFyID0gKF9wYXlsb2FkOiBWYXIsIF9zZWxlY3RvcjogVmFsdWVTZWxlY3RvcikgPT4gdHJ1ZSxcbiAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IEVudmlyb25tZW50VmFyaWFibGVbXSA9IFtdLFxuICBjb252ZXJzYXRpb25WYXJpYWJsZXM6IENvbnZlcnNhdGlvblZhcmlhYmxlW10gPSBbXSxcbiAgcmFnVmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlW10gPSBbXSxcbiAgYWxsUGx1Z2luSW5mb0xpc3Q6IFJlY29yZDxzdHJpbmcsIFRvb2xXaXRoUHJvdmlkZXJbXT4sXG4gIHNjaGVtYVR5cGVEZWZpbml0aW9ucz86IFNjaGVtYVR5cGVEZWZpbml0aW9uW10sXG4pOiBOb2RlT3V0UHV0VmFyW10gPT4ge1xuICAvLyBFTlZfTk9ERSBkYXRhIGZvcm1hdFxuICBjb25zdCBFTlZfTk9ERSA9IHtcbiAgICBpZDogJ2VudicsXG4gICAgZGF0YToge1xuICAgICAgdGl0bGU6ICdFTlZJUk9OTUVOVCcsXG4gICAgICB0eXBlOiAnZW52JyxcbiAgICAgIGVudkxpc3Q6IGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgIH0sXG4gIH1cbiAgLy8gQ0hBVF9WQVJfTk9ERSBkYXRhIGZvcm1hdFxuICBjb25zdCBDSEFUX1ZBUl9OT0RFID0ge1xuICAgIGlkOiAnY29udmVyc2F0aW9uJyxcbiAgICBkYXRhOiB7XG4gICAgICB0aXRsZTogJ0NPTlZFUlNBVElPTicsXG4gICAgICB0eXBlOiAnY29udmVyc2F0aW9uJyxcbiAgICAgIGNoYXRWYXJMaXN0OiBjb252ZXJzYXRpb25WYXJpYWJsZXMsXG4gICAgfSxcbiAgfVxuICAvLyBHTE9CQUxfVkFSX05PREUgZGF0YSBmb3JtYXRcbiAgY29uc3QgR0xPQkFMX1ZBUl9OT0RFID0ge1xuICAgIGlkOiAnZ2xvYmFsJyxcbiAgICBkYXRhOiB7XG4gICAgICB0aXRsZTogJ1NZU1RFTScsXG4gICAgICB0eXBlOiAnZ2xvYmFsJyxcbiAgICAgIGdsb2JhbFZhckxpc3Q6IGdldEdsb2JhbFZhcnMoaXNDaGF0TW9kZSksXG4gICAgfSxcbiAgfVxuICAvLyBSQUdfUElQRUxJTkVfTk9ERSBkYXRhIGZvcm1hdFxuICBjb25zdCBSQUdfUElQRUxJTkVfTk9ERSA9IHtcbiAgICBpZDogJ3JhZycsXG4gICAgZGF0YToge1xuICAgICAgdGl0bGU6ICdTSEFSRUQgSU5QVVRTJyxcbiAgICAgIHR5cGU6ICdyYWcnLFxuICAgICAgcmFnVmFyaWFibGVzOiByYWdWYXJpYWJsZXMuZmlsdGVyKFxuICAgICAgICByYWdWYXJpYWJsZSA9PiByYWdWYXJpYWJsZS5iZWxvbmdfdG9fbm9kZV9pZCA9PT0gJ3NoYXJlZCcsXG4gICAgICApLFxuICAgIH0sXG4gIH1cbiAgLy8gU29ydCBub2RlcyBpbiByZXZlcnNlIGNocm9ub2xvZ2ljYWwgb3JkZXIgKG1vc3QgcmVjZW50IGZpcnN0KVxuICBjb25zdCBzb3J0ZWROb2RlcyA9IFsuLi5ub2Rlc10uc29ydCgoYSwgYikgPT4ge1xuICAgIGlmIChhLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0KVxuICAgICAgcmV0dXJuIDFcbiAgICBpZiAoYi5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydClcbiAgICAgIHJldHVybiAtMVxuICAgIGlmIChhLmRhdGEudHlwZSA9PT0gJ2VudicpXG4gICAgICByZXR1cm4gMVxuICAgIGlmIChiLmRhdGEudHlwZSA9PT0gJ2VudicpXG4gICAgICByZXR1cm4gLTFcbiAgICBpZiAoYS5kYXRhLnR5cGUgPT09ICdjb252ZXJzYXRpb24nKVxuICAgICAgcmV0dXJuIDFcbiAgICBpZiAoYi5kYXRhLnR5cGUgPT09ICdjb252ZXJzYXRpb24nKVxuICAgICAgcmV0dXJuIC0xXG4gICAgaWYgKGEuZGF0YS50eXBlID09PSAnZ2xvYmFsJylcbiAgICAgIHJldHVybiAxXG4gICAgaWYgKGIuZGF0YS50eXBlID09PSAnZ2xvYmFsJylcbiAgICAgIHJldHVybiAtMVxuICAgIC8vIHNvcnQgbm9kZXMgYnkgeCBwb3NpdGlvblxuICAgIHJldHVybiAoYi5wb3NpdGlvbj8ueCB8fCAwKSAtIChhLnBvc2l0aW9uPy54IHx8IDApXG4gIH0pXG5cbiAgY29uc3QgcmVzID0gW1xuICAgIC4uLnNvcnRlZE5vZGVzLmZpbHRlcihub2RlID0+XG4gICAgICBTVVBQT1JUX09VVFBVVF9WQVJTX05PREUuaW5jbHVkZXMobm9kZT8uZGF0YT8udHlwZSksXG4gICAgKSxcbiAgICAuLi4oZW52aXJvbm1lbnRWYXJpYWJsZXMubGVuZ3RoID4gMCA/IFtFTlZfTk9ERV0gOiBbXSksXG4gICAgLi4uKGlzQ2hhdE1vZGUgJiYgY29udmVyc2F0aW9uVmFyaWFibGVzLmxlbmd0aCA+IDAgPyBbQ0hBVF9WQVJfTk9ERV0gOiBbXSksXG4gICAgR0xPQkFMX1ZBUl9OT0RFLFxuICAgIC4uLihSQUdfUElQRUxJTkVfTk9ERS5kYXRhLnJhZ1ZhcmlhYmxlcy5sZW5ndGggPiAwXG4gICAgICA/IFtSQUdfUElQRUxJTkVfTk9ERV1cbiAgICAgIDogW10pLFxuICBdXG4gICAgLm1hcCgobm9kZSkgPT4ge1xuICAgICAgbGV0IHJhZ1ZhcmlhYmxlc0luRGF0YVNvdXJjZTogUkFHUGlwZWxpbmVWYXJpYWJsZVtdID0gW11cbiAgICAgIGlmIChub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpIHtcbiAgICAgICAgcmFnVmFyaWFibGVzSW5EYXRhU291cmNlID0gcmFnVmFyaWFibGVzLmZpbHRlcihcbiAgICAgICAgICByYWdWYXJpYWJsZSA9PiByYWdWYXJpYWJsZS5iZWxvbmdfdG9fbm9kZV9pZCA9PT0gbm9kZS5pZCxcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZm9ybWF0SXRlbShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGlzQ2hhdE1vZGUsXG4gICAgICAgICAgZmlsdGVyVmFyLFxuICAgICAgICAgIGFsbFBsdWdpbkluZm9MaXN0LFxuICAgICAgICAgIHJhZ1ZhcmlhYmxlc0luRGF0YVNvdXJjZS5tYXAoXG4gICAgICAgICAgICAocmFnVmFyaWFibGU6IFJBR1BpcGVsaW5lVmFyaWFibGUpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZTogYHJhZy4ke25vZGUuaWR9LiR7cmFnVmFyaWFibGUudmFyaWFibGV9YCxcbiAgICAgICAgICAgICAgICB0eXBlOiBpbnB1dFZhclR5cGVUb1ZhclR5cGUocmFnVmFyaWFibGUudHlwZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByYWdWYXJpYWJsZS5sYWJlbCxcbiAgICAgICAgICAgICAgICBpc1JhZ1ZhcmlhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICB9IGFzIFZhclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApLFxuICAgICAgICAgIHNjaGVtYVR5cGVEZWZpbml0aW9ucyxcbiAgICAgICAgKSxcbiAgICAgICAgaXNTdGFydE5vZGU6IG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnQsXG4gICAgICB9XG4gICAgfSlcbiAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbS52YXJzLmxlbmd0aCA+IDApXG4gIHJldHVybiByZXNcbn1cblxuY29uc3QgZ2V0SXRlcmF0aW9uSXRlbVR5cGUgPSAoe1xuICB2YWx1ZVNlbGVjdG9yLFxuICBiZWZvcmVOb2Rlc091dHB1dFZhcnMsXG59OiB7XG4gIHZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3JcbiAgYmVmb3JlTm9kZXNPdXRwdXRWYXJzOiBOb2RlT3V0UHV0VmFyW11cbn0pOiBWYXJUeXBlID0+IHtcbiAgY29uc3Qgb3V0cHV0VmFyTm9kZUlkID0gdmFsdWVTZWxlY3RvclswXVxuICBjb25zdCBpc1N5c3RlbSA9IGlzU3lzdGVtVmFyKHZhbHVlU2VsZWN0b3IpXG4gIGNvbnN0IGlzQ2hhdFZhciA9IGlzQ29udmVyc2F0aW9uVmFyKHZhbHVlU2VsZWN0b3IpXG5cbiAgY29uc3QgdGFyZ2V0VmFyID0gaXNTeXN0ZW1cbiAgICA/IGJlZm9yZU5vZGVzT3V0cHV0VmFycy5maW5kKHYgPT4gdi5pc1N0YXJ0Tm9kZSlcbiAgICA6IGJlZm9yZU5vZGVzT3V0cHV0VmFycy5maW5kKHYgPT4gdi5ub2RlSWQgPT09IG91dHB1dFZhck5vZGVJZClcblxuICBpZiAoIXRhcmdldFZhcilcbiAgICByZXR1cm4gVmFyVHlwZS5zdHJpbmdcblxuICBsZXQgYXJyYXlUeXBlOiBWYXJUeXBlID0gVmFyVHlwZS5zdHJpbmdcblxuICBsZXQgY3VycjogYW55ID0gdGFyZ2V0VmFyLnZhcnNcbiAgaWYgKGlzU3lzdGVtIHx8IGlzQ2hhdFZhcikge1xuICAgIGFycmF5VHlwZSA9IGN1cnIuZmluZChcbiAgICAgICh2OiBhbnkpID0+IHYudmFyaWFibGUgPT09IHZhbHVlU2VsZWN0b3Iuam9pbignLicpLFxuICAgICk/LnR5cGVcbiAgfVxuICBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHZhbHVlU2VsZWN0b3IubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IHZhbHVlU2VsZWN0b3JbaV1cbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHZhbHVlU2VsZWN0b3IubGVuZ3RoIC0gMVxuICAgICAgY3VyciA9IEFycmF5LmlzQXJyYXkoY3VycikgPyBjdXJyLmZpbmQodiA9PiB2LnZhcmlhYmxlID09PSBrZXkpIDogW11cblxuICAgICAgaWYgKGlzTGFzdClcbiAgICAgICAgYXJyYXlUeXBlID0gY3Vycj8udHlwZVxuICAgICAgZWxzZSBpZiAoY3Vycj8udHlwZSA9PT0gVmFyVHlwZS5vYmplY3QgfHwgY3Vycj8udHlwZSA9PT0gVmFyVHlwZS5maWxlKVxuICAgICAgICBjdXJyID0gY3Vyci5jaGlsZHJlbiB8fCBbXVxuICAgIH1cbiAgfVxuXG4gIHN3aXRjaCAoYXJyYXlUeXBlIGFzIFZhclR5cGUpIHtcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlTdHJpbmc6XG4gICAgICByZXR1cm4gVmFyVHlwZS5zdHJpbmdcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlOdW1iZXI6XG4gICAgICByZXR1cm4gVmFyVHlwZS5udW1iZXJcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlCb29sZWFuOlxuICAgICAgcmV0dXJuIFZhclR5cGUuYm9vbGVhblxuICAgIGNhc2UgVmFyVHlwZS5hcnJheU9iamVjdDpcbiAgICAgIHJldHVybiBWYXJUeXBlLm9iamVjdFxuICAgIGNhc2UgVmFyVHlwZS5hcnJheTpcbiAgICAgIHJldHVybiBWYXJUeXBlLmFycmF5T2JqZWN0IC8vIFVzZSBtb3JlIHNwZWNpZmljIHR5cGUgaW5zdGVhZCBvZiBhbnlcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlGaWxlOlxuICAgICAgcmV0dXJuIFZhclR5cGUuZmlsZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gVmFyVHlwZS5zdHJpbmdcbiAgfVxufVxuXG5jb25zdCBnZXRMb29wSXRlbVR5cGUgPSAoe1xuICB2YWx1ZVNlbGVjdG9yLFxuICBiZWZvcmVOb2Rlc091dHB1dFZhcnMsXG59OiB7XG4gIHZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3JcbiAgYmVmb3JlTm9kZXNPdXRwdXRWYXJzOiBOb2RlT3V0UHV0VmFyW11cbn0pOiBWYXJUeXBlID0+IHtcbiAgY29uc3Qgb3V0cHV0VmFyTm9kZUlkID0gdmFsdWVTZWxlY3RvclswXVxuICBjb25zdCBpc1N5c3RlbSA9IGlzU3lzdGVtVmFyKHZhbHVlU2VsZWN0b3IpXG5cbiAgY29uc3QgdGFyZ2V0VmFyID0gaXNTeXN0ZW1cbiAgICA/IGJlZm9yZU5vZGVzT3V0cHV0VmFycy5maW5kKHYgPT4gdi5pc1N0YXJ0Tm9kZSlcbiAgICA6IGJlZm9yZU5vZGVzT3V0cHV0VmFycy5maW5kKHYgPT4gdi5ub2RlSWQgPT09IG91dHB1dFZhck5vZGVJZClcbiAgaWYgKCF0YXJnZXRWYXIpXG4gICAgcmV0dXJuIFZhclR5cGUuc3RyaW5nXG5cbiAgbGV0IGFycmF5VHlwZTogVmFyVHlwZSA9IFZhclR5cGUuc3RyaW5nXG5cbiAgbGV0IGN1cnI6IGFueSA9IHRhcmdldFZhci52YXJzXG4gIGlmIChpc1N5c3RlbSkge1xuICAgIGFycmF5VHlwZSA9IGN1cnIuZmluZChcbiAgICAgICh2OiBhbnkpID0+IHYudmFyaWFibGUgPT09IHZhbHVlU2VsZWN0b3Iuam9pbignLicpLFxuICAgICk/LnR5cGVcbiAgfVxuICBlbHNlIHtcbiAgICB2YWx1ZVNlbGVjdG9yLnNsaWNlKDEpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gdmFsdWVTZWxlY3Rvci5sZW5ndGggLSAyXG4gICAgICBjdXJyID0gY3Vycj8uZmluZCgodjogYW55KSA9PiB2LnZhcmlhYmxlID09PSBrZXkpXG4gICAgICBpZiAoaXNMYXN0KSB7XG4gICAgICAgIGFycmF5VHlwZSA9IGN1cnI/LnR5cGVcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoY3Vycj8udHlwZSA9PT0gVmFyVHlwZS5vYmplY3QgfHwgY3Vycj8udHlwZSA9PT0gVmFyVHlwZS5maWxlKVxuICAgICAgICAgIGN1cnIgPSBjdXJyLmNoaWxkcmVuXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN3aXRjaCAoYXJyYXlUeXBlIGFzIFZhclR5cGUpIHtcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlTdHJpbmc6XG4gICAgICByZXR1cm4gVmFyVHlwZS5zdHJpbmdcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlOdW1iZXI6XG4gICAgICByZXR1cm4gVmFyVHlwZS5udW1iZXJcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlPYmplY3Q6XG4gICAgICByZXR1cm4gVmFyVHlwZS5vYmplY3RcbiAgICBjYXNlIFZhclR5cGUuYXJyYXlCb29sZWFuOlxuICAgICAgcmV0dXJuIFZhclR5cGUuYm9vbGVhblxuICAgIGNhc2UgVmFyVHlwZS5hcnJheTpcbiAgICAgIHJldHVybiBWYXJUeXBlLmFueVxuICAgIGNhc2UgVmFyVHlwZS5hcnJheUZpbGU6XG4gICAgICByZXR1cm4gVmFyVHlwZS5maWxlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBWYXJUeXBlLnN0cmluZ1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRWYXJUeXBlID0gKHtcbiAgcGFyZW50Tm9kZSxcbiAgdmFsdWVTZWxlY3RvcixcbiAgaXNJdGVyYXRpb25JdGVtLFxuICBpc0xvb3BJdGVtLFxuICBhdmFpbGFibGVOb2RlcyxcbiAgaXNDaGF0TW9kZSxcbiAgaXNDb25zdGFudCxcbiAgZW52aXJvbm1lbnRWYXJpYWJsZXMgPSBbXSxcbiAgY29udmVyc2F0aW9uVmFyaWFibGVzID0gW10sXG4gIHJhZ1ZhcmlhYmxlcyA9IFtdLFxuICBhbGxQbHVnaW5JbmZvTGlzdCxcbiAgc2NoZW1hVHlwZURlZmluaXRpb25zLFxuICBwcmVmZXJTY2hlbWFUeXBlLFxufToge1xuICB2YWx1ZVNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yXG4gIHBhcmVudE5vZGU/OiBOb2RlIHwgbnVsbFxuICBpc0l0ZXJhdGlvbkl0ZW0/OiBib29sZWFuXG4gIGlzTG9vcEl0ZW0/OiBib29sZWFuXG4gIGF2YWlsYWJsZU5vZGVzOiBhbnlbXVxuICBpc0NoYXRNb2RlOiBib29sZWFuXG4gIGlzQ29uc3RhbnQ/OiBib29sZWFuXG4gIGVudmlyb25tZW50VmFyaWFibGVzPzogRW52aXJvbm1lbnRWYXJpYWJsZVtdXG4gIGNvbnZlcnNhdGlvblZhcmlhYmxlcz86IENvbnZlcnNhdGlvblZhcmlhYmxlW11cbiAgcmFnVmFyaWFibGVzPzogUkFHUGlwZWxpbmVWYXJpYWJsZVtdXG4gIGFsbFBsdWdpbkluZm9MaXN0OiBSZWNvcmQ8c3RyaW5nLCBUb29sV2l0aFByb3ZpZGVyW10+XG4gIHNjaGVtYVR5cGVEZWZpbml0aW9ucz86IFNjaGVtYVR5cGVEZWZpbml0aW9uW11cbiAgcHJlZmVyU2NoZW1hVHlwZT86IGJvb2xlYW5cbn0pOiBWYXJUeXBlID0+IHtcbiAgaWYgKGlzQ29uc3RhbnQpXG4gICAgcmV0dXJuIFZhclR5cGUuc3RyaW5nXG5cbiAgY29uc3QgYmVmb3JlTm9kZXNPdXRwdXRWYXJzID0gdG9Ob2RlT3V0cHV0VmFycyhcbiAgICBhdmFpbGFibGVOb2RlcyxcbiAgICBpc0NoYXRNb2RlLFxuICAgIHVuZGVmaW5lZCxcbiAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICBjb252ZXJzYXRpb25WYXJpYWJsZXMsXG4gICAgcmFnVmFyaWFibGVzLFxuICAgIGFsbFBsdWdpbkluZm9MaXN0LFxuICAgIHNjaGVtYVR5cGVEZWZpbml0aW9ucyxcbiAgKVxuXG4gIGNvbnN0IGlzSXRlcmF0aW9uSW5uZXJWYXIgPSBwYXJlbnROb2RlPy5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5JdGVyYXRpb25cbiAgaWYgKGlzSXRlcmF0aW9uSXRlbSkge1xuICAgIHJldHVybiBnZXRJdGVyYXRpb25JdGVtVHlwZSh7XG4gICAgICB2YWx1ZVNlbGVjdG9yLFxuICAgICAgYmVmb3JlTm9kZXNPdXRwdXRWYXJzLFxuICAgIH0pXG4gIH1cbiAgaWYgKGlzSXRlcmF0aW9uSW5uZXJWYXIpIHtcbiAgICBpZiAodmFsdWVTZWxlY3RvclsxXSA9PT0gJ2l0ZW0nKSB7XG4gICAgICBjb25zdCBpdGVtVHlwZSA9IGdldEl0ZXJhdGlvbkl0ZW1UeXBlKHtcbiAgICAgICAgdmFsdWVTZWxlY3RvcjogKHBhcmVudE5vZGU/LmRhdGEgYXMgYW55KT8uaXRlcmF0b3Jfc2VsZWN0b3IgfHwgW10sXG4gICAgICAgIGJlZm9yZU5vZGVzT3V0cHV0VmFycyxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gaXRlbVR5cGVcbiAgICB9XG4gICAgaWYgKHZhbHVlU2VsZWN0b3JbMV0gPT09ICdpbmRleCcpXG4gICAgICByZXR1cm4gVmFyVHlwZS5udW1iZXJcbiAgfVxuXG4gIGNvbnN0IGlzTG9vcElubmVyVmFyID0gcGFyZW50Tm9kZT8uZGF0YS50eXBlID09PSBCbG9ja0VudW0uTG9vcFxuICBpZiAoaXNMb29wSXRlbSkge1xuICAgIHJldHVybiBnZXRMb29wSXRlbVR5cGUoe1xuICAgICAgdmFsdWVTZWxlY3RvcixcbiAgICAgIGJlZm9yZU5vZGVzT3V0cHV0VmFycyxcbiAgICB9KVxuICB9XG4gIGlmIChpc0xvb3BJbm5lclZhcikge1xuICAgIGlmICh2YWx1ZVNlbGVjdG9yWzFdID09PSAnaXRlbScpIHtcbiAgICAgIGNvbnN0IGl0ZW1UeXBlID0gZ2V0TG9vcEl0ZW1UeXBlKHtcbiAgICAgICAgdmFsdWVTZWxlY3RvcjogKHBhcmVudE5vZGU/LmRhdGEgYXMgYW55KT8uaXRlcmF0b3Jfc2VsZWN0b3IgfHwgW10sXG4gICAgICAgIGJlZm9yZU5vZGVzT3V0cHV0VmFycyxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gaXRlbVR5cGVcbiAgICB9XG4gICAgaWYgKHZhbHVlU2VsZWN0b3JbMV0gPT09ICdpbmRleCcpXG4gICAgICByZXR1cm4gVmFyVHlwZS5udW1iZXJcbiAgfVxuXG4gIGNvbnN0IGlzR2xvYmFsID0gaXNHbG9iYWxWYXIodmFsdWVTZWxlY3RvcilcbiAgY29uc3QgaXNJblN0YXJ0Tm9kZVN5c1ZhciA9IGlzU3lzdGVtVmFyKHZhbHVlU2VsZWN0b3IpICYmICFpc0dsb2JhbFxuICBjb25zdCBpc0VudiA9IGlzRU5WKHZhbHVlU2VsZWN0b3IpXG4gIGNvbnN0IGlzQ2hhdFZhciA9IGlzQ29udmVyc2F0aW9uVmFyKHZhbHVlU2VsZWN0b3IpXG4gIGNvbnN0IGlzU2hhcmVkUmFnVmFyaWFibGVcbiAgICA9IGlzUmFnVmFyaWFibGVWYXIodmFsdWVTZWxlY3RvcikgJiYgdmFsdWVTZWxlY3RvclsxXSA9PT0gJ3NoYXJlZCdcbiAgY29uc3QgaXNJbk5vZGVSYWdWYXJpYWJsZVxuICAgID0gaXNSYWdWYXJpYWJsZVZhcih2YWx1ZVNlbGVjdG9yKSAmJiB2YWx1ZVNlbGVjdG9yWzFdICE9PSAnc2hhcmVkJ1xuXG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGF2YWlsYWJsZU5vZGVzLmZpbmQoKG5vZGU6IGFueSkgPT4ge1xuICAgIHJldHVybiBub2RlPy5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuICB9KVxuXG4gIGNvbnN0IHRhcmdldFZhck5vZGVJZCA9ICgoKSA9PiB7XG4gICAgaWYgKGlzSW5TdGFydE5vZGVTeXNWYXIpXG4gICAgICByZXR1cm4gc3RhcnROb2RlPy5pZFxuICAgIGlmIChpc0dsb2JhbClcbiAgICAgIHJldHVybiAnZ2xvYmFsJ1xuICAgIGlmIChpc0luTm9kZVJhZ1ZhcmlhYmxlKVxuICAgICAgcmV0dXJuIHZhbHVlU2VsZWN0b3JbMV1cbiAgICByZXR1cm4gdmFsdWVTZWxlY3RvclswXVxuICB9KSgpXG4gIGNvbnN0IHRhcmdldFZhciA9IGJlZm9yZU5vZGVzT3V0cHV0VmFycy5maW5kKFxuICAgIHYgPT4gdi5ub2RlSWQgPT09IHRhcmdldFZhck5vZGVJZCxcbiAgKVxuXG4gIGlmICghdGFyZ2V0VmFyKVxuICAgIHJldHVybiBWYXJUeXBlLnN0cmluZ1xuXG4gIGxldCB0eXBlOiBWYXJUeXBlID0gVmFyVHlwZS5zdHJpbmdcbiAgbGV0IGN1cnI6IGFueSA9IHRhcmdldFZhci52YXJzXG5cbiAgaWYgKGlzSW5TdGFydE5vZGVTeXNWYXIgfHwgaXNFbnYgfHwgaXNDaGF0VmFyIHx8IGlzU2hhcmVkUmFnVmFyaWFibGUgfHwgaXNHbG9iYWwpIHtcbiAgICByZXR1cm4gY3Vyci5maW5kKFxuICAgICAgKHY6IGFueSkgPT4gdi52YXJpYWJsZSA9PT0gKHZhbHVlU2VsZWN0b3IgYXMgVmFsdWVTZWxlY3Rvcikuam9pbignLicpLFxuICAgICk/LnR5cGVcbiAgfVxuICBlbHNlIHtcbiAgICBjb25zdCB0YXJnZXRWYXIgPSBjdXJyLmZpbmQoKHY6IGFueSkgPT4ge1xuICAgICAgaWYgKGlzSW5Ob2RlUmFnVmFyaWFibGUpXG4gICAgICAgIHJldHVybiB2LnZhcmlhYmxlID09PSB2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKVxuICAgICAgcmV0dXJuIHYudmFyaWFibGUgPT09IHZhbHVlU2VsZWN0b3JbMV1cbiAgICB9KVxuICAgIGlmICghdGFyZ2V0VmFyKVxuICAgICAgcmV0dXJuIFZhclR5cGUuc3RyaW5nXG5cbiAgICBpZiAoaXNJbk5vZGVSYWdWYXJpYWJsZSlcbiAgICAgIHJldHVybiB0YXJnZXRWYXIudHlwZVxuXG4gICAgY29uc3QgaXNTdHJ1Y3R1cmVkT3V0cHV0VmFyID0gISF0YXJnZXRWYXIuY2hpbGRyZW4/LnNjaGVtYT8ucHJvcGVydGllc1xuICAgIGlmIChpc1N0cnVjdHVyZWRPdXRwdXRWYXIpIHtcbiAgICAgIGlmICh2YWx1ZVNlbGVjdG9yLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAvLyByb290XG4gICAgICAgIHJldHVybiBwcmVmZXJTY2hlbWFUeXBlICYmIHRhcmdldFZhci5zY2hlbWFUeXBlXG4gICAgICAgICAgPyB0YXJnZXRWYXIuc2NoZW1hVHlwZVxuICAgICAgICAgIDogVmFyVHlwZS5vYmplY3RcbiAgICAgIH1cbiAgICAgIGxldCBjdXJyUHJvcGVydGllcyA9IHRhcmdldFZhci5jaGlsZHJlbi5zY2hlbWE7XG4gICAgICAodmFsdWVTZWxlY3RvciBhcyBWYWx1ZVNlbGVjdG9yKS5zbGljZSgyKS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gdmFsdWVTZWxlY3Rvci5sZW5ndGggLSAzXG4gICAgICAgIGlmICghY3VyclByb3BlcnRpZXMpXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgY3VyclByb3BlcnRpZXMgPSBjdXJyUHJvcGVydGllcy5wcm9wZXJ0aWVzW2tleV1cbiAgICAgICAgaWYgKGlzTGFzdClcbiAgICAgICAgICB0eXBlID0gc3RydWN0VHlwZVRvVmFyVHlwZShjdXJyUHJvcGVydGllcz8udHlwZSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gdHlwZVxuICAgIH1cblxuICAgICh2YWx1ZVNlbGVjdG9yIGFzIFZhbHVlU2VsZWN0b3IpLnNsaWNlKDEpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gdmFsdWVTZWxlY3Rvci5sZW5ndGggLSAyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyKSlcbiAgICAgICAgY3VyciA9IGN1cnI/LmZpbmQoKHY6IGFueSkgPT4gdi52YXJpYWJsZSA9PT0ga2V5KVxuXG4gICAgICBpZiAoaXNMYXN0KSB7XG4gICAgICAgIHR5cGVcbiAgICAgICAgICA9IHByZWZlclNjaGVtYVR5cGUgJiYgY3Vycj8uc2NoZW1hVHlwZSA/IGN1cnI/LnNjaGVtYVR5cGUgOiBjdXJyPy50eXBlXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGN1cnI/LnR5cGUgPT09IFZhclR5cGUub2JqZWN0IHx8IGN1cnI/LnR5cGUgPT09IFZhclR5cGUuZmlsZSlcbiAgICAgICAgICBjdXJyID0gY3Vyci5jaGlsZHJlblxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHR5cGVcbiAgfVxufVxuXG4vLyBub2RlIG91dHB1dCB2YXJzICsgcGFyZW50IGlubmVyIHZhcnMoaWYgaW4gaXRlcmF0aW9uIG9yIG90aGVyIHdyYXAgbm9kZSlcbmV4cG9ydCBjb25zdCB0b05vZGVBdmFpbGFibGVWYXJzID0gKHtcbiAgcGFyZW50Tm9kZSxcbiAgdCxcbiAgYmVmb3JlTm9kZXMsXG4gIGlzQ2hhdE1vZGUsXG4gIGVudmlyb25tZW50VmFyaWFibGVzLFxuICBjb252ZXJzYXRpb25WYXJpYWJsZXMsXG4gIHJhZ1ZhcmlhYmxlcyxcbiAgZmlsdGVyVmFyLFxuICBhbGxQbHVnaW5JbmZvTGlzdCxcbiAgc2NoZW1hVHlwZURlZmluaXRpb25zLFxufToge1xuICBwYXJlbnROb2RlPzogTm9kZSB8IG51bGxcbiAgdD86IGFueVxuICAvLyB0byBnZXQgdGhvc2Ugbm9kZXMgb3V0cHV0IHZhcnNcbiAgYmVmb3JlTm9kZXM6IE5vZGVbXVxuICBpc0NoYXRNb2RlOiBib29sZWFuXG4gIC8vIGVudlxuICBlbnZpcm9ubWVudFZhcmlhYmxlcz86IEVudmlyb25tZW50VmFyaWFibGVbXVxuICAvLyBjaGF0IHZhclxuICBjb252ZXJzYXRpb25WYXJpYWJsZXM/OiBDb252ZXJzYXRpb25WYXJpYWJsZVtdXG4gIC8vIHJhZyB2YXJpYWJsZXNcbiAgcmFnVmFyaWFibGVzPzogUkFHUGlwZWxpbmVWYXJpYWJsZVtdXG4gIGZpbHRlclZhcjogKHBheWxvYWQ6IFZhciwgc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IGJvb2xlYW5cbiAgYWxsUGx1Z2luSW5mb0xpc3Q6IFJlY29yZDxzdHJpbmcsIFRvb2xXaXRoUHJvdmlkZXJbXT5cbiAgc2NoZW1hVHlwZURlZmluaXRpb25zPzogU2NoZW1hVHlwZURlZmluaXRpb25bXVxufSk6IE5vZGVPdXRQdXRWYXJbXSA9PiB7XG4gIGNvbnN0IGJlZm9yZU5vZGVzT3V0cHV0VmFycyA9IHRvTm9kZU91dHB1dFZhcnMoXG4gICAgYmVmb3JlTm9kZXMsXG4gICAgaXNDaGF0TW9kZSxcbiAgICBmaWx0ZXJWYXIsXG4gICAgZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgY29udmVyc2F0aW9uVmFyaWFibGVzLFxuICAgIHJhZ1ZhcmlhYmxlcyxcbiAgICBhbGxQbHVnaW5JbmZvTGlzdCxcbiAgICBzY2hlbWFUeXBlRGVmaW5pdGlvbnMsXG4gIClcbiAgY29uc3QgaXNJbkl0ZXJhdGlvbiA9IHBhcmVudE5vZGU/LmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvblxuICBpZiAoaXNJbkl0ZXJhdGlvbikge1xuICAgIGNvbnN0IGl0ZXJhdGlvbk5vZGU6IGFueSA9IHBhcmVudE5vZGVcbiAgICBjb25zdCBpdGVtVHlwZSA9IGdldFZhclR5cGUoe1xuICAgICAgcGFyZW50Tm9kZTogaXRlcmF0aW9uTm9kZSxcbiAgICAgIGlzSXRlcmF0aW9uSXRlbTogdHJ1ZSxcbiAgICAgIHZhbHVlU2VsZWN0b3I6IGl0ZXJhdGlvbk5vZGU/LmRhdGEuaXRlcmF0b3Jfc2VsZWN0b3IgfHwgW10sXG4gICAgICBhdmFpbGFibGVOb2RlczogYmVmb3JlTm9kZXMsXG4gICAgICBpc0NoYXRNb2RlLFxuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICBjb252ZXJzYXRpb25WYXJpYWJsZXMsXG4gICAgICBhbGxQbHVnaW5JbmZvTGlzdCxcbiAgICAgIHNjaGVtYVR5cGVEZWZpbml0aW9ucyxcbiAgICB9KVxuICAgIGNvbnN0IGl0ZW1DaGlsZHJlblxuICAgICAgPSBpdGVtVHlwZSA9PT0gVmFyVHlwZS5maWxlXG4gICAgICAgID8ge1xuICAgICAgICAgICAgY2hpbGRyZW46IE9VVFBVVF9GSUxFX1NVQl9WQVJJQUJMRVMubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZToga2V5LFxuICAgICAgICAgICAgICAgIHR5cGU6IGtleSA9PT0gJ3NpemUnID8gVmFyVHlwZS5udW1iZXIgOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfVxuICAgICAgICA6IHt9XG4gICAgY29uc3QgaXRlcmF0aW9uVmFyID0ge1xuICAgICAgbm9kZUlkOiBpdGVyYXRpb25Ob2RlPy5pZCxcbiAgICAgIHRpdGxlOiB0KCdub2Rlcy5pdGVyYXRpb24uY3VycmVudEl0ZXJhdGlvbicsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB2YXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB2YXJpYWJsZTogJ2l0ZW0nLFxuICAgICAgICAgIHR5cGU6IGl0ZW1UeXBlLFxuICAgICAgICAgIC4uLml0ZW1DaGlsZHJlbixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHZhcmlhYmxlOiAnaW5kZXgnLFxuICAgICAgICAgIHR5cGU6IFZhclR5cGUubnVtYmVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9XG4gICAgY29uc3QgaXRlcmF0aW9uSW5kZXggPSBiZWZvcmVOb2Rlc091dHB1dFZhcnMuZmluZEluZGV4KFxuICAgICAgdiA9PiB2Lm5vZGVJZCA9PT0gaXRlcmF0aW9uTm9kZT8uaWQsXG4gICAgKVxuICAgIGlmIChpdGVyYXRpb25JbmRleCA+IC0xKVxuICAgICAgYmVmb3JlTm9kZXNPdXRwdXRWYXJzLnNwbGljZShpdGVyYXRpb25JbmRleCwgMSlcbiAgICBiZWZvcmVOb2Rlc091dHB1dFZhcnMudW5zaGlmdChpdGVyYXRpb25WYXIpXG4gIH1cbiAgcmV0dXJuIGJlZm9yZU5vZGVzT3V0cHV0VmFyc1xufVxuXG5leHBvcnQgY29uc3QgZ2V0Tm9kZUluZm9CeUlkID0gKG5vZGVzOiBhbnksIGlkOiBzdHJpbmcpID0+IHtcbiAgaWYgKCFpc0FycmF5KG5vZGVzKSlcbiAgICByZXR1cm5cbiAgcmV0dXJuIG5vZGVzLmZpbmQoKG5vZGU6IGFueSkgPT4gbm9kZS5pZCA9PT0gaWQpXG59XG5cbmNvbnN0IG1hdGNoTm90U3lzdGVtVmFycyA9IChwcm9tcHRzOiBzdHJpbmdbXSkgPT4ge1xuICBpZiAoIXByb21wdHMpXG4gICAgcmV0dXJuIFtdXG5cbiAgY29uc3QgYWxsVmFyczogc3RyaW5nW10gPSBbXVxuICBwcm9tcHRzLmZvckVhY2goKHByb21wdCkgPT4ge1xuICAgIFZBUl9SRUdFWC5sYXN0SW5kZXggPSAwXG4gICAgaWYgKHR5cGVvZiBwcm9tcHQgIT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuXG4gICAgYWxsVmFycy5wdXNoKC4uLihwcm9tcHQubWF0Y2goVkFSX1JFR0VYKSB8fCBbXSkpXG4gIH0pXG4gIGNvbnN0IHVuaXFWYXJzID0gdW5pcShhbGxWYXJzKS5tYXAodiA9PlxuICAgIHYucmVwbGFjZUFsbCgne3sjJywgJycpLnJlcGxhY2UoJyN9fScsICcnKS5zcGxpdCgnLicpLFxuICApXG4gIHJldHVybiB1bmlxVmFyc1xufVxuXG5jb25zdCByZXBsYWNlT2xkVmFySW5UZXh0ID0gKFxuICB0ZXh0OiBzdHJpbmcsXG4gIG9sZFZhcjogVmFsdWVTZWxlY3RvcixcbiAgbmV3VmFyOiBWYWx1ZVNlbGVjdG9yLFxuKSA9PiB7XG4gIGlmICghdGV4dCB8fCB0eXBlb2YgdGV4dCAhPT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIHRleHRcblxuICBpZiAoIW5ld1ZhciB8fCBuZXdWYXIubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0ZXh0XG5cbiAgcmV0dXJuIHRleHQucmVwbGFjZUFsbChcbiAgICBge3sjJHtvbGRWYXIuam9pbignLicpfSN9fWAsXG4gICAgYHt7IyR7bmV3VmFyLmpvaW4oJy4nKX0jfX1gLFxuICApXG59XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlVXNlZFZhcnMgPSAobm9kZTogTm9kZSk6IFZhbHVlU2VsZWN0b3JbXSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gbm9kZVxuICBjb25zdCB7IHR5cGUgfSA9IGRhdGFcbiAgbGV0IHJlczogVmFsdWVTZWxlY3RvcltdID0gW11cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBCbG9ja0VudW0uRW5kOiB7XG4gICAgICByZXMgPSAoZGF0YSBhcyBFbmROb2RlVHlwZSkub3V0cHV0cz8ubWFwKChvdXRwdXQpID0+IHtcbiAgICAgICAgcmV0dXJuIG91dHB1dC52YWx1ZV9zZWxlY3RvclxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLkFuc3dlcjoge1xuICAgICAgcmVzID0gbWF0Y2hOb3RTeXN0ZW1WYXJzKFsoZGF0YSBhcyBBbnN3ZXJOb2RlVHlwZSkuYW5zd2VyXSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLkxMTToge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgTExNTm9kZVR5cGVcbiAgICAgIGNvbnN0IGlzQ2hhdE1vZGVsID0gcGF5bG9hZC5tb2RlbD8ubW9kZSA9PT0gQXBwTW9kZUVudW0uQ0hBVFxuICAgICAgbGV0IHByb21wdHM6IHN0cmluZ1tdID0gW11cbiAgICAgIGlmIChpc0NoYXRNb2RlbCkge1xuICAgICAgICBwcm9tcHRzXG4gICAgICAgICAgPSAocGF5bG9hZC5wcm9tcHRfdGVtcGxhdGUgYXMgUHJvbXB0SXRlbVtdKT8ubWFwKHAgPT4gcC50ZXh0KSB8fCBbXVxuICAgICAgICBpZiAocGF5bG9hZC5tZW1vcnk/LnF1ZXJ5X3Byb21wdF90ZW1wbGF0ZSlcbiAgICAgICAgICBwcm9tcHRzLnB1c2gocGF5bG9hZC5tZW1vcnkucXVlcnlfcHJvbXB0X3RlbXBsYXRlKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHByb21wdHMgPSBbKHBheWxvYWQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW0pLnRleHRdXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlucHV0VmFyczogVmFsdWVTZWxlY3RvcltdID0gbWF0Y2hOb3RTeXN0ZW1WYXJzKHByb21wdHMpXG4gICAgICBjb25zdCBjb250ZXh0VmFyID0gKGRhdGEgYXMgTExNTm9kZVR5cGUpLmNvbnRleHQ/LnZhcmlhYmxlX3NlbGVjdG9yXG4gICAgICAgID8gWyhkYXRhIGFzIExMTU5vZGVUeXBlKS5jb250ZXh0Py52YXJpYWJsZV9zZWxlY3Rvcl1cbiAgICAgICAgOiBbXVxuICAgICAgcmVzID0gWy4uLmlucHV0VmFycywgLi4uY29udGV4dFZhcl1cbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLktub3dsZWRnZVJldHJpZXZhbDoge1xuICAgICAgY29uc3Qge1xuICAgICAgICBxdWVyeV92YXJpYWJsZV9zZWxlY3RvcixcbiAgICAgICAgcXVlcnlfYXR0YWNobWVudF9zZWxlY3RvciA9IFtdLFxuICAgICAgfSA9IGRhdGEgYXMgS25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGVcbiAgICAgIHJlcyA9IFtxdWVyeV92YXJpYWJsZV9zZWxlY3RvciwgcXVlcnlfYXR0YWNobWVudF9zZWxlY3Rvcl1cbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLklmRWxzZToge1xuICAgICAgcmVzID0gW11cbiAgICAgIHJlcy5wdXNoKFxuICAgICAgICAuLi4oKGRhdGEgYXMgSWZFbHNlTm9kZVR5cGUpLmNhc2VzIHx8IFtdKVxuICAgICAgICAgIC5mbGF0TWFwKGMgPT4gYy5jb25kaXRpb25zIHx8IFtdKVxuICAgICAgICAgIC5mbGF0TWFwKChjKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RvcnM6IFZhbHVlU2VsZWN0b3JbXSA9IFtdXG4gICAgICAgICAgICBpZiAoYy52YXJpYWJsZV9zZWxlY3RvcilcbiAgICAgICAgICAgICAgc2VsZWN0b3JzLnB1c2goYy52YXJpYWJsZV9zZWxlY3RvcilcbiAgICAgICAgICAgIC8vIEhhbmRsZSBzdWItdmFyaWFibGUgY29uZGl0aW9uc1xuICAgICAgICAgICAgaWYgKGMuc3ViX3ZhcmlhYmxlX2NvbmRpdGlvbiAmJiBjLnN1Yl92YXJpYWJsZV9jb25kaXRpb24uY29uZGl0aW9ucykge1xuICAgICAgICAgICAgICBzZWxlY3RvcnMucHVzaChcbiAgICAgICAgICAgICAgICAuLi5jLnN1Yl92YXJpYWJsZV9jb25kaXRpb24uY29uZGl0aW9uc1xuICAgICAgICAgICAgICAgICAgLm1hcChzdWJDID0+IHN1YkMudmFyaWFibGVfc2VsZWN0b3IgfHwgW10pXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKHNlbCA9PiBzZWwubGVuZ3RoID4gMCksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcnNcbiAgICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLkNvZGU6IHtcbiAgICAgIHJlcyA9IChkYXRhIGFzIENvZGVOb2RlVHlwZSkudmFyaWFibGVzPy5tYXAoKHYpID0+IHtcbiAgICAgICAgcmV0dXJuIHYudmFsdWVfc2VsZWN0b3JcbiAgICAgIH0pXG4gICAgICBicmVha1xuICAgIH1cbiAgICBjYXNlIEJsb2NrRW51bS5UZW1wbGF0ZVRyYW5zZm9ybToge1xuICAgICAgcmVzID0gKGRhdGEgYXMgVGVtcGxhdGVUcmFuc2Zvcm1Ob2RlVHlwZSkudmFyaWFibGVzPy5tYXAoKHY6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdi52YWx1ZV9zZWxlY3RvclxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLlF1ZXN0aW9uQ2xhc3NpZmllcjoge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgUXVlc3Rpb25DbGFzc2lmaWVyTm9kZVR5cGVcbiAgICAgIHJlcyA9IFtwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yXVxuICAgICAgY29uc3QgdmFySW5JbnN0cnVjdGlvbnMgPSBtYXRjaE5vdFN5c3RlbVZhcnMoW3BheWxvYWQuaW5zdHJ1Y3Rpb24gfHwgJyddKVxuICAgICAgcmVzLnB1c2goLi4udmFySW5JbnN0cnVjdGlvbnMpXG5cbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBwYXlsb2FkLmNsYXNzZXMubWFwKGMgPT4gYy5uYW1lKVxuICAgICAgcmVzLnB1c2goLi4ubWF0Y2hOb3RTeXN0ZW1WYXJzKGNsYXNzZXMpKVxuICAgICAgYnJlYWtcbiAgICB9XG4gICAgY2FzZSBCbG9ja0VudW0uSHR0cFJlcXVlc3Q6IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIEh0dHBOb2RlVHlwZVxuICAgICAgcmVzID0gbWF0Y2hOb3RTeXN0ZW1WYXJzKFtcbiAgICAgICAgcGF5bG9hZC51cmwsXG4gICAgICAgIHBheWxvYWQuaGVhZGVycyxcbiAgICAgICAgcGF5bG9hZC5wYXJhbXMsXG4gICAgICAgIHR5cGVvZiBwYXlsb2FkLmJvZHkuZGF0YSA9PT0gJ3N0cmluZydcbiAgICAgICAgICA/IHBheWxvYWQuYm9keS5kYXRhXG4gICAgICAgICAgOiBwYXlsb2FkLmJvZHkuZGF0YS5tYXAoZCA9PiBkLnZhbHVlKS5qb2luKCcnKSxcbiAgICAgIF0pXG4gICAgICBicmVha1xuICAgIH1cbiAgICBjYXNlIEJsb2NrRW51bS5Ub29sOiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBUb29sTm9kZVR5cGVcbiAgICAgIGNvbnN0IG1peFZhcnMgPSBtYXRjaE5vdFN5c3RlbVZhcnMoXG4gICAgICAgIE9iamVjdC5rZXlzKHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzKVxuICAgICAgICAgID8uZmlsdGVyKFxuICAgICAgICAgICAga2V5ID0+IHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzW2tleV0udHlwZSA9PT0gVG9vbFZhclR5cGUubWl4ZWQsXG4gICAgICAgICAgKVxuICAgICAgICAgIC5tYXAoa2V5ID0+IHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzW2tleV0udmFsdWUpIGFzIHN0cmluZ1tdLFxuICAgICAgKVxuICAgICAgY29uc3QgdmFyc1xuICAgICAgICA9IE9iamVjdC5rZXlzKHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzKVxuICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICBrZXkgPT4gcGF5bG9hZC50b29sX3BhcmFtZXRlcnNba2V5XS50eXBlID09PSBUb29sVmFyVHlwZS52YXJpYWJsZSxcbiAgICAgICAgICApXG4gICAgICAgICAgLm1hcChrZXkgPT4gcGF5bG9hZC50b29sX3BhcmFtZXRlcnNba2V5XS52YWx1ZSBhcyBzdHJpbmcpIHx8IFtdXG4gICAgICByZXMgPSBbLi4uKG1peFZhcnMgYXMgVmFsdWVTZWxlY3RvcltdKSwgLi4uKHZhcnMgYXMgYW55KV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLkRhdGFTb3VyY2U6IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIERhdGFTb3VyY2VOb2RlVHlwZVxuICAgICAgY29uc3QgbWl4VmFycyA9IG1hdGNoTm90U3lzdGVtVmFycyhcbiAgICAgICAgT2JqZWN0LmtleXMocGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnMpXG4gICAgICAgICAgPy5maWx0ZXIoXG4gICAgICAgICAgICBrZXkgPT5cbiAgICAgICAgICAgICAgcGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnNba2V5XS50eXBlID09PSBUb29sVmFyVHlwZS5taXhlZCxcbiAgICAgICAgICApXG4gICAgICAgICAgLm1hcChrZXkgPT4gcGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnNba2V5XS52YWx1ZSkgYXMgc3RyaW5nW10sXG4gICAgICApXG4gICAgICBjb25zdCB2YXJzXG4gICAgICAgID0gT2JqZWN0LmtleXMocGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnMpXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgIGtleSA9PlxuICAgICAgICAgICAgICBwYXlsb2FkLmRhdGFzb3VyY2VfcGFyYW1ldGVyc1trZXldLnR5cGUgPT09IFRvb2xWYXJUeXBlLnZhcmlhYmxlLFxuICAgICAgICAgIClcbiAgICAgICAgICAubWFwKGtleSA9PiBwYXlsb2FkLmRhdGFzb3VyY2VfcGFyYW1ldGVyc1trZXldLnZhbHVlIGFzIHN0cmluZylcbiAgICAgICAgICB8fCBbXVxuICAgICAgcmVzID0gWy4uLihtaXhWYXJzIGFzIFZhbHVlU2VsZWN0b3JbXSksIC4uLih2YXJzIGFzIGFueSldXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXI6IHtcbiAgICAgIHJlcyA9IChkYXRhIGFzIFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZSk/LnZhcmlhYmxlc1xuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3I6IHtcbiAgICAgIHJlcyA9IChkYXRhIGFzIFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZSk/LnZhcmlhYmxlc1xuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5QYXJhbWV0ZXJFeHRyYWN0b3I6IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIFBhcmFtZXRlckV4dHJhY3Rvck5vZGVUeXBlXG4gICAgICByZXMgPSBbcGF5bG9hZC5xdWVyeV1cbiAgICAgIGNvbnN0IHZhckluSW5zdHJ1Y3Rpb25zID0gbWF0Y2hOb3RTeXN0ZW1WYXJzKFtwYXlsb2FkLmluc3RydWN0aW9uIHx8ICcnXSlcbiAgICAgIHJlcy5wdXNoKC4uLnZhckluSW5zdHJ1Y3Rpb25zKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5JdGVyYXRpb246IHtcbiAgICAgIHJlcyA9IFsoZGF0YSBhcyBJdGVyYXRpb25Ob2RlVHlwZSkuaXRlcmF0b3Jfc2VsZWN0b3JdXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkxvb3A6IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIExvb3BOb2RlVHlwZVxuICAgICAgcmVzXG4gICAgICAgID0gcGF5bG9hZC5icmVha19jb25kaXRpb25zPy5tYXAoKGMpID0+IHtcbiAgICAgICAgICByZXR1cm4gYy52YXJpYWJsZV9zZWxlY3RvciB8fCBbXVxuICAgICAgICB9KSB8fCBbXVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5MaXN0RmlsdGVyOiB7XG4gICAgICByZXMgPSBbKGRhdGEgYXMgTGlzdEZpbHRlck5vZGVUeXBlKS52YXJpYWJsZV1cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uQWdlbnQ6IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIEFnZW50Tm9kZVR5cGVcbiAgICAgIGNvbnN0IHZhbHVlU2VsZWN0b3JzOiBWYWx1ZVNlbGVjdG9yW10gPSBbXVxuICAgICAgaWYgKCFwYXlsb2FkLmFnZW50X3BhcmFtZXRlcnMpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIE9iamVjdC5rZXlzKHBheWxvYWQuYWdlbnRfcGFyYW1ldGVycyB8fCB7fSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgdmFsdWUgfSA9IHBheWxvYWQuYWdlbnRfcGFyYW1ldGVycyFba2V5XVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJylcbiAgICAgICAgICB2YWx1ZVNlbGVjdG9ycy5wdXNoKC4uLm1hdGNoTm90U3lzdGVtVmFycyhbdmFsdWVdKSlcbiAgICAgIH0pXG4gICAgICByZXMgPSB2YWx1ZVNlbGVjdG9yc1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcyB8fCBbXVxufVxuXG4vLyBjYW4gYmUgdXNlZCBpbiBpdGVyYXRpb24gbm9kZVxuZXhwb3J0IGNvbnN0IGdldE5vZGVVc2VkVmFyUGFzc1RvU2VydmVyS2V5ID0gKFxuICBub2RlOiBOb2RlLFxuICB2YWx1ZVNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yLFxuKTogc3RyaW5nIHwgc3RyaW5nW10gPT4ge1xuICBjb25zdCB7IGRhdGEgfSA9IG5vZGVcbiAgY29uc3QgeyB0eXBlIH0gPSBkYXRhXG4gIGxldCByZXM6IHN0cmluZyB8IHN0cmluZ1tdID0gJydcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBCbG9ja0VudW0uTExNOiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBMTE1Ob2RlVHlwZVxuICAgICAgcmVzID0gW2AjJHt2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKX0jYF1cbiAgICAgIGlmIChcbiAgICAgICAgcGF5bG9hZC5jb250ZXh0Py52YXJpYWJsZV9zZWxlY3Rvci5qb2luKCcuJykgPT09IHZhbHVlU2VsZWN0b3Iuam9pbignLicpXG4gICAgICApXG4gICAgICAgIHJlcy5wdXNoKCcjY29udGV4dCMnKVxuXG4gICAgICBicmVha1xuICAgIH1cbiAgICBjYXNlIEJsb2NrRW51bS5Lbm93bGVkZ2VSZXRyaWV2YWw6IHtcbiAgICAgIHJlcyA9ICdxdWVyeSdcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLklmRWxzZToge1xuICAgICAgY29uc3QgZmluZENvbmRpdGlvbkluQ2FzZXMgPSAoY2FzZXM6IENhc2VJdGVtW10pOiBDb25kaXRpb24gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGNhc2VJdGVtIG9mIGNhc2VzKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBjb25kaXRpb24gb2YgY2FzZUl0ZW0uY29uZGl0aW9ucyB8fCBbXSkge1xuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbi52YXJpYWJsZV9zZWxlY3Rvcj8uam9pbignLicpID09PSB2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKSlcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbmRpdGlvblxuXG4gICAgICAgICAgICBpZiAoY29uZGl0aW9uLnN1Yl92YXJpYWJsZV9jb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgY29uc3QgZm91bmQgPSBmaW5kQ29uZGl0aW9uSW5DYXNlcyhbY29uZGl0aW9uLnN1Yl92YXJpYWJsZV9jb25kaXRpb25dKVxuICAgICAgICAgICAgICBpZiAoZm91bmQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRhcmdldFZhciA9IGZpbmRDb25kaXRpb25JbkNhc2VzKChkYXRhIGFzIElmRWxzZU5vZGVUeXBlKS5jYXNlcyB8fCBbXSlcbiAgICAgIGlmICh0YXJnZXRWYXIpXG4gICAgICAgIHJlcyA9IGAjJHt2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKX0jYFxuICAgICAgYnJlYWtcbiAgICB9XG4gICAgY2FzZSBCbG9ja0VudW0uQ29kZToge1xuICAgICAgY29uc3QgdGFyZ2V0VmFyID0gKGRhdGEgYXMgQ29kZU5vZGVUeXBlKS52YXJpYWJsZXM/LmZpbmQoXG4gICAgICAgIHYgPT5cbiAgICAgICAgICBBcnJheS5pc0FycmF5KHYudmFsdWVfc2VsZWN0b3IpXG4gICAgICAgICAgJiYgdi52YWx1ZV9zZWxlY3RvclxuICAgICAgICAgICYmIHYudmFsdWVfc2VsZWN0b3Iuam9pbignLicpID09PSB2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKSxcbiAgICAgIClcbiAgICAgIGlmICh0YXJnZXRWYXIpXG4gICAgICAgIHJlcyA9IHRhcmdldFZhci52YXJpYWJsZVxuICAgICAgYnJlYWtcbiAgICB9XG4gICAgY2FzZSBCbG9ja0VudW0uVGVtcGxhdGVUcmFuc2Zvcm06IHtcbiAgICAgIGNvbnN0IHRhcmdldFZhciA9IChkYXRhIGFzIFRlbXBsYXRlVHJhbnNmb3JtTm9kZVR5cGUpLnZhcmlhYmxlcz8uZmluZChcbiAgICAgICAgdiA9PlxuICAgICAgICAgIEFycmF5LmlzQXJyYXkodi52YWx1ZV9zZWxlY3RvcilcbiAgICAgICAgICAmJiB2LnZhbHVlX3NlbGVjdG9yXG4gICAgICAgICAgJiYgdi52YWx1ZV9zZWxlY3Rvci5qb2luKCcuJykgPT09IHZhbHVlU2VsZWN0b3Iuam9pbignLicpLFxuICAgICAgKVxuICAgICAgaWYgKHRhcmdldFZhcilcbiAgICAgICAgcmVzID0gdGFyZ2V0VmFyLnZhcmlhYmxlXG4gICAgICBicmVha1xuICAgIH1cbiAgICBjYXNlIEJsb2NrRW51bS5RdWVzdGlvbkNsYXNzaWZpZXI6IHtcbiAgICAgIHJlcyA9ICdxdWVyeSdcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgQmxvY2tFbnVtLkh0dHBSZXF1ZXN0OiB7XG4gICAgICByZXMgPSBgIyR7dmFsdWVTZWxlY3Rvci5qb2luKCcuJyl9I2BcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uVG9vbDoge1xuICAgICAgcmVzID0gYCMke3ZhbHVlU2VsZWN0b3Iuam9pbignLicpfSNgXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXI6IHtcbiAgICAgIHJlcyA9IGAjJHt2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKX0jYFxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3I6IHtcbiAgICAgIHJlcyA9IGAjJHt2YWx1ZVNlbGVjdG9yLmpvaW4oJy4nKX0jYFxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5QYXJhbWV0ZXJFeHRyYWN0b3I6IHtcbiAgICAgIHJlcyA9ICdxdWVyeSdcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmRVc2VkVmFyTm9kZXMgPSAoXG4gIHZhclNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yLFxuICBhdmFpbGFibGVOb2RlczogTm9kZVtdLFxuKTogTm9kZVtdID0+IHtcbiAgY29uc3QgcmVzOiBOb2RlW10gPSBbXVxuICBhdmFpbGFibGVOb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgY29uc3QgdmFycyA9IGdldE5vZGVVc2VkVmFycyhub2RlKVxuICAgIGlmICh2YXJzLmZpbmQodiA9PiB2LmpvaW4oJy4nKSA9PT0gdmFyU2VsZWN0b3Iuam9pbignLicpKSlcbiAgICAgIHJlcy5wdXNoKG5vZGUpXG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZU5vZGVWYXJzID0gKFxuICBvbGROb2RlOiBOb2RlLFxuICBvbGRWYXJTZWxlY3RvcjogVmFsdWVTZWxlY3RvcixcbiAgbmV3VmFyU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IsXG4pOiBOb2RlID0+IHtcbiAgY29uc3QgbmV3Tm9kZSA9IHByb2R1Y2Uob2xkTm9kZSwgKGRyYWZ0OiBhbnkpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGRyYWZ0XG4gICAgY29uc3QgeyB0eXBlIH0gPSBkYXRhXG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgQmxvY2tFbnVtLkVuZDoge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBFbmROb2RlVHlwZVxuICAgICAgICBpZiAocGF5bG9hZC5vdXRwdXRzKSB7XG4gICAgICAgICAgcGF5bG9hZC5vdXRwdXRzID0gcGF5bG9hZC5vdXRwdXRzLm1hcCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LnZhbHVlX3NlbGVjdG9yLmpvaW4oJy4nKSA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpKVxuICAgICAgICAgICAgICBvdXRwdXQudmFsdWVfc2VsZWN0b3IgPSBuZXdWYXJTZWxlY3RvclxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgQmxvY2tFbnVtLkFuc3dlcjoge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBBbnN3ZXJOb2RlVHlwZVxuICAgICAgICBpZiAocGF5bG9hZC52YXJpYWJsZXMpIHtcbiAgICAgICAgICBwYXlsb2FkLnZhcmlhYmxlcyA9IHBheWxvYWQudmFyaWFibGVzLm1hcCgodikgPT4ge1xuICAgICAgICAgICAgaWYgKHYudmFsdWVfc2VsZWN0b3Iuam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJykpXG4gICAgICAgICAgICAgIHYudmFsdWVfc2VsZWN0b3IgPSBuZXdWYXJTZWxlY3RvclxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIEJsb2NrRW51bS5MTE06IHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgTExNTm9kZVR5cGVcbiAgICAgICAgY29uc3QgaXNDaGF0TW9kZWwgPSBwYXlsb2FkLm1vZGVsPy5tb2RlID09PSBBcHBNb2RlRW51bS5DSEFUXG4gICAgICAgIGlmIChpc0NoYXRNb2RlbCkge1xuICAgICAgICAgIHBheWxvYWQucHJvbXB0X3RlbXBsYXRlID0gKFxuICAgICAgICAgICAgcGF5bG9hZC5wcm9tcHRfdGVtcGxhdGUgYXMgUHJvbXB0SXRlbVtdXG4gICAgICAgICAgKS5tYXAoKHByb21wdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucHJvbXB0LFxuICAgICAgICAgICAgICB0ZXh0OiByZXBsYWNlT2xkVmFySW5UZXh0KFxuICAgICAgICAgICAgICAgIHByb21wdC50ZXh0LFxuICAgICAgICAgICAgICAgIG9sZFZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIG5ld1ZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHBheWxvYWQubWVtb3J5Py5xdWVyeV9wcm9tcHRfdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHBheWxvYWQubWVtb3J5LnF1ZXJ5X3Byb21wdF90ZW1wbGF0ZSA9IHJlcGxhY2VPbGRWYXJJblRleHQoXG4gICAgICAgICAgICAgIHBheWxvYWQubWVtb3J5LnF1ZXJ5X3Byb21wdF90ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgb2xkVmFyU2VsZWN0b3IsXG4gICAgICAgICAgICAgIG5ld1ZhclNlbGVjdG9yLFxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBwYXlsb2FkLnByb21wdF90ZW1wbGF0ZSA9IHtcbiAgICAgICAgICAgIC4uLnBheWxvYWQucHJvbXB0X3RlbXBsYXRlLFxuICAgICAgICAgICAgdGV4dDogcmVwbGFjZU9sZFZhckluVGV4dChcbiAgICAgICAgICAgICAgKHBheWxvYWQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW0pLnRleHQsXG4gICAgICAgICAgICAgIG9sZFZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXlsb2FkLmNvbnRleHQ/LnZhcmlhYmxlX3NlbGVjdG9yPy5qb2luKCcuJylcbiAgICAgICAgICA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpXG4gICAgICAgICkge1xuICAgICAgICAgIHBheWxvYWQuY29udGV4dC52YXJpYWJsZV9zZWxlY3RvciA9IG5ld1ZhclNlbGVjdG9yXG4gICAgICAgIH1cblxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBCbG9ja0VudW0uS25vd2xlZGdlUmV0cmlldmFsOiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIEtub3dsZWRnZVJldHJpZXZhbE5vZGVUeXBlXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yLmpvaW4oJy4nKSA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpXG4gICAgICAgIClcbiAgICAgICAgICBwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yID0gbmV3VmFyU2VsZWN0b3JcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBheWxvYWQucXVlcnlfYXR0YWNobWVudF9zZWxlY3Rvcj8uam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJylcbiAgICAgICAgKVxuICAgICAgICAgIHBheWxvYWQucXVlcnlfYXR0YWNobWVudF9zZWxlY3RvciA9IG5ld1ZhclNlbGVjdG9yXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIEJsb2NrRW51bS5JZkVsc2U6IHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgSWZFbHNlTm9kZVR5cGVcbiAgICAgICAgaWYgKHBheWxvYWQuY2FzZXMpIHtcbiAgICAgICAgICBwYXlsb2FkLmNhc2VzID0gcGF5bG9hZC5jYXNlcy5tYXAoKGNhc2VJdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FzZUl0ZW0uY29uZGl0aW9ucykge1xuICAgICAgICAgICAgICBjYXNlSXRlbS5jb25kaXRpb25zID0gY2FzZUl0ZW0uY29uZGl0aW9ucy5tYXAoKGMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYy52YXJpYWJsZV9zZWxlY3Rvcj8uam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJykpXG4gICAgICAgICAgICAgICAgICBjLnZhcmlhYmxlX3NlbGVjdG9yID0gbmV3VmFyU2VsZWN0b3JcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgc3ViLXZhcmlhYmxlIGNvbmRpdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBjLnN1Yl92YXJpYWJsZV9jb25kaXRpb25cbiAgICAgICAgICAgICAgICAgICYmIGMuc3ViX3ZhcmlhYmxlX2NvbmRpdGlvbi5jb25kaXRpb25zXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjLnN1Yl92YXJpYWJsZV9jb25kaXRpb24uY29uZGl0aW9uc1xuICAgICAgICAgICAgICAgICAgICA9IGMuc3ViX3ZhcmlhYmxlX2NvbmRpdGlvbi5jb25kaXRpb25zLm1hcCgoc3ViQykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YkMudmFyaWFibGVfc2VsZWN0b3I/LmpvaW4oJy4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgPT09IG9sZFZhclNlbGVjdG9yLmpvaW4oJy4nKVxuICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViQy52YXJpYWJsZV9zZWxlY3RvciA9IG5ld1ZhclNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWJDXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FzZUl0ZW1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIEJsb2NrRW51bS5Db2RlOiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIENvZGVOb2RlVHlwZVxuICAgICAgICBpZiAocGF5bG9hZC52YXJpYWJsZXMpIHtcbiAgICAgICAgICBwYXlsb2FkLnZhcmlhYmxlcyA9IHBheWxvYWQudmFyaWFibGVzLm1hcCgodikgPT4ge1xuICAgICAgICAgICAgaWYgKHYudmFsdWVfc2VsZWN0b3Iuam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJykpXG4gICAgICAgICAgICAgIHYudmFsdWVfc2VsZWN0b3IgPSBuZXdWYXJTZWxlY3RvclxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIEJsb2NrRW51bS5UZW1wbGF0ZVRyYW5zZm9ybToge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBUZW1wbGF0ZVRyYW5zZm9ybU5vZGVUeXBlXG4gICAgICAgIGlmIChwYXlsb2FkLnZhcmlhYmxlcykge1xuICAgICAgICAgIHBheWxvYWQudmFyaWFibGVzID0gcGF5bG9hZC52YXJpYWJsZXMubWFwKCh2OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICh2LnZhbHVlX3NlbGVjdG9yLmpvaW4oJy4nKSA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpKVxuICAgICAgICAgICAgICB2LnZhbHVlX3NlbGVjdG9yID0gbmV3VmFyU2VsZWN0b3JcbiAgICAgICAgICAgIHJldHVybiB2XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBCbG9ja0VudW0uUXVlc3Rpb25DbGFzc2lmaWVyOiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIFF1ZXN0aW9uQ2xhc3NpZmllck5vZGVUeXBlXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yLmpvaW4oJy4nKSA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpXG4gICAgICAgIClcbiAgICAgICAgICBwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yID0gbmV3VmFyU2VsZWN0b3JcbiAgICAgICAgcGF5bG9hZC5pbnN0cnVjdGlvbiA9IHJlcGxhY2VPbGRWYXJJblRleHQoXG4gICAgICAgICAgcGF5bG9hZC5pbnN0cnVjdGlvbixcbiAgICAgICAgICBvbGRWYXJTZWxlY3RvcixcbiAgICAgICAgICBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBCbG9ja0VudW0uSHR0cFJlcXVlc3Q6IHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgSHR0cE5vZGVUeXBlXG4gICAgICAgIHBheWxvYWQudXJsID0gcmVwbGFjZU9sZFZhckluVGV4dChcbiAgICAgICAgICBwYXlsb2FkLnVybCxcbiAgICAgICAgICBvbGRWYXJTZWxlY3RvcixcbiAgICAgICAgICBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgKVxuICAgICAgICBwYXlsb2FkLmhlYWRlcnMgPSByZXBsYWNlT2xkVmFySW5UZXh0KFxuICAgICAgICAgIHBheWxvYWQuaGVhZGVycyxcbiAgICAgICAgICBvbGRWYXJTZWxlY3RvcixcbiAgICAgICAgICBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgKVxuICAgICAgICBwYXlsb2FkLnBhcmFtcyA9IHJlcGxhY2VPbGRWYXJJblRleHQoXG4gICAgICAgICAgcGF5bG9hZC5wYXJhbXMsXG4gICAgICAgICAgb2xkVmFyU2VsZWN0b3IsXG4gICAgICAgICAgbmV3VmFyU2VsZWN0b3IsXG4gICAgICAgIClcbiAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLmJvZHkuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBwYXlsb2FkLmJvZHkuZGF0YSA9IHJlcGxhY2VPbGRWYXJJblRleHQoXG4gICAgICAgICAgICBwYXlsb2FkLmJvZHkuZGF0YSxcbiAgICAgICAgICAgIG9sZFZhclNlbGVjdG9yLFxuICAgICAgICAgICAgbmV3VmFyU2VsZWN0b3IsXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHBheWxvYWQuYm9keS5kYXRhID0gcGF5bG9hZC5ib2R5LmRhdGEubWFwKChkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5kLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVwbGFjZU9sZFZhckluVGV4dChcbiAgICAgICAgICAgICAgICBkLnZhbHVlIHx8ICcnLFxuICAgICAgICAgICAgICAgIG9sZFZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIG5ld1ZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgQmxvY2tFbnVtLlRvb2w6IHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgVG9vbE5vZGVUeXBlXG4gICAgICAgIGNvbnN0IGhhc1Nob3VsZFJlbmFtZVZhciA9IE9iamVjdC5rZXlzKHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzKT8uZmlsdGVyKFxuICAgICAgICAgIGtleSA9PiBwYXlsb2FkLnRvb2xfcGFyYW1ldGVyc1trZXldLnR5cGUgIT09IFRvb2xWYXJUeXBlLmNvbnN0YW50LFxuICAgICAgICApXG4gICAgICAgIGlmIChoYXNTaG91bGRSZW5hbWVWYXIpIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhwYXlsb2FkLnRvb2xfcGFyYW1ldGVycykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzW2tleV1cbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gdmFsdWVcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdHlwZSA9PT0gVG9vbFZhclR5cGUudmFyaWFibGVcbiAgICAgICAgICAgICAgJiYgdmFsdWUudmFsdWUuam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBwYXlsb2FkLnRvb2xfcGFyYW1ldGVyc1trZXldID0ge1xuICAgICAgICAgICAgICAgIC4uLnZhbHVlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gVG9vbFZhclR5cGUubWl4ZWQpIHtcbiAgICAgICAgICAgICAgcGF5bG9hZC50b29sX3BhcmFtZXRlcnNba2V5XSA9IHtcbiAgICAgICAgICAgICAgICAuLi52YWx1ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwbGFjZU9sZFZhckluVGV4dChcbiAgICAgICAgICAgICAgICAgIHBheWxvYWQudG9vbF9wYXJhbWV0ZXJzW2tleV0udmFsdWUgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgb2xkVmFyU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBCbG9ja0VudW0uRGF0YVNvdXJjZToge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBEYXRhU291cmNlTm9kZVR5cGVcbiAgICAgICAgY29uc3QgaGFzU2hvdWxkUmVuYW1lVmFyID0gT2JqZWN0LmtleXMoXG4gICAgICAgICAgcGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnMsXG4gICAgICAgICk/LmZpbHRlcihcbiAgICAgICAgICBrZXkgPT5cbiAgICAgICAgICAgIHBheWxvYWQuZGF0YXNvdXJjZV9wYXJhbWV0ZXJzW2tleV0udHlwZSAhPT0gVG9vbFZhclR5cGUuY29uc3RhbnQsXG4gICAgICAgIClcbiAgICAgICAgaWYgKGhhc1Nob3VsZFJlbmFtZVZhcikge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHBheWxvYWQuZGF0YXNvdXJjZV9wYXJhbWV0ZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnNba2V5XVxuICAgICAgICAgICAgY29uc3QgeyB0eXBlIH0gPSB2YWx1ZVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0eXBlID09PSBUb29sVmFyVHlwZS52YXJpYWJsZVxuICAgICAgICAgICAgICAmJiB2YWx1ZS52YWx1ZS5qb2luKCcuJykgPT09IG9sZFZhclNlbGVjdG9yLmpvaW4oJy4nKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHBheWxvYWQuZGF0YXNvdXJjZV9wYXJhbWV0ZXJzW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgLi4udmFsdWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5ld1ZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSBUb29sVmFyVHlwZS5taXhlZCkge1xuICAgICAgICAgICAgICBwYXlsb2FkLmRhdGFzb3VyY2VfcGFyYW1ldGVyc1trZXldID0ge1xuICAgICAgICAgICAgICAgIC4uLnZhbHVlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXBsYWNlT2xkVmFySW5UZXh0KFxuICAgICAgICAgICAgICAgICAgcGF5bG9hZC5kYXRhc291cmNlX3BhcmFtZXRlcnNba2V5XS52YWx1ZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICBvbGRWYXJTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgIG5ld1ZhclNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIEJsb2NrRW51bS5WYXJpYWJsZUFzc2lnbmVyOiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIFZhcmlhYmxlQXNzaWduZXJOb2RlVHlwZVxuICAgICAgICBpZiAocGF5bG9hZC52YXJpYWJsZXMpIHtcbiAgICAgICAgICBwYXlsb2FkLnZhcmlhYmxlcyA9IHBheWxvYWQudmFyaWFibGVzLm1hcCgodikgPT4ge1xuICAgICAgICAgICAgaWYgKHYuam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJykpXG4gICAgICAgICAgICAgIHYgPSBuZXdWYXJTZWxlY3RvclxuICAgICAgICAgICAgcmV0dXJuIHZcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc29uYXJqcy9uby1kdXBsaWNhdGVkLWJyYW5jaGVzXG4gICAgICBjYXNlIEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3I6IHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGRhdGEgYXMgVmFyaWFibGVBc3NpZ25lck5vZGVUeXBlXG4gICAgICAgIGlmIChwYXlsb2FkLnZhcmlhYmxlcykge1xuICAgICAgICAgIHBheWxvYWQudmFyaWFibGVzID0gcGF5bG9hZC52YXJpYWJsZXMubWFwKCh2KSA9PiB7XG4gICAgICAgICAgICBpZiAodi5qb2luKCcuJykgPT09IG9sZFZhclNlbGVjdG9yLmpvaW4oJy4nKSlcbiAgICAgICAgICAgICAgdiA9IG5ld1ZhclNlbGVjdG9yXG4gICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgQmxvY2tFbnVtLlBhcmFtZXRlckV4dHJhY3Rvcjoge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBQYXJhbWV0ZXJFeHRyYWN0b3JOb2RlVHlwZVxuICAgICAgICBpZiAocGF5bG9hZC5xdWVyeS5qb2luKCcuJykgPT09IG9sZFZhclNlbGVjdG9yLmpvaW4oJy4nKSlcbiAgICAgICAgICBwYXlsb2FkLnF1ZXJ5ID0gbmV3VmFyU2VsZWN0b3JcbiAgICAgICAgcGF5bG9hZC5pbnN0cnVjdGlvbiA9IHJlcGxhY2VPbGRWYXJJblRleHQoXG4gICAgICAgICAgcGF5bG9hZC5pbnN0cnVjdGlvbixcbiAgICAgICAgICBvbGRWYXJTZWxlY3RvcixcbiAgICAgICAgICBuZXdWYXJTZWxlY3RvcixcbiAgICAgICAgKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBCbG9ja0VudW0uSXRlcmF0aW9uOiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIEl0ZXJhdGlvbk5vZGVUeXBlXG4gICAgICAgIGlmIChwYXlsb2FkLml0ZXJhdG9yX3NlbGVjdG9yLmpvaW4oJy4nKSA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpKVxuICAgICAgICAgIHBheWxvYWQuaXRlcmF0b3Jfc2VsZWN0b3IgPSBuZXdWYXJTZWxlY3RvclxuXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIEJsb2NrRW51bS5Mb29wOiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBkYXRhIGFzIExvb3BOb2RlVHlwZVxuICAgICAgICBpZiAocGF5bG9hZC5icmVha19jb25kaXRpb25zKSB7XG4gICAgICAgICAgcGF5bG9hZC5icmVha19jb25kaXRpb25zID0gcGF5bG9hZC5icmVha19jb25kaXRpb25zLm1hcCgoYykgPT4ge1xuICAgICAgICAgICAgaWYgKGMudmFyaWFibGVfc2VsZWN0b3I/LmpvaW4oJy4nKSA9PT0gb2xkVmFyU2VsZWN0b3Iuam9pbignLicpKVxuICAgICAgICAgICAgICBjLnZhcmlhYmxlX3NlbGVjdG9yID0gbmV3VmFyU2VsZWN0b3JcbiAgICAgICAgICAgIHJldHVybiBjXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBCbG9ja0VudW0uTGlzdEZpbHRlcjoge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YSBhcyBMaXN0RmlsdGVyTm9kZVR5cGVcbiAgICAgICAgaWYgKHBheWxvYWQudmFyaWFibGUuam9pbignLicpID09PSBvbGRWYXJTZWxlY3Rvci5qb2luKCcuJykpXG4gICAgICAgICAgcGF5bG9hZC52YXJpYWJsZSA9IG5ld1ZhclNlbGVjdG9yXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9KVxuICByZXR1cm4gbmV3Tm9kZVxufVxuXG5jb25zdCB2YXJUb1ZhbHVlU2VsZWN0b3JMaXN0ID0gKFxuICB2OiBWYXIsXG4gIHBhcmVudFZhbHVlU2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IsXG4gIHJlczogVmFsdWVTZWxlY3RvcltdLFxuKSA9PiB7XG4gIGlmICghdi52YXJpYWJsZSlcbiAgICByZXR1cm5cblxuICByZXMucHVzaChbLi4ucGFyZW50VmFsdWVTZWxlY3Rvciwgdi52YXJpYWJsZV0pXG4gIGNvbnN0IGlzU3RydWN0dXJlZE91dHB1dCA9ICEhKHYuY2hpbGRyZW4gYXMgU3RydWN0dXJlZE91dHB1dCk/LnNjaGVtYT8ucHJvcGVydGllc1xuXG4gIGlmICgodi5jaGlsZHJlbiBhcyBWYXJbXSk/Lmxlbmd0aCA+IDApIHtcbiAgICAodi5jaGlsZHJlbiBhcyBWYXJbXSkuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIHZhclRvVmFsdWVTZWxlY3Rvckxpc3QoY2hpbGQsIFsuLi5wYXJlbnRWYWx1ZVNlbGVjdG9yLCB2LnZhcmlhYmxlXSwgcmVzKVxuICAgIH0pXG4gIH1cbiAgaWYgKGlzU3RydWN0dXJlZE91dHB1dCkge1xuICAgIE9iamVjdC5rZXlzKFxuICAgICAgKHYuY2hpbGRyZW4gYXMgU3RydWN0dXJlZE91dHB1dCk/LnNjaGVtYT8ucHJvcGVydGllcyB8fCB7fSxcbiAgICApLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9ICh2LmNoaWxkcmVuIGFzIFN0cnVjdHVyZWRPdXRwdXQpPy5zY2hlbWE/LnByb3BlcnRpZXNba2V5XS50eXBlXG4gICAgICBjb25zdCBpc0FycmF5ID0gdHlwZSA9PT0gVHlwZS5hcnJheVxuICAgICAgY29uc3QgYXJyYXlUeXBlID0gKHYuY2hpbGRyZW4gYXMgU3RydWN0dXJlZE91dHB1dCk/LnNjaGVtYT8ucHJvcGVydGllc1tcbiAgICAgICAga2V5XG4gICAgICBdLml0ZW1zPy50eXBlXG4gICAgICB2YXJUb1ZhbHVlU2VsZWN0b3JMaXN0KFxuICAgICAgICB7XG4gICAgICAgICAgdmFyaWFibGU6IGtleSxcbiAgICAgICAgICB0eXBlOiBzdHJ1Y3RUeXBlVG9WYXJUeXBlKGlzQXJyYXkgPyBhcnJheVR5cGUhIDogdHlwZSwgaXNBcnJheSksXG4gICAgICAgIH0sXG4gICAgICAgIFsuLi5wYXJlbnRWYWx1ZVNlbGVjdG9yLCB2LnZhcmlhYmxlXSxcbiAgICAgICAgcmVzLFxuICAgICAgKVxuICAgIH0pXG4gIH1cbn1cblxuY29uc3QgdmFyc1RvVmFsdWVTZWxlY3Rvckxpc3QgPSAoXG4gIHZhcnM6IFZhciB8IFZhcltdLFxuICBwYXJlbnRWYWx1ZVNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yLFxuICByZXM6IFZhbHVlU2VsZWN0b3JbXSxcbikgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YXJzKSkge1xuICAgIHZhcnMuZm9yRWFjaCgodikgPT4ge1xuICAgICAgdmFyVG9WYWx1ZVNlbGVjdG9yTGlzdCh2LCBwYXJlbnRWYWx1ZVNlbGVjdG9yLCByZXMpXG4gICAgfSlcbiAgfVxuICB2YXJUb1ZhbHVlU2VsZWN0b3JMaXN0KHZhcnMgYXMgVmFyLCBwYXJlbnRWYWx1ZVNlbGVjdG9yLCByZXMpXG59XG5cbmV4cG9ydCBjb25zdCBnZXROb2RlT3V0cHV0VmFycyA9IChcbiAgbm9kZTogTm9kZSxcbiAgaXNDaGF0TW9kZTogYm9vbGVhbixcbik6IFZhbHVlU2VsZWN0b3JbXSA9PiB7XG4gIGNvbnN0IHsgZGF0YSwgaWQgfSA9IG5vZGVcbiAgY29uc3QgeyB0eXBlIH0gPSBkYXRhXG4gIGxldCByZXM6IFZhbHVlU2VsZWN0b3JbXSA9IFtdXG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBCbG9ja0VudW0uU3RhcnQ6IHtcbiAgICAgIGNvbnN0IHsgdmFyaWFibGVzIH0gPSBkYXRhIGFzIFN0YXJ0Tm9kZVR5cGVcbiAgICAgIHJlcyA9IHZhcmlhYmxlcy5tYXAoKHYpID0+IHtcbiAgICAgICAgcmV0dXJuIFtpZCwgdi52YXJpYWJsZV1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChpc0NoYXRNb2RlKSB7XG4gICAgICAgIHJlcy5wdXNoKFtpZCwgJ3N5cycsICdxdWVyeSddKVxuICAgICAgICByZXMucHVzaChbaWQsICdzeXMnLCAnZmlsZXMnXSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uTExNOiB7XG4gICAgICBjb25zdCB2YXJzID0gWy4uLkxMTV9PVVRQVVRfU1RSVUNUXVxuICAgICAgY29uc3QgbGxtTm9kZURhdGEgPSBkYXRhIGFzIExMTU5vZGVUeXBlXG4gICAgICBpZiAoXG4gICAgICAgIGxsbU5vZGVEYXRhLnN0cnVjdHVyZWRfb3V0cHV0X2VuYWJsZWRcbiAgICAgICAgJiYgbGxtTm9kZURhdGEuc3RydWN0dXJlZF9vdXRwdXQ/LnNjaGVtYT8ucHJvcGVydGllc1xuICAgICAgICAmJiBPYmplY3Qua2V5cyhsbG1Ob2RlRGF0YS5zdHJ1Y3R1cmVkX291dHB1dC5zY2hlbWEucHJvcGVydGllcykubGVuZ3RoID4gMFxuICAgICAgKSB7XG4gICAgICAgIHZhcnMucHVzaCh7XG4gICAgICAgICAgdmFyaWFibGU6ICdzdHJ1Y3R1cmVkX291dHB1dCcsXG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5vYmplY3QsXG4gICAgICAgICAgY2hpbGRyZW46IGxsbU5vZGVEYXRhLnN0cnVjdHVyZWRfb3V0cHV0LFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdmFyc1RvVmFsdWVTZWxlY3Rvckxpc3QodmFycywgW2lkXSwgcmVzKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5Lbm93bGVkZ2VSZXRyaWV2YWw6IHtcbiAgICAgIHZhcnNUb1ZhbHVlU2VsZWN0b3JMaXN0KEtOT1dMRURHRV9SRVRSSUVWQUxfT1VUUFVUX1NUUlVDVCwgW2lkXSwgcmVzKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5Db2RlOiB7XG4gICAgICBjb25zdCB7IG91dHB1dHMgfSA9IGRhdGEgYXMgQ29kZU5vZGVUeXBlXG4gICAgICBPYmplY3Qua2V5cyhvdXRwdXRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgcmVzLnB1c2goW2lkLCBrZXldKVxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uVGVtcGxhdGVUcmFuc2Zvcm06IHtcbiAgICAgIHZhcnNUb1ZhbHVlU2VsZWN0b3JMaXN0KFRFTVBMQVRFX1RSQU5TRk9STV9PVVRQVVRfU1RSVUNULCBbaWRdLCByZXMpXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLlF1ZXN0aW9uQ2xhc3NpZmllcjoge1xuICAgICAgdmFyc1RvVmFsdWVTZWxlY3Rvckxpc3QoUVVFU1RJT05fQ0xBU1NJRklFUl9PVVRQVVRfU1RSVUNULCBbaWRdLCByZXMpXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkh0dHBSZXF1ZXN0OiB7XG4gICAgICB2YXJzVG9WYWx1ZVNlbGVjdG9yTGlzdChIVFRQX1JFUVVFU1RfT1VUUFVUX1NUUlVDVCwgW2lkXSwgcmVzKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5WYXJpYWJsZUFzc2lnbmVyOiB7XG4gICAgICByZXMucHVzaChbaWQsICdvdXRwdXQnXSlcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uVmFyaWFibGVBZ2dyZWdhdG9yOiB7XG4gICAgICByZXMucHVzaChbaWQsICdvdXRwdXQnXSlcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uVG9vbDoge1xuICAgICAgdmFyc1RvVmFsdWVTZWxlY3Rvckxpc3QoVE9PTF9PVVRQVVRfU1RSVUNULCBbaWRdLCByZXMpXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLlBhcmFtZXRlckV4dHJhY3Rvcjoge1xuICAgICAgY29uc3QgeyBwYXJhbWV0ZXJzIH0gPSBkYXRhIGFzIFBhcmFtZXRlckV4dHJhY3Rvck5vZGVUeXBlXG4gICAgICBpZiAocGFyYW1ldGVycz8ubGVuZ3RoID4gMCkge1xuICAgICAgICBwYXJhbWV0ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICByZXMucHVzaChbaWQsIHAubmFtZV0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uSXRlcmF0aW9uOiB7XG4gICAgICByZXMucHVzaChbaWQsICdvdXRwdXQnXSlcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSBCbG9ja0VudW0uTG9vcDoge1xuICAgICAgcmVzLnB1c2goW2lkLCAnb3V0cHV0J10pXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNhc2UgQmxvY2tFbnVtLkRvY0V4dHJhY3Rvcjoge1xuICAgICAgcmVzLnB1c2goW2lkLCAndGV4dCddKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlIEJsb2NrRW51bS5MaXN0RmlsdGVyOiB7XG4gICAgICByZXMucHVzaChbaWQsICdyZXN1bHQnXSlcbiAgICAgIHJlcy5wdXNoKFtpZCwgJ2ZpcnN0X3JlY29yZCddKVxuICAgICAgcmVzLnB1c2goW2lkLCAnbGFzdF9yZWNvcmQnXSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc1xufVxuIl19