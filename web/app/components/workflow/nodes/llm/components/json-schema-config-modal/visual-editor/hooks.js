"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSchemaNodeOperations = void 0;
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const context_1 = require("./context");
const store_1 = require("./store");
const useSchemaNodeOperations = (props) => {
    const { schema: jsonSchema, onChange: doOnChange } = props;
    const onChange = doOnChange || function_1.noop;
    const backupSchema = (0, store_1.useVisualEditorStore)(state => state.backupSchema);
    const setBackupSchema = (0, store_1.useVisualEditorStore)(state => state.setBackupSchema);
    const isAddingNewField = (0, store_1.useVisualEditorStore)(state => state.isAddingNewField);
    const setIsAddingNewField = (0, store_1.useVisualEditorStore)(state => state.setIsAddingNewField);
    const advancedEditing = (0, store_1.useVisualEditorStore)(state => state.advancedEditing);
    const setAdvancedEditing = (0, store_1.useVisualEditorStore)(state => state.setAdvancedEditing);
    const setHoveringProperty = (0, store_1.useVisualEditorStore)(state => state.setHoveringProperty);
    const { emit, useSubscribe } = (0, context_1.useMittContext)();
    useSubscribe('restoreSchema', () => {
        if (backupSchema) {
            onChange(backupSchema);
            setBackupSchema(null);
        }
    });
    useSubscribe('quitEditing', (params) => {
        const { callback } = params;
        callback?.(backupSchema);
        if (backupSchema) {
            onChange(backupSchema);
            setBackupSchema(null);
        }
        if (isAddingNewField)
            setIsAddingNewField(false);
        if (advancedEditing)
            setAdvancedEditing(false);
        setHoveringProperty(null);
    });
    useSubscribe('propertyNameChange', (params) => {
        const { parentPath, oldFields, fields } = params;
        const { name: oldName } = oldFields;
        const { name: newName } = fields;
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            if (oldName === newName)
                return;
            const schema = (0, utils_1.findPropertyWithPath)(draft, parentPath);
            if (schema.type === types_1.Type.object) {
                const properties = schema.properties || {};
                if (properties[newName]) {
                    toast_1.default.notify({
                        type: 'error',
                        message: 'Property name already exists',
                    });
                    emit('restorePropertyName');
                    return;
                }
                const newProperties = Object.entries(properties).reduce((acc, [key, value]) => {
                    acc[key === oldName ? newName : key] = value;
                    return acc;
                }, {});
                const required = schema.required || [];
                const newRequired = (0, immer_1.produce)(required, (draft) => {
                    const index = draft.indexOf(oldName);
                    if (index !== -1)
                        draft.splice(index, 1, newName);
                });
                schema.properties = newProperties;
                schema.required = newRequired;
            }
            if (schema.type === types_1.Type.array && schema.items && schema.items.type === types_1.Type.object) {
                const properties = schema.items.properties || {};
                if (properties[newName]) {
                    toast_1.default.notify({
                        type: 'error',
                        message: 'Property name already exists',
                    });
                    emit('restorePropertyName');
                    return;
                }
                const newProperties = Object.entries(properties).reduce((acc, [key, value]) => {
                    acc[key === oldName ? newName : key] = value;
                    return acc;
                }, {});
                const required = schema.items.required || [];
                const newRequired = (0, immer_1.produce)(required, (draft) => {
                    const index = draft.indexOf(oldName);
                    if (index !== -1)
                        draft.splice(index, 1, newName);
                });
                schema.items.properties = newProperties;
                schema.items.required = newRequired;
            }
        });
        onChange(newSchema);
    });
    useSubscribe('propertyTypeChange', (params) => {
        const { path, oldFields, fields } = params;
        const { type: oldType } = oldFields;
        const { type: newType } = fields;
        if (oldType === newType)
            return;
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            const schema = (0, utils_1.findPropertyWithPath)(draft, path);
            if (schema.type === types_1.Type.object) {
                delete schema.properties;
                delete schema.required;
            }
            if (schema.type === types_1.Type.array)
                delete schema.items;
            switch (newType) {
                case types_1.Type.object:
                    schema.type = types_1.Type.object;
                    schema.properties = {};
                    schema.required = [];
                    schema.additionalProperties = false;
                    break;
                case types_1.ArrayType.string:
                    schema.type = types_1.Type.array;
                    schema.items = {
                        type: types_1.Type.string,
                    };
                    break;
                case types_1.ArrayType.number:
                    schema.type = types_1.Type.array;
                    schema.items = {
                        type: types_1.Type.number,
                    };
                    break;
                // case ArrayType.boolean:
                //   schema.type = Type.array
                //   schema.items = {
                //     type: Type.boolean,
                //   }
                //   break
                case types_1.ArrayType.object:
                    schema.type = types_1.Type.array;
                    schema.items = {
                        type: types_1.Type.object,
                        properties: {},
                        required: [],
                        additionalProperties: false,
                    };
                    break;
                default:
                    schema.type = newType;
            }
        });
        onChange(newSchema);
    });
    useSubscribe('propertyRequiredToggle', (params) => {
        const { parentPath, fields } = params;
        const { name } = fields;
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            const schema = (0, utils_1.findPropertyWithPath)(draft, parentPath);
            if (schema.type === types_1.Type.object) {
                const required = schema.required || [];
                const newRequired = required.includes(name)
                    ? required.filter(item => item !== name)
                    : [...required, name];
                schema.required = newRequired;
            }
            if (schema.type === types_1.Type.array && schema.items && schema.items.type === types_1.Type.object) {
                const required = schema.items.required || [];
                const newRequired = required.includes(name)
                    ? required.filter(item => item !== name)
                    : [...required, name];
                schema.items.required = newRequired;
            }
        });
        onChange(newSchema);
    });
    useSubscribe('propertyOptionsChange', (params) => {
        const { path, fields } = params;
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            const schema = (0, utils_1.findPropertyWithPath)(draft, path);
            schema.description = fields.description;
            schema.enum = fields.enum;
        });
        onChange(newSchema);
    });
    useSubscribe('propertyDelete', (params) => {
        const { parentPath, fields } = params;
        const { name } = fields;
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            const schema = (0, utils_1.findPropertyWithPath)(draft, parentPath);
            if (schema.type === types_1.Type.object && schema.properties) {
                delete schema.properties[name];
                schema.required = schema.required?.filter(item => item !== name);
            }
            if (schema.type === types_1.Type.array && schema.items?.properties && schema.items?.type === types_1.Type.object) {
                delete schema.items.properties[name];
                schema.items.required = schema.items.required?.filter(item => item !== name);
            }
        });
        onChange(newSchema);
    });
    useSubscribe('addField', (params) => {
        if (advancedEditing)
            setAdvancedEditing(false);
        setBackupSchema(jsonSchema);
        const { path } = params;
        setIsAddingNewField(true);
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            const schema = (0, utils_1.findPropertyWithPath)(draft, path);
            if (schema.type === types_1.Type.object) {
                schema.properties = {
                    ...schema.properties,
                    '': {
                        type: types_1.Type.string,
                    },
                };
                setHoveringProperty([...path, 'properties', ''].join('.'));
            }
            if (schema.type === types_1.Type.array && schema.items && schema.items.type === types_1.Type.object) {
                schema.items.properties = {
                    ...schema.items.properties,
                    '': {
                        type: types_1.Type.string,
                    },
                };
                setHoveringProperty([...path, 'items', 'properties', ''].join('.'));
            }
        });
        onChange(newSchema);
    });
    useSubscribe('fieldChange', (params) => {
        let samePropertyNameError = false;
        const { parentPath, oldFields, fields } = params;
        const newSchema = (0, immer_1.produce)(jsonSchema, (draft) => {
            const parentSchema = (0, utils_1.findPropertyWithPath)(draft, parentPath);
            const { name: oldName, type: oldType, required: oldRequired } = oldFields;
            const { name: newName, type: newType, required: newRequired } = fields;
            if (parentSchema.type === types_1.Type.object && parentSchema.properties) {
                // name change
                if (oldName !== newName) {
                    const properties = parentSchema.properties;
                    if (properties[newName]) {
                        toast_1.default.notify({
                            type: 'error',
                            message: 'Property name already exists',
                        });
                        samePropertyNameError = true;
                    }
                    const newProperties = Object.entries(properties).reduce((acc, [key, value]) => {
                        acc[key === oldName ? newName : key] = value;
                        return acc;
                    }, {});
                    const requiredProperties = parentSchema.required || [];
                    const newRequiredProperties = (0, immer_1.produce)(requiredProperties, (draft) => {
                        const index = draft.indexOf(oldName);
                        if (index !== -1)
                            draft.splice(index, 1, newName);
                    });
                    parentSchema.properties = newProperties;
                    parentSchema.required = newRequiredProperties;
                }
                // required change
                if (oldRequired !== newRequired) {
                    const required = parentSchema.required || [];
                    const newRequired = required.includes(newName)
                        ? required.filter(item => item !== newName)
                        : [...required, newName];
                    parentSchema.required = newRequired;
                }
                const schema = parentSchema.properties[newName];
                // type change
                if (oldType !== newType) {
                    if (schema.type === types_1.Type.object) {
                        delete schema.properties;
                        delete schema.required;
                    }
                    if (schema.type === types_1.Type.array)
                        delete schema.items;
                    switch (newType) {
                        case types_1.Type.object:
                            schema.type = types_1.Type.object;
                            schema.properties = {};
                            schema.required = [];
                            schema.additionalProperties = false;
                            break;
                        case types_1.ArrayType.string:
                            schema.type = types_1.Type.array;
                            schema.items = {
                                type: types_1.Type.string,
                            };
                            break;
                        case types_1.ArrayType.number:
                            schema.type = types_1.Type.array;
                            schema.items = {
                                type: types_1.Type.number,
                            };
                            break;
                        // case ArrayType.boolean:
                        //   schema.type = Type.array
                        //   schema.items = {
                        //     type: Type.boolean,
                        //   }
                        //   break
                        case types_1.ArrayType.object:
                            schema.type = types_1.Type.array;
                            schema.items = {
                                type: types_1.Type.object,
                                properties: {},
                                required: [],
                                additionalProperties: false,
                            };
                            break;
                        default:
                            schema.type = newType;
                    }
                }
                // other options change
                schema.description = fields.description;
                schema.enum = fields.enum;
            }
            if (parentSchema.type === types_1.Type.array && parentSchema.items && parentSchema.items.type === types_1.Type.object && parentSchema.items.properties) {
                // name change
                if (oldName !== newName) {
                    const properties = parentSchema.items.properties || {};
                    if (properties[newName]) {
                        toast_1.default.notify({
                            type: 'error',
                            message: 'Property name already exists',
                        });
                        samePropertyNameError = true;
                    }
                    const newProperties = Object.entries(properties).reduce((acc, [key, value]) => {
                        acc[key === oldName ? newName : key] = value;
                        return acc;
                    }, {});
                    const required = parentSchema.items.required || [];
                    const newRequired = (0, immer_1.produce)(required, (draft) => {
                        const index = draft.indexOf(oldName);
                        if (index !== -1)
                            draft.splice(index, 1, newName);
                    });
                    parentSchema.items.properties = newProperties;
                    parentSchema.items.required = newRequired;
                }
                // required change
                if (oldRequired !== newRequired) {
                    const required = parentSchema.items.required || [];
                    const newRequired = required.includes(newName)
                        ? required.filter(item => item !== newName)
                        : [...required, newName];
                    parentSchema.items.required = newRequired;
                }
                const schema = parentSchema.items.properties[newName];
                // type change
                if (oldType !== newType) {
                    if (schema.type === types_1.Type.object) {
                        delete schema.properties;
                        delete schema.required;
                    }
                    if (schema.type === types_1.Type.array)
                        delete schema.items;
                    switch (newType) {
                        case types_1.Type.object:
                            schema.type = types_1.Type.object;
                            schema.properties = {};
                            schema.required = [];
                            schema.additionalProperties = false;
                            break;
                        case types_1.ArrayType.string:
                            schema.type = types_1.Type.array;
                            schema.items = {
                                type: types_1.Type.string,
                            };
                            break;
                        case types_1.ArrayType.number:
                            schema.type = types_1.Type.array;
                            schema.items = {
                                type: types_1.Type.number,
                            };
                            break;
                        // case ArrayType.boolean:
                        //   schema.type = Type.array
                        //   schema.items = {
                        //     type: Type.boolean,
                        //   }
                        //   break
                        case types_1.ArrayType.object:
                            schema.type = types_1.Type.array;
                            schema.items = {
                                type: types_1.Type.object,
                                properties: {},
                                required: [],
                                additionalProperties: false,
                            };
                            break;
                        default:
                            schema.type = newType;
                    }
                }
                // other options change
                schema.description = fields.description;
                schema.enum = fields.enum;
            }
        });
        if (samePropertyNameError)
            return;
        onChange(newSchema);
        emit('fieldChangeSuccess');
    });
};
exports.useSchemaNodeOperations = useSchemaNodeOperations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxrREFBMEM7QUFDMUMsaUNBQStCO0FBQy9CLHVEQUErQztBQUMvQywwQ0FBZ0Q7QUFDaEQsMENBQXFEO0FBQ3JELHVDQUEwQztBQUMxQyxtQ0FBOEM7QUFhdkMsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLEtBQXdCLEVBQUUsRUFBRTtJQUNsRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQzFELE1BQU0sUUFBUSxHQUFHLFVBQVUsSUFBSSxlQUFJLENBQUE7SUFDbkMsTUFBTSxZQUFZLEdBQUcsSUFBQSw0QkFBb0IsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUN0RSxNQUFNLGVBQWUsR0FBRyxJQUFBLDRCQUFvQixFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0lBQzVFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSw0QkFBb0IsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQzlFLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSw0QkFBb0IsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQ3BGLE1BQU0sZUFBZSxHQUFHLElBQUEsNEJBQW9CLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDNUUsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLDRCQUFvQixFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFDbEYsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLDRCQUFvQixFQUFDLEtBQUssQ0FB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QUNyQiwwQkFBMEI7d0JBQzFCLE1BQU07d0JBQ04sVUFBVTt3QkFDVixLQUFLLGlCQUFTLENBQUMsTUFBTTs0QkFDbkIsTUFBTSxDQUFDLElBQUksR0FBRyxZQUFJLENBQUMsS0FBSyxDQUFBOzRCQUN4QixNQUFNLENBQUMsS0FBSyxHQUFHO2dDQUNiLElBQUksRUFBRSxZQUFJLENBQUMsTUFBTTtnQ0FDakIsVUFBVSxFQUFFLEVBQUU7Z0NBQ2QsUUFBUSxFQUFFLEVBQUU7Z0NBQ1osb0JBQW9CLEVBQUUsS0FBSzs2QkFDNUIsQ0FBQTs0QkFDRCxNQUFLO3dCQUNQOzRCQUNFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBZSxDQUFBO29CQUNqQyxDQUFDO2dCQUNILENBQUM7Z0JBRUQsdUJBQXVCO2dCQUN2QixNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7Z0JBQ3ZDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQTtZQUMzQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLHFCQUFxQjtZQUN2QixPQUFNO1FBQ1IsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0lBQzVCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBM2FZLFFBQUEsdUJBQXVCLDJCQTJhbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFZpc3VhbEVkaXRvclByb3BzIH0gZnJvbSAnLidcbmltcG9ydCB0eXBlIHsgRmllbGQgfSBmcm9tICcuLi8uLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgRWRpdERhdGEgfSBmcm9tICcuL2VkaXQtY2FyZCdcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IEFycmF5VHlwZSwgVHlwZSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgZmluZFByb3BlcnR5V2l0aFBhdGggfSBmcm9tICcuLi8uLi8uLi91dGlscydcbmltcG9ydCB7IHVzZU1pdHRDb250ZXh0IH0gZnJvbSAnLi9jb250ZXh0J1xuaW1wb3J0IHsgdXNlVmlzdWFsRWRpdG9yU3RvcmUgfSBmcm9tICcuL3N0b3JlJ1xuXG50eXBlIENoYW5nZUV2ZW50UGFyYW1zID0ge1xuICBwYXRoOiBzdHJpbmdbXVxuICBwYXJlbnRQYXRoOiBzdHJpbmdbXVxuICBvbGRGaWVsZHM6IEVkaXREYXRhXG4gIGZpZWxkczogRWRpdERhdGFcbn1cblxudHlwZSBBZGRFdmVudFBhcmFtcyA9IHtcbiAgcGF0aDogc3RyaW5nW11cbn1cblxuZXhwb3J0IGNvbnN0IHVzZVNjaGVtYU5vZGVPcGVyYXRpb25zID0gKHByb3BzOiBWaXN1YWxFZGl0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IHNjaGVtYToganNvblNjaGVtYSwgb25DaGFuZ2U6IGRvT25DaGFuZ2UgfSA9IHByb3BzXG4gIGNvbnN0IG9uQ2hhbmdlID0gZG9PbkNoYW5nZSB8fCBub29wXG4gIGNvbnN0IGJhY2t1cFNjaGVtYSA9IHVzZVZpc3VhbEVkaXRvclN0b3JlKHN0YXRlID0+IHN0YXRlLmJhY2t1cFNjaGVtYSlcbiAgY29uc3Qgc2V0QmFja3VwU2NoZW1hID0gdXNlVmlzdWFsRWRpdG9yU3RvcmUoc3RhdGUgPT4gc3RhdGUuc2V0QmFja3VwU2NoZW1hKVxuICBjb25zdCBpc0FkZGluZ05ld0ZpZWxkID0gdXNlVmlzdWFsRWRpdG9yU3RvcmUoc3RhdGUgPT4gc3RhdGUuaXNBZGRpbmdOZXdGaWVsZClcbiAgY29uc3Qgc2V0SXNBZGRpbmdOZXdGaWVsZCA9IHVzZVZpc3VhbEVkaXRvclN0b3JlKHN0YXRlID0+IHN0YXRlLnNldElzQWRkaW5nTmV3RmllbGQpXG4gIGNvbnN0IGFkdmFuY2VkRWRpdGluZyA9IHVzZVZpc3VhbEVkaXRvclN0b3JlKHN0YXRlID0+IHN0YXRlLmFkdmFuY2VkRWRpdGluZylcbiAgY29uc3Qgc2V0QWR2YW5jZWRFZGl0aW5nID0gdXNlVmlzdWFsRWRpdG9yU3RvcmUoc3RhdGUgPT4gc3RhdGUuc2V0QWR2YW5jZWRFZGl0aW5nKVxuICBjb25zdCBzZXRIb3ZlcmluZ1Byb3BlcnR5ID0gdXNlVmlzdWFsRWRpdG9yU3RvcmUoc3RhdGUgPT4gc3RhdGUuc2V0SG92ZXJpbmdQcm9wZXJ0eSlcbiAgY29uc3QgeyBlbWl0LCB1c2VTdWJzY3JpYmUgfSA9IHVzZU1pdHRDb250ZXh0KClcblxuICB1c2VTdWJzY3JpYmUoJ3Jlc3RvcmVTY2hlbWEnLCAoKSA9PiB7XG4gICAgaWYgKGJhY2t1cFNjaGVtYSkge1xuICAgICAgb25DaGFuZ2UoYmFja3VwU2NoZW1hKVxuICAgICAgc2V0QmFja3VwU2NoZW1hKG51bGwpXG4gICAgfVxuICB9KVxuXG4gIHVzZVN1YnNjcmliZSgncXVpdEVkaXRpbmcnLCAocGFyYW1zKSA9PiB7XG4gICAgY29uc3QgeyBjYWxsYmFjayB9ID0gcGFyYW1zIGFzIGFueVxuICAgIGNhbGxiYWNrPy4oYmFja3VwU2NoZW1hKVxuICAgIGlmIChiYWNrdXBTY2hlbWEpIHtcbiAgICAgIG9uQ2hhbmdlKGJhY2t1cFNjaGVtYSlcbiAgICAgIHNldEJhY2t1cFNjaGVtYShudWxsKVxuICAgIH1cbiAgICBpZiAoaXNBZGRpbmdOZXdGaWVsZClcbiAgICAgIHNldElzQWRkaW5nTmV3RmllbGQoZmFsc2UpXG4gICAgaWYgKGFkdmFuY2VkRWRpdGluZylcbiAgICAgIHNldEFkdmFuY2VkRWRpdGluZyhmYWxzZSlcbiAgICBzZXRIb3ZlcmluZ1Byb3BlcnR5KG51bGwpXG4gIH0pXG5cbiAgdXNlU3Vic2NyaWJlKCdwcm9wZXJ0eU5hbWVDaGFuZ2UnLCAocGFyYW1zKSA9PiB7XG4gICAgY29uc3QgeyBwYXJlbnRQYXRoLCBvbGRGaWVsZHMsIGZpZWxkcyB9ID0gcGFyYW1zIGFzIENoYW5nZUV2ZW50UGFyYW1zXG4gICAgY29uc3QgeyBuYW1lOiBvbGROYW1lIH0gPSBvbGRGaWVsZHNcbiAgICBjb25zdCB7IG5hbWU6IG5ld05hbWUgfSA9IGZpZWxkc1xuICAgIGNvbnN0IG5ld1NjaGVtYSA9IHByb2R1Y2UoanNvblNjaGVtYSwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAob2xkTmFtZSA9PT0gbmV3TmFtZSlcbiAgICAgICAgcmV0dXJuXG4gICAgICBjb25zdCBzY2hlbWEgPSBmaW5kUHJvcGVydHlXaXRoUGF0aChkcmFmdCwgcGFyZW50UGF0aCkgYXMgRmllbGRcblxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLm9iamVjdCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gc2NoZW1hLnByb3BlcnRpZXMgfHwge31cbiAgICAgICAgaWYgKHByb3BlcnRpZXNbbmV3TmFtZV0pIHtcbiAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdQcm9wZXJ0eSBuYW1lIGFscmVhZHkgZXhpc3RzJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGVtaXQoJ3Jlc3RvcmVQcm9wZXJ0eU5hbWUnKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3UHJvcGVydGllcyA9IE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBhY2Nba2V5ID09PSBvbGROYW1lID8gbmV3TmFtZSA6IGtleV0gPSB2YWx1ZVxuICAgICAgICAgIHJldHVybiBhY2NcbiAgICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgRmllbGQ+KVxuXG4gICAgICAgIGNvbnN0IHJlcXVpcmVkID0gc2NoZW1hLnJlcXVpcmVkIHx8IFtdXG4gICAgICAgIGNvbnN0IG5ld1JlcXVpcmVkID0gcHJvZHVjZShyZXF1aXJlZCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBkcmFmdC5pbmRleE9mKG9sZE5hbWUpXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgICAgIGRyYWZ0LnNwbGljZShpbmRleCwgMSwgbmV3TmFtZSlcbiAgICAgICAgfSlcblxuICAgICAgICBzY2hlbWEucHJvcGVydGllcyA9IG5ld1Byb3BlcnRpZXNcbiAgICAgICAgc2NoZW1hLnJlcXVpcmVkID0gbmV3UmVxdWlyZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLmFycmF5ICYmIHNjaGVtYS5pdGVtcyAmJiBzY2hlbWEuaXRlbXMudHlwZSA9PT0gVHlwZS5vYmplY3QpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHNjaGVtYS5pdGVtcy5wcm9wZXJ0aWVzIHx8IHt9XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzW25ld05hbWVdKSB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnUHJvcGVydHkgbmFtZSBhbHJlYWR5IGV4aXN0cycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICBlbWl0KCdyZXN0b3JlUHJvcGVydHlOYW1lJylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1Byb3BlcnRpZXMgPSBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgYWNjW2tleSA9PT0gb2xkTmFtZSA/IG5ld05hbWUgOiBrZXldID0gdmFsdWVcbiAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIEZpZWxkPilcbiAgICAgICAgY29uc3QgcmVxdWlyZWQgPSBzY2hlbWEuaXRlbXMucmVxdWlyZWQgfHwgW11cbiAgICAgICAgY29uc3QgbmV3UmVxdWlyZWQgPSBwcm9kdWNlKHJlcXVpcmVkLCAoZHJhZnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IGRyYWZ0LmluZGV4T2Yob2xkTmFtZSlcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgZHJhZnQuc3BsaWNlKGluZGV4LCAxLCBuZXdOYW1lKVxuICAgICAgICB9KVxuXG4gICAgICAgIHNjaGVtYS5pdGVtcy5wcm9wZXJ0aWVzID0gbmV3UHJvcGVydGllc1xuICAgICAgICBzY2hlbWEuaXRlbXMucmVxdWlyZWQgPSBuZXdSZXF1aXJlZFxuICAgICAgfVxuICAgIH0pXG4gICAgb25DaGFuZ2UobmV3U2NoZW1hKVxuICB9KVxuXG4gIHVzZVN1YnNjcmliZSgncHJvcGVydHlUeXBlQ2hhbmdlJywgKHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHsgcGF0aCwgb2xkRmllbGRzLCBmaWVsZHMgfSA9IHBhcmFtcyBhcyBDaGFuZ2VFdmVudFBhcmFtc1xuICAgIGNvbnN0IHsgdHlwZTogb2xkVHlwZSB9ID0gb2xkRmllbGRzXG4gICAgY29uc3QgeyB0eXBlOiBuZXdUeXBlIH0gPSBmaWVsZHNcbiAgICBpZiAob2xkVHlwZSA9PT0gbmV3VHlwZSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IG5ld1NjaGVtYSA9IHByb2R1Y2UoanNvblNjaGVtYSwgKGRyYWZ0KSA9PiB7XG4gICAgICBjb25zdCBzY2hlbWEgPSBmaW5kUHJvcGVydHlXaXRoUGF0aChkcmFmdCwgcGF0aCkgYXMgRmllbGRcblxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLm9iamVjdCkge1xuICAgICAgICBkZWxldGUgc2NoZW1hLnByb3BlcnRpZXNcbiAgICAgICAgZGVsZXRlIHNjaGVtYS5yZXF1aXJlZFxuICAgICAgfVxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLmFycmF5KVxuICAgICAgICBkZWxldGUgc2NoZW1hLml0ZW1zXG4gICAgICBzd2l0Y2ggKG5ld1R5cGUpIHtcbiAgICAgICAgY2FzZSBUeXBlLm9iamVjdDpcbiAgICAgICAgICBzY2hlbWEudHlwZSA9IFR5cGUub2JqZWN0XG4gICAgICAgICAgc2NoZW1hLnByb3BlcnRpZXMgPSB7fVxuICAgICAgICAgIHNjaGVtYS5yZXF1aXJlZCA9IFtdXG4gICAgICAgICAgc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIEFycmF5VHlwZS5zdHJpbmc6XG4gICAgICAgICAgc2NoZW1hLnR5cGUgPSBUeXBlLmFycmF5XG4gICAgICAgICAgc2NoZW1hLml0ZW1zID0ge1xuICAgICAgICAgICAgdHlwZTogVHlwZS5zdHJpbmcsXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgQXJyYXlUeXBlLm51bWJlcjpcbiAgICAgICAgICBzY2hlbWEudHlwZSA9IFR5cGUuYXJyYXlcbiAgICAgICAgICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgICAgICB0eXBlOiBUeXBlLm51bWJlcixcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgLy8gY2FzZSBBcnJheVR5cGUuYm9vbGVhbjpcbiAgICAgICAgLy8gICBzY2hlbWEudHlwZSA9IFR5cGUuYXJyYXlcbiAgICAgICAgLy8gICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgIC8vICAgICB0eXBlOiBUeXBlLmJvb2xlYW4sXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyAgIGJyZWFrXG4gICAgICAgIGNhc2UgQXJyYXlUeXBlLm9iamVjdDpcbiAgICAgICAgICBzY2hlbWEudHlwZSA9IFR5cGUuYXJyYXlcbiAgICAgICAgICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgICAgICB0eXBlOiBUeXBlLm9iamVjdCxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFtdLFxuICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHNjaGVtYS50eXBlID0gbmV3VHlwZSBhcyBUeXBlXG4gICAgICB9XG4gICAgfSlcbiAgICBvbkNoYW5nZShuZXdTY2hlbWEpXG4gIH0pXG5cbiAgdXNlU3Vic2NyaWJlKCdwcm9wZXJ0eVJlcXVpcmVkVG9nZ2xlJywgKHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHsgcGFyZW50UGF0aCwgZmllbGRzIH0gPSBwYXJhbXMgYXMgQ2hhbmdlRXZlbnRQYXJhbXNcbiAgICBjb25zdCB7IG5hbWUgfSA9IGZpZWxkc1xuICAgIGNvbnN0IG5ld1NjaGVtYSA9IHByb2R1Y2UoanNvblNjaGVtYSwgKGRyYWZ0KSA9PiB7XG4gICAgICBjb25zdCBzY2hlbWEgPSBmaW5kUHJvcGVydHlXaXRoUGF0aChkcmFmdCwgcGFyZW50UGF0aCkgYXMgRmllbGRcblxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLm9iamVjdCkge1xuICAgICAgICBjb25zdCByZXF1aXJlZCA9IHNjaGVtYS5yZXF1aXJlZCB8fCBbXVxuICAgICAgICBjb25zdCBuZXdSZXF1aXJlZCA9IHJlcXVpcmVkLmluY2x1ZGVzKG5hbWUpXG4gICAgICAgICAgPyByZXF1aXJlZC5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSBuYW1lKVxuICAgICAgICAgIDogWy4uLnJlcXVpcmVkLCBuYW1lXVxuICAgICAgICBzY2hlbWEucmVxdWlyZWQgPSBuZXdSZXF1aXJlZFxuICAgICAgfVxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLmFycmF5ICYmIHNjaGVtYS5pdGVtcyAmJiBzY2hlbWEuaXRlbXMudHlwZSA9PT0gVHlwZS5vYmplY3QpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWQgPSBzY2hlbWEuaXRlbXMucmVxdWlyZWQgfHwgW11cbiAgICAgICAgY29uc3QgbmV3UmVxdWlyZWQgPSByZXF1aXJlZC5pbmNsdWRlcyhuYW1lKVxuICAgICAgICAgID8gcmVxdWlyZWQuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gbmFtZSlcbiAgICAgICAgICA6IFsuLi5yZXF1aXJlZCwgbmFtZV1cbiAgICAgICAgc2NoZW1hLml0ZW1zLnJlcXVpcmVkID0gbmV3UmVxdWlyZWRcbiAgICAgIH1cbiAgICB9KVxuICAgIG9uQ2hhbmdlKG5ld1NjaGVtYSlcbiAgfSlcblxuICB1c2VTdWJzY3JpYmUoJ3Byb3BlcnR5T3B0aW9uc0NoYW5nZScsIChwYXJhbXMpID0+IHtcbiAgICBjb25zdCB7IHBhdGgsIGZpZWxkcyB9ID0gcGFyYW1zIGFzIENoYW5nZUV2ZW50UGFyYW1zXG4gICAgY29uc3QgbmV3U2NoZW1hID0gcHJvZHVjZShqc29uU2NoZW1hLCAoZHJhZnQpID0+IHtcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGZpbmRQcm9wZXJ0eVdpdGhQYXRoKGRyYWZ0LCBwYXRoKSBhcyBGaWVsZFxuICAgICAgc2NoZW1hLmRlc2NyaXB0aW9uID0gZmllbGRzLmRlc2NyaXB0aW9uXG4gICAgICBzY2hlbWEuZW51bSA9IGZpZWxkcy5lbnVtXG4gICAgfSlcbiAgICBvbkNoYW5nZShuZXdTY2hlbWEpXG4gIH0pXG5cbiAgdXNlU3Vic2NyaWJlKCdwcm9wZXJ0eURlbGV0ZScsIChwYXJhbXMpID0+IHtcbiAgICBjb25zdCB7IHBhcmVudFBhdGgsIGZpZWxkcyB9ID0gcGFyYW1zIGFzIENoYW5nZUV2ZW50UGFyYW1zXG4gICAgY29uc3QgeyBuYW1lIH0gPSBmaWVsZHNcbiAgICBjb25zdCBuZXdTY2hlbWEgPSBwcm9kdWNlKGpzb25TY2hlbWEsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hID0gZmluZFByb3BlcnR5V2l0aFBhdGgoZHJhZnQsIHBhcmVudFBhdGgpIGFzIEZpZWxkXG4gICAgICBpZiAoc2NoZW1hLnR5cGUgPT09IFR5cGUub2JqZWN0ICYmIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIGRlbGV0ZSBzY2hlbWEucHJvcGVydGllc1tuYW1lXVxuICAgICAgICBzY2hlbWEucmVxdWlyZWQgPSBzY2hlbWEucmVxdWlyZWQ/LmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IG5hbWUpXG4gICAgICB9XG4gICAgICBpZiAoc2NoZW1hLnR5cGUgPT09IFR5cGUuYXJyYXkgJiYgc2NoZW1hLml0ZW1zPy5wcm9wZXJ0aWVzICYmIHNjaGVtYS5pdGVtcz8udHlwZSA9PT0gVHlwZS5vYmplY3QpIHtcbiAgICAgICAgZGVsZXRlIHNjaGVtYS5pdGVtcy5wcm9wZXJ0aWVzW25hbWVdXG4gICAgICAgIHNjaGVtYS5pdGVtcy5yZXF1aXJlZCA9IHNjaGVtYS5pdGVtcy5yZXF1aXJlZD8uZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gbmFtZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIG9uQ2hhbmdlKG5ld1NjaGVtYSlcbiAgfSlcblxuICB1c2VTdWJzY3JpYmUoJ2FkZEZpZWxkJywgKHBhcmFtcykgPT4ge1xuICAgIGlmIChhZHZhbmNlZEVkaXRpbmcpXG4gICAgICBzZXRBZHZhbmNlZEVkaXRpbmcoZmFsc2UpXG4gICAgc2V0QmFja3VwU2NoZW1hKGpzb25TY2hlbWEpXG4gICAgY29uc3QgeyBwYXRoIH0gPSBwYXJhbXMgYXMgQWRkRXZlbnRQYXJhbXNcbiAgICBzZXRJc0FkZGluZ05ld0ZpZWxkKHRydWUpXG4gICAgY29uc3QgbmV3U2NoZW1hID0gcHJvZHVjZShqc29uU2NoZW1hLCAoZHJhZnQpID0+IHtcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGZpbmRQcm9wZXJ0eVdpdGhQYXRoKGRyYWZ0LCBwYXRoKSBhcyBGaWVsZFxuICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLm9iamVjdCkge1xuICAgICAgICBzY2hlbWEucHJvcGVydGllcyA9IHtcbiAgICAgICAgICAuLi5zY2hlbWEucHJvcGVydGllcyxcbiAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgdHlwZTogVHlwZS5zdHJpbmcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgICBzZXRIb3ZlcmluZ1Byb3BlcnR5KFsuLi5wYXRoLCAncHJvcGVydGllcycsICcnXS5qb2luKCcuJykpXG4gICAgICB9XG4gICAgICBpZiAoc2NoZW1hLnR5cGUgPT09IFR5cGUuYXJyYXkgJiYgc2NoZW1hLml0ZW1zICYmIHNjaGVtYS5pdGVtcy50eXBlID09PSBUeXBlLm9iamVjdCkge1xuICAgICAgICBzY2hlbWEuaXRlbXMucHJvcGVydGllcyA9IHtcbiAgICAgICAgICAuLi5zY2hlbWEuaXRlbXMucHJvcGVydGllcyxcbiAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgdHlwZTogVHlwZS5zdHJpbmcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgICBzZXRIb3ZlcmluZ1Byb3BlcnR5KFsuLi5wYXRoLCAnaXRlbXMnLCAncHJvcGVydGllcycsICcnXS5qb2luKCcuJykpXG4gICAgICB9XG4gICAgfSlcbiAgICBvbkNoYW5nZShuZXdTY2hlbWEpXG4gIH0pXG5cbiAgdXNlU3Vic2NyaWJlKCdmaWVsZENoYW5nZScsIChwYXJhbXMpID0+IHtcbiAgICBsZXQgc2FtZVByb3BlcnR5TmFtZUVycm9yID0gZmFsc2VcbiAgICBjb25zdCB7IHBhcmVudFBhdGgsIG9sZEZpZWxkcywgZmllbGRzIH0gPSBwYXJhbXMgYXMgQ2hhbmdlRXZlbnRQYXJhbXNcbiAgICBjb25zdCBuZXdTY2hlbWEgPSBwcm9kdWNlKGpzb25TY2hlbWEsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgcGFyZW50U2NoZW1hID0gZmluZFByb3BlcnR5V2l0aFBhdGgoZHJhZnQsIHBhcmVudFBhdGgpIGFzIEZpZWxkXG4gICAgICBjb25zdCB7IG5hbWU6IG9sZE5hbWUsIHR5cGU6IG9sZFR5cGUsIHJlcXVpcmVkOiBvbGRSZXF1aXJlZCB9ID0gb2xkRmllbGRzXG4gICAgICBjb25zdCB7IG5hbWU6IG5ld05hbWUsIHR5cGU6IG5ld1R5cGUsIHJlcXVpcmVkOiBuZXdSZXF1aXJlZCB9ID0gZmllbGRzXG4gICAgICBpZiAocGFyZW50U2NoZW1hLnR5cGUgPT09IFR5cGUub2JqZWN0ICYmIHBhcmVudFNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIC8vIG5hbWUgY2hhbmdlXG4gICAgICAgIGlmIChvbGROYW1lICE9PSBuZXdOYW1lKSB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHBhcmVudFNjaGVtYS5wcm9wZXJ0aWVzXG4gICAgICAgICAgaWYgKHByb3BlcnRpZXNbbmV3TmFtZV0pIHtcbiAgICAgICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdQcm9wZXJ0eSBuYW1lIGFscmVhZHkgZXhpc3RzJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBzYW1lUHJvcGVydHlOYW1lRXJyb3IgPSB0cnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgbmV3UHJvcGVydGllcyA9IE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIGFjY1trZXkgPT09IG9sZE5hbWUgPyBuZXdOYW1lIDoga2V5XSA9IHZhbHVlXG4gICAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgRmllbGQ+KVxuXG4gICAgICAgICAgY29uc3QgcmVxdWlyZWRQcm9wZXJ0aWVzID0gcGFyZW50U2NoZW1hLnJlcXVpcmVkIHx8IFtdXG4gICAgICAgICAgY29uc3QgbmV3UmVxdWlyZWRQcm9wZXJ0aWVzID0gcHJvZHVjZShyZXF1aXJlZFByb3BlcnRpZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBkcmFmdC5pbmRleE9mKG9sZE5hbWUpXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICBkcmFmdC5zcGxpY2UoaW5kZXgsIDEsIG5ld05hbWUpXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHBhcmVudFNjaGVtYS5wcm9wZXJ0aWVzID0gbmV3UHJvcGVydGllc1xuICAgICAgICAgIHBhcmVudFNjaGVtYS5yZXF1aXJlZCA9IG5ld1JlcXVpcmVkUHJvcGVydGllc1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVxdWlyZWQgY2hhbmdlXG4gICAgICAgIGlmIChvbGRSZXF1aXJlZCAhPT0gbmV3UmVxdWlyZWQpIHtcbiAgICAgICAgICBjb25zdCByZXF1aXJlZCA9IHBhcmVudFNjaGVtYS5yZXF1aXJlZCB8fCBbXVxuICAgICAgICAgIGNvbnN0IG5ld1JlcXVpcmVkID0gcmVxdWlyZWQuaW5jbHVkZXMobmV3TmFtZSlcbiAgICAgICAgICAgID8gcmVxdWlyZWQuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gbmV3TmFtZSlcbiAgICAgICAgICAgIDogWy4uLnJlcXVpcmVkLCBuZXdOYW1lXVxuICAgICAgICAgIHBhcmVudFNjaGVtYS5yZXF1aXJlZCA9IG5ld1JlcXVpcmVkXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzY2hlbWEgPSBwYXJlbnRTY2hlbWEucHJvcGVydGllc1tuZXdOYW1lXVxuXG4gICAgICAgIC8vIHR5cGUgY2hhbmdlXG4gICAgICAgIGlmIChvbGRUeXBlICE9PSBuZXdUeXBlKSB7XG4gICAgICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLm9iamVjdCkge1xuICAgICAgICAgICAgZGVsZXRlIHNjaGVtYS5wcm9wZXJ0aWVzXG4gICAgICAgICAgICBkZWxldGUgc2NoZW1hLnJlcXVpcmVkXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzY2hlbWEudHlwZSA9PT0gVHlwZS5hcnJheSlcbiAgICAgICAgICAgIGRlbGV0ZSBzY2hlbWEuaXRlbXNcbiAgICAgICAgICBzd2l0Y2ggKG5ld1R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVHlwZS5vYmplY3Q6XG4gICAgICAgICAgICAgIHNjaGVtYS50eXBlID0gVHlwZS5vYmplY3RcbiAgICAgICAgICAgICAgc2NoZW1hLnByb3BlcnRpZXMgPSB7fVxuICAgICAgICAgICAgICBzY2hlbWEucmVxdWlyZWQgPSBbXVxuICAgICAgICAgICAgICBzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMgPSBmYWxzZVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBBcnJheVR5cGUuc3RyaW5nOlxuICAgICAgICAgICAgICBzY2hlbWEudHlwZSA9IFR5cGUuYXJyYXlcbiAgICAgICAgICAgICAgc2NoZW1hLml0ZW1zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFR5cGUuc3RyaW5nLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIEFycmF5VHlwZS5udW1iZXI6XG4gICAgICAgICAgICAgIHNjaGVtYS50eXBlID0gVHlwZS5hcnJheVxuICAgICAgICAgICAgICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogVHlwZS5udW1iZXIsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgQXJyYXlUeXBlLmJvb2xlYW46XG4gICAgICAgICAgICAvLyAgIHNjaGVtYS50eXBlID0gVHlwZS5hcnJheVxuICAgICAgICAgICAgLy8gICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgICAgICAvLyAgICAgdHlwZTogVHlwZS5ib29sZWFuLFxuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvLyAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIEFycmF5VHlwZS5vYmplY3Q6XG4gICAgICAgICAgICAgIHNjaGVtYS50eXBlID0gVHlwZS5hcnJheVxuICAgICAgICAgICAgICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogVHlwZS5vYmplY3QsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFtdLFxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgc2NoZW1hLnR5cGUgPSBuZXdUeXBlIGFzIFR5cGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvdGhlciBvcHRpb25zIGNoYW5nZVxuICAgICAgICBzY2hlbWEuZGVzY3JpcHRpb24gPSBmaWVsZHMuZGVzY3JpcHRpb25cbiAgICAgICAgc2NoZW1hLmVudW0gPSBmaWVsZHMuZW51bVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50U2NoZW1hLnR5cGUgPT09IFR5cGUuYXJyYXkgJiYgcGFyZW50U2NoZW1hLml0ZW1zICYmIHBhcmVudFNjaGVtYS5pdGVtcy50eXBlID09PSBUeXBlLm9iamVjdCAmJiBwYXJlbnRTY2hlbWEuaXRlbXMucHJvcGVydGllcykge1xuICAgICAgICAvLyBuYW1lIGNoYW5nZVxuICAgICAgICBpZiAob2xkTmFtZSAhPT0gbmV3TmFtZSkge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwYXJlbnRTY2hlbWEuaXRlbXMucHJvcGVydGllcyB8fCB7fVxuICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW25ld05hbWVdKSB7XG4gICAgICAgICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnUHJvcGVydHkgbmFtZSBhbHJlYWR5IGV4aXN0cycsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgc2FtZVByb3BlcnR5TmFtZUVycm9yID0gdHJ1ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG5ld1Byb3BlcnRpZXMgPSBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBhY2Nba2V5ID09PSBvbGROYW1lID8gbmV3TmFtZSA6IGtleV0gPSB2YWx1ZVxuICAgICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIEZpZWxkPilcbiAgICAgICAgICBjb25zdCByZXF1aXJlZCA9IHBhcmVudFNjaGVtYS5pdGVtcy5yZXF1aXJlZCB8fCBbXVxuICAgICAgICAgIGNvbnN0IG5ld1JlcXVpcmVkID0gcHJvZHVjZShyZXF1aXJlZCwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGRyYWZ0LmluZGV4T2Yob2xkTmFtZSlcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgIGRyYWZ0LnNwbGljZShpbmRleCwgMSwgbmV3TmFtZSlcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgcGFyZW50U2NoZW1hLml0ZW1zLnByb3BlcnRpZXMgPSBuZXdQcm9wZXJ0aWVzXG4gICAgICAgICAgcGFyZW50U2NoZW1hLml0ZW1zLnJlcXVpcmVkID0gbmV3UmVxdWlyZWRcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlcXVpcmVkIGNoYW5nZVxuICAgICAgICBpZiAob2xkUmVxdWlyZWQgIT09IG5ld1JlcXVpcmVkKSB7XG4gICAgICAgICAgY29uc3QgcmVxdWlyZWQgPSBwYXJlbnRTY2hlbWEuaXRlbXMucmVxdWlyZWQgfHwgW11cbiAgICAgICAgICBjb25zdCBuZXdSZXF1aXJlZCA9IHJlcXVpcmVkLmluY2x1ZGVzKG5ld05hbWUpXG4gICAgICAgICAgICA/IHJlcXVpcmVkLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IG5ld05hbWUpXG4gICAgICAgICAgICA6IFsuLi5yZXF1aXJlZCwgbmV3TmFtZV1cbiAgICAgICAgICBwYXJlbnRTY2hlbWEuaXRlbXMucmVxdWlyZWQgPSBuZXdSZXF1aXJlZFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2NoZW1hID0gcGFyZW50U2NoZW1hLml0ZW1zLnByb3BlcnRpZXNbbmV3TmFtZV1cbiAgICAgICAgLy8gdHlwZSBjaGFuZ2VcbiAgICAgICAgaWYgKG9sZFR5cGUgIT09IG5ld1R5cGUpIHtcbiAgICAgICAgICBpZiAoc2NoZW1hLnR5cGUgPT09IFR5cGUub2JqZWN0KSB7XG4gICAgICAgICAgICBkZWxldGUgc2NoZW1hLnByb3BlcnRpZXNcbiAgICAgICAgICAgIGRlbGV0ZSBzY2hlbWEucmVxdWlyZWRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNjaGVtYS50eXBlID09PSBUeXBlLmFycmF5KVxuICAgICAgICAgICAgZGVsZXRlIHNjaGVtYS5pdGVtc1xuICAgICAgICAgIHN3aXRjaCAobmV3VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUeXBlLm9iamVjdDpcbiAgICAgICAgICAgICAgc2NoZW1hLnR5cGUgPSBUeXBlLm9iamVjdFxuICAgICAgICAgICAgICBzY2hlbWEucHJvcGVydGllcyA9IHt9XG4gICAgICAgICAgICAgIHNjaGVtYS5yZXF1aXJlZCA9IFtdXG4gICAgICAgICAgICAgIHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyA9IGZhbHNlXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIEFycmF5VHlwZS5zdHJpbmc6XG4gICAgICAgICAgICAgIHNjaGVtYS50eXBlID0gVHlwZS5hcnJheVxuICAgICAgICAgICAgICBzY2hlbWEuaXRlbXMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogVHlwZS5zdHJpbmcsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgQXJyYXlUeXBlLm51bWJlcjpcbiAgICAgICAgICAgICAgc2NoZW1hLnR5cGUgPSBUeXBlLmFycmF5XG4gICAgICAgICAgICAgIHNjaGVtYS5pdGVtcyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBUeXBlLm51bWJlcixcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgLy8gY2FzZSBBcnJheVR5cGUuYm9vbGVhbjpcbiAgICAgICAgICAgIC8vICAgc2NoZW1hLnR5cGUgPSBUeXBlLmFycmF5XG4gICAgICAgICAgICAvLyAgIHNjaGVtYS5pdGVtcyA9IHtcbiAgICAgICAgICAgIC8vICAgICB0eXBlOiBUeXBlLmJvb2xlYW4sXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgQXJyYXlUeXBlLm9iamVjdDpcbiAgICAgICAgICAgICAgc2NoZW1hLnR5cGUgPSBUeXBlLmFycmF5XG4gICAgICAgICAgICAgIHNjaGVtYS5pdGVtcyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBUeXBlLm9iamVjdCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogW10sXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBzY2hlbWEudHlwZSA9IG5ld1R5cGUgYXMgVHlwZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyIG9wdGlvbnMgY2hhbmdlXG4gICAgICAgIHNjaGVtYS5kZXNjcmlwdGlvbiA9IGZpZWxkcy5kZXNjcmlwdGlvblxuICAgICAgICBzY2hlbWEuZW51bSA9IGZpZWxkcy5lbnVtXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoc2FtZVByb3BlcnR5TmFtZUVycm9yKVxuICAgICAgcmV0dXJuXG4gICAgb25DaGFuZ2UobmV3U2NoZW1hKVxuICAgIGVtaXQoJ2ZpZWxkQ2hhbmdlU3VjY2VzcycpXG4gIH0pXG59XG4iXX0=