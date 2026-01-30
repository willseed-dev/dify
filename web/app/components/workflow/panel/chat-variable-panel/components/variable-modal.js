"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const uuid_1 = require("uuid");
const button_1 = require("@/app/components/base/button");
const input_1 = require("@/app/components/base/input");
const toast_1 = require("@/app/components/base/toast");
const code_editor_1 = require("@/app/components/workflow/nodes/_base/components/editor/code-editor");
const types_1 = require("@/app/components/workflow/nodes/code/types");
const array_value_list_1 = require("@/app/components/workflow/panel/chat-variable-panel/components/array-value-list");
const object_value_item_1 = require("@/app/components/workflow/panel/chat-variable-panel/components/object-value-item");
const object_value_list_1 = require("@/app/components/workflow/panel/chat-variable-panel/components/object-value-list");
const variable_type_select_1 = require("@/app/components/workflow/panel/chat-variable-panel/components/variable-type-select");
const type_1 = require("@/app/components/workflow/panel/chat-variable-panel/type");
const utils_1 = require("@/app/components/workflow/panel/chat-variable-panel/utils");
const store_1 = require("@/app/components/workflow/store");
const classnames_1 = require("@/utils/classnames");
const var_1 = require("@/utils/var");
const array_bool_list_1 = require("./array-bool-list");
const bool_value_1 = require("./bool-value");
const typeList = [
    type_1.ChatVarType.String,
    type_1.ChatVarType.Number,
    type_1.ChatVarType.Boolean,
    type_1.ChatVarType.Object,
    type_1.ChatVarType.ArrayString,
    type_1.ChatVarType.ArrayNumber,
    type_1.ChatVarType.ArrayBoolean,
    type_1.ChatVarType.ArrayObject,
];
const ChatVariableModal = ({ chatVar, onClose, onSave, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const varList = (0, store_1.useStore)(s => s.conversationVariables);
    const [name, setName] = React.useState('');
    const [type, setType] = React.useState(type_1.ChatVarType.String);
    const [value, setValue] = React.useState();
    const [objectValue, setObjectValue] = React.useState([object_value_item_1.DEFAULT_OBJECT_VALUE]);
    const [editorContent, setEditorContent] = React.useState();
    const [editInJSON, setEditInJSON] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const editorMinHeight = (0, react_2.useMemo)(() => {
        if (type === type_1.ChatVarType.ArrayObject)
            return '240px';
        return '120px';
    }, [type]);
    const placeholder = (0, react_2.useMemo)(() => {
        if (type === type_1.ChatVarType.ArrayString)
            return utils_1.arrayStringPlaceholder;
        if (type === type_1.ChatVarType.ArrayNumber)
            return utils_1.arrayNumberPlaceholder;
        if (type === type_1.ChatVarType.ArrayObject)
            return utils_1.arrayObjectPlaceholder;
        if (type === type_1.ChatVarType.ArrayBoolean)
            return utils_1.arrayBoolPlaceholder;
        return utils_1.objectPlaceholder;
    }, [type]);
    const getObjectValue = (0, react_2.useCallback)(() => {
        if (!chatVar || Object.keys(chatVar.value).length === 0)
            return [object_value_item_1.DEFAULT_OBJECT_VALUE];
        return Object.keys(chatVar.value).map((key) => {
            return {
                key,
                type: typeof chatVar.value[key] === 'string' ? type_1.ChatVarType.String : type_1.ChatVarType.Number,
                value: chatVar.value[key],
            };
        });
    }, [chatVar]);
    const formatValueFromObject = (0, react_2.useCallback)((list) => {
        return list.reduce((acc, curr) => {
            if (curr.key)
                acc[curr.key] = curr.value || null;
            return acc;
        }, {});
    }, []);
    const formatValue = (value) => {
        switch (type) {
            case type_1.ChatVarType.String:
                return value || '';
            case type_1.ChatVarType.Number:
                return value || 0;
            case type_1.ChatVarType.Boolean:
                return value === undefined ? true : value;
            case type_1.ChatVarType.Object:
                return editInJSON ? value : formatValueFromObject(objectValue);
            case type_1.ChatVarType.ArrayString:
            case type_1.ChatVarType.ArrayNumber:
            case type_1.ChatVarType.ArrayObject:
                return value?.filter(Boolean) || [];
            case type_1.ChatVarType.ArrayBoolean:
                return value || [];
        }
    };
    const checkVariableName = (value) => {
        const { isValid, errorMessageKey } = (0, var_1.checkKeys)([value], false);
        if (!isValid) {
            notify({
                type: 'error',
                message: t(`varKeyError.${errorMessageKey}`, { ns: 'appDebug', key: t('env.modal.name', { ns: 'workflow' }) }),
            });
            return false;
        }
        return true;
    };
    const handleVarNameChange = (e) => {
        (0, var_1.replaceSpaceWithUnderscoreInVarNameInput)(e.target);
        if (!!e.target.value && !checkVariableName(e.target.value))
            return;
        setName(e.target.value || '');
    };
    const handleTypeChange = (v) => {
        setValue(undefined);
        setEditorContent(undefined);
        if (v === type_1.ChatVarType.ArrayObject)
            setEditInJSON(true);
        if (v === type_1.ChatVarType.String || v === type_1.ChatVarType.Number || v === type_1.ChatVarType.Object)
            setEditInJSON(false);
        if (v === type_1.ChatVarType.Boolean)
            setValue(false);
        if (v === type_1.ChatVarType.ArrayBoolean)
            setValue([false]);
        setType(v);
    };
    const handleEditorChange = (editInJSON) => {
        if (type === type_1.ChatVarType.Object) {
            if (editInJSON) {
                const newValue = !objectValue[0].key ? undefined : formatValueFromObject(objectValue);
                setValue(newValue);
                setEditorContent(JSON.stringify(newValue));
            }
            else {
                if (!editorContent) {
                    setValue(undefined);
                    setObjectValue([object_value_item_1.DEFAULT_OBJECT_VALUE]);
                }
                else {
                    try {
                        const newValue = JSON.parse(editorContent);
                        setValue(newValue);
                        const newObjectValue = Object.keys(newValue).map((key) => {
                            return {
                                key,
                                type: typeof newValue[key] === 'string' ? type_1.ChatVarType.String : type_1.ChatVarType.Number,
                                value: newValue[key],
                            };
                        });
                        setObjectValue(newObjectValue);
                    }
                    catch {
                        // ignore JSON.parse errors
                    }
                }
            }
        }
        if (type === type_1.ChatVarType.ArrayString || type === type_1.ChatVarType.ArrayNumber) {
            if (editInJSON) {
                const newValue = (value?.length && value.filter(Boolean).length) ? value.filter(Boolean) : undefined;
                setValue(newValue);
                if (!editorContent)
                    setEditorContent(JSON.stringify(newValue));
            }
            else {
                setValue(value?.length ? value : [undefined]);
            }
        }
        if (type === type_1.ChatVarType.ArrayBoolean) {
            if (editInJSON)
                setEditorContent(JSON.stringify(value.map((item) => item ? 'True' : 'False')));
        }
        setEditInJSON(editInJSON);
    };
    const handleEditorValueChange = (content) => {
        if (!content) {
            setEditorContent(content);
            return setValue(undefined);
        }
        else {
            setEditorContent(content);
            try {
                let newValue = JSON.parse(content);
                if (type === type_1.ChatVarType.ArrayBoolean) {
                    newValue = newValue.map((item) => {
                        if (item === 'True' || item === 'true' || item === true)
                            return true;
                        if (item === 'False' || item === 'false' || item === false)
                            return false;
                        return undefined;
                    }).filter((item) => item !== undefined);
                }
                setValue(newValue);
            }
            catch {
                // ignore JSON.parse errors
            }
        }
    };
    const handleSave = () => {
        if (!checkVariableName(name))
            return;
        if (!chatVar && varList.some(chatVar => chatVar.name === name))
            return notify({ type: 'error', message: 'name is existed' });
        // if (type !== ChatVarType.Object && !value)
        //   return notify({ type: 'error', message: 'value can not be empty' })
        if (type === type_1.ChatVarType.Object && objectValue.some(item => !item.key && !!item.value))
            return notify({ type: 'error', message: 'object key can not be empty' });
        onSave({
            id: chatVar ? chatVar.id : (0, uuid_1.v4)(),
            name,
            value_type: type,
            value: formatValue(value),
            description,
        });
        onClose();
    };
    (0, react_2.useEffect)(() => {
        if (chatVar) {
            setName(chatVar.name);
            setType(chatVar.value_type);
            setValue(chatVar.value);
            setDescription(chatVar.description);
            setObjectValue(getObjectValue());
            if (chatVar.value_type === type_1.ChatVarType.ArrayObject) {
                setEditorContent(JSON.stringify(chatVar.value));
                setEditInJSON(true);
            }
            else {
                setEditInJSON(false);
            }
        }
    }, [chatVar, getObjectValue]);
    return (<div className={(0, classnames_1.cn)('flex h-full w-[360px] flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-2xl', type === type_1.ChatVarType.Object && 'w-[480px]')}>
      <div className="system-xl-semibold mb-3 flex shrink-0 items-center justify-between p-4 pb-0 text-text-primary">
        {!chatVar ? t('chatVariable.modal.title', { ns: 'workflow' }) : t('chatVariable.modal.editTitle', { ns: 'workflow' })}
        <div className="flex items-center">
          <div className="flex h-6 w-6 cursor-pointer items-center justify-center" onClick={onClose}>
            <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
          </div>
        </div>
      </div>
      <div className="max-h-[480px] overflow-y-auto px-4 py-2">
        {/* name */}
        <div className="mb-4">
          <div className="system-sm-semibold mb-1 flex h-6 items-center text-text-secondary">{t('chatVariable.modal.name', { ns: 'workflow' })}</div>
          <div className="flex">
            <input_1.default placeholder={t('chatVariable.modal.namePlaceholder', { ns: 'workflow' }) || ''} value={name} onChange={handleVarNameChange} onBlur={e => checkVariableName(e.target.value)} type="text"/>
          </div>
        </div>
        {/* type */}
        <div className="mb-4">
          <div className="system-sm-semibold mb-1 flex h-6 items-center text-text-secondary">{t('chatVariable.modal.type', { ns: 'workflow' })}</div>
          <div className="flex">
            <variable_type_select_1.default value={type} list={typeList} onSelect={handleTypeChange} popupClassName="w-[327px]"/>
          </div>
        </div>
        {/* default value */}
        <div className="mb-4">
          <div className="system-sm-semibold mb-1 flex h-6 items-center justify-between text-text-secondary">
            <div>{t('chatVariable.modal.value', { ns: 'workflow' })}</div>
            {(type === type_1.ChatVarType.ArrayString || type === type_1.ChatVarType.ArrayNumber || type === type_1.ChatVarType.ArrayBoolean) && (<button_1.default variant="ghost" size="small" className="text-text-tertiary" onClick={() => handleEditorChange(!editInJSON)}>
                {editInJSON ? <react_1.RiInputField className="mr-1 h-3.5 w-3.5"/> : <react_1.RiDraftLine className="mr-1 h-3.5 w-3.5"/>}
                {editInJSON ? t('chatVariable.modal.oneByOne', { ns: 'workflow' }) : t('chatVariable.modal.editInJSON', { ns: 'workflow' })}
              </button_1.default>)}
            {type === type_1.ChatVarType.Object && (<button_1.default variant="ghost" size="small" className="text-text-tertiary" onClick={() => handleEditorChange(!editInJSON)}>
                {editInJSON ? <react_1.RiInputField className="mr-1 h-3.5 w-3.5"/> : <react_1.RiDraftLine className="mr-1 h-3.5 w-3.5"/>}
                {editInJSON ? t('chatVariable.modal.editInForm', { ns: 'workflow' }) : t('chatVariable.modal.editInJSON', { ns: 'workflow' })}
              </button_1.default>)}
          </div>
          <div className="flex">
            {type === type_1.ChatVarType.String && (
        // Input will remove \n\r, so use Textarea just like description area
        <textarea className="system-sm-regular placeholder:system-sm-regular block h-20 w-full resize-none appearance-none rounded-lg border border-transparent bg-components-input-bg-normal p-2 text-components-input-text-filled caret-primary-600 outline-none placeholder:text-components-input-text-placeholder hover:border-components-input-border-hover hover:bg-components-input-bg-hover focus:border-components-input-border-active focus:bg-components-input-bg-active focus:shadow-xs" value={value} placeholder={t('chatVariable.modal.valuePlaceholder', { ns: 'workflow' }) || ''} onChange={e => setValue(e.target.value)}/>)}
            {type === type_1.ChatVarType.Number && (<input_1.default placeholder={t('chatVariable.modal.valuePlaceholder', { ns: 'workflow' }) || ''} value={value} onChange={e => setValue(Number(e.target.value))} type="number"/>)}
            {type === type_1.ChatVarType.Boolean && (<bool_value_1.default value={value} onChange={setValue}/>)}
            {type === type_1.ChatVarType.Object && !editInJSON && (<object_value_list_1.default list={objectValue} onChange={setObjectValue}/>)}
            {type === type_1.ChatVarType.ArrayString && !editInJSON && (<array_value_list_1.default isString list={value || [undefined]} onChange={setValue}/>)}
            {type === type_1.ChatVarType.ArrayNumber && !editInJSON && (<array_value_list_1.default isString={false} list={value || [undefined]} onChange={setValue}/>)}
            {type === type_1.ChatVarType.ArrayBoolean && !editInJSON && (<array_bool_list_1.default list={value || [true]} onChange={setValue}/>)}

            {editInJSON && (<div className="w-full rounded-[10px] bg-components-input-bg-normal py-2 pl-3 pr-1" style={{ height: editorMinHeight }}>
                <code_editor_1.default isExpand noWrapper language={types_1.CodeLanguage.json} value={editorContent} placeholder={<div className="whitespace-pre">{placeholder}</div>} onChange={handleEditorValueChange}/>
              </div>)}
          </div>
        </div>
        {/* description */}
        <div className="">
          <div className="system-sm-semibold mb-1 flex h-6 items-center text-text-secondary">{t('chatVariable.modal.description', { ns: 'workflow' })}</div>
          <div className="flex">
            <textarea className="system-sm-regular placeholder:system-sm-regular block h-20 w-full resize-none appearance-none rounded-lg border border-transparent bg-components-input-bg-normal p-2 text-components-input-text-filled caret-primary-600 outline-none placeholder:text-components-input-text-placeholder hover:border-components-input-border-hover hover:bg-components-input-bg-hover focus:border-components-input-border-active focus:bg-components-input-bg-active focus:shadow-xs" value={description} placeholder={t('chatVariable.modal.descriptionPlaceholder', { ns: 'workflow' }) || ''} onChange={e => setDescription(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse rounded-b-2xl p-4 pt-2">
        <div className="flex gap-2">
          <button_1.default onClick={onClose}>{t('operation.cancel', { ns: 'common' })}</button_1.default>
          <button_1.default variant="primary" onClick={handleSave}>{t('operation.save', { ns: 'common' })}</button_1.default>
        </div>
      </div>
    </div>);
};
exports.default = ChatVariableModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtbW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YXJpYWJsZS1tb2RhbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0Q0FBeUU7QUFDekUsK0JBQThCO0FBQzlCLGlDQUF1RDtBQUN2RCxpREFBOEM7QUFDOUMsK0RBQWlEO0FBQ2pELCtCQUFrQztBQUNsQyx5REFBaUQ7QUFDakQsdURBQStDO0FBQy9DLHVEQUEwRDtBQUMxRCxxR0FBNEY7QUFDNUYsc0VBQXlFO0FBQ3pFLHNIQUE0RztBQUM1Ryx3SEFBdUg7QUFDdkgsd0hBQThHO0FBQzlHLDhIQUFzSDtBQUN0SCxtRkFBc0Y7QUFDdEYscUZBTWtFO0FBQ2xFLDJEQUEwRDtBQUMxRCxtREFBdUM7QUFDdkMscUNBQWlGO0FBQ2pGLHVEQUE2QztBQUM3Qyw2Q0FBb0M7QUFjcEMsTUFBTSxRQUFRLEdBQUc7SUFDZixrQkFBVyxDQUFDLE1BQU07SUFDbEIsa0JBQVcsQ0FBQyxNQUFNO0lBQ2xCLGtCQUFXLENBQUMsT0FBTztJQUNuQixrQkFBVyxDQUFDLE1BQU07SUFDbEIsa0JBQVcsQ0FBQyxXQUFXO0lBQ3ZCLGtCQUFXLENBQUMsV0FBVztJQUN2QixrQkFBVyxDQUFDLFlBQVk7SUFDeEIsa0JBQVcsQ0FBQyxXQUFXO0NBQ3hCLENBQUE7QUFFRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsRUFDekIsT0FBTyxFQUNQLE9BQU8sRUFDUCxNQUFNLEdBQ1MsRUFBRSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxpQ0FBVSxFQUFDLG9CQUFZLENBQUMsQ0FBQTtJQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQTtJQUN0RCxNQUFNLENBQUMsSUFBSSxF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QyxDQUN0RixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBRWxEO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDhDQUE4QyxDQUMzRDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQ3pCO1VBQUEsQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBTSxDQUMzRTtVQUFBLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBTSxDQUNoRztRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgUmlDbG9zZUxpbmUsIFJpRHJhZnRMaW5lLCBSaUlucHV0RmllbGQgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgeyB2NCBhcyB1dWlkNCB9IGZyb20gJ3V1aWQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgSW5wdXQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2lucHV0J1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IENvZGVFZGl0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2VkaXRvci9jb2RlLWVkaXRvcidcbmltcG9ydCB7IENvZGVMYW5ndWFnZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvY29kZS90eXBlcydcbmltcG9ydCBBcnJheVZhbHVlTGlzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3BhbmVsL2NoYXQtdmFyaWFibGUtcGFuZWwvY29tcG9uZW50cy9hcnJheS12YWx1ZS1saXN0J1xuaW1wb3J0IHsgREVGQVVMVF9PQkpFQ1RfVkFMVUUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3BhbmVsL2NoYXQtdmFyaWFibGUtcGFuZWwvY29tcG9uZW50cy9vYmplY3QtdmFsdWUtaXRlbSdcbmltcG9ydCBPYmplY3RWYWx1ZUxpc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wYW5lbC9jaGF0LXZhcmlhYmxlLXBhbmVsL2NvbXBvbmVudHMvb2JqZWN0LXZhbHVlLWxpc3QnXG5pbXBvcnQgVmFyaWFibGVUeXBlU2VsZWN0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wYW5lbC9jaGF0LXZhcmlhYmxlLXBhbmVsL2NvbXBvbmVudHMvdmFyaWFibGUtdHlwZS1zZWxlY3QnXG5pbXBvcnQgeyBDaGF0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcGFuZWwvY2hhdC12YXJpYWJsZS1wYW5lbC90eXBlJ1xuaW1wb3J0IHtcbiAgYXJyYXlCb29sUGxhY2Vob2xkZXIsXG4gIGFycmF5TnVtYmVyUGxhY2Vob2xkZXIsXG4gIGFycmF5T2JqZWN0UGxhY2Vob2xkZXIsXG4gIGFycmF5U3RyaW5nUGxhY2Vob2xkZXIsXG4gIG9iamVjdFBsYWNlaG9sZGVyLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3BhbmVsL2NoYXQtdmFyaWFibGUtcGFuZWwvdXRpbHMnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCB7IGNoZWNrS2V5cywgcmVwbGFjZVNwYWNlV2l0aFVuZGVyc2NvcmVJblZhck5hbWVJbnB1dCB9IGZyb20gJ0AvdXRpbHMvdmFyJ1xuaW1wb3J0IEFycmF5Qm9vbExpc3QgZnJvbSAnLi9hcnJheS1ib29sLWxpc3QnXG5pbXBvcnQgQm9vbFZhbHVlIGZyb20gJy4vYm9vbC12YWx1ZSdcblxuZXhwb3J0IHR5cGUgTW9kYWxQcm9wc1R5cGUgPSB7XG4gIGNoYXRWYXI/OiBDb252ZXJzYXRpb25WYXJpYWJsZVxuICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gIG9uU2F2ZTogKGNoYXRWYXI6IENvbnZlcnNhdGlvblZhcmlhYmxlKSA9PiB2b2lkXG59XG5cbnR5cGUgT2JqZWN0VmFsdWVJdGVtID0ge1xuICBrZXk6IHN0cmluZ1xuICB0eXBlOiBDaGF0VmFyVHlwZVxuICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkXG59XG5cbmNvbnN0IHR5cGVMaXN0ID0gW1xuICBDaGF0VmFyVHlwZS5TdHJpbmcsXG4gIENoYXRWYXJUeXBlLk51bWJlcixcbiAgQ2hhdFZhclR5cGUuQm9vbGVhbixcbiAgQ2hhdFZhclR5cGUuT2JqZWN0LFxuICBDaGF0VmFyVHlwZS5BcnJheVN0cmluZyxcbiAgQ2hhdFZhclR5cGUuQXJyYXlOdW1iZXIsXG4gIENoYXRWYXJUeXBlLkFycmF5Qm9vbGVhbixcbiAgQ2hhdFZhclR5cGUuQXJyYXlPYmplY3QsXG5dXG5cbmNvbnN0IENoYXRWYXJpYWJsZU1vZGFsID0gKHtcbiAgY2hhdFZhcixcbiAgb25DbG9zZSxcbiAgb25TYXZlLFxufTogTW9kYWxQcm9wc1R5cGUpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VDb250ZXh0KFRvYXN0Q29udGV4dClcbiAgY29uc3QgdmFyTGlzdCA9IHVzZVN0b3JlKHMgPT4gcy5jb252ZXJzYXRpb25WYXJpYWJsZXMpXG4gIGNvbnN0IFtuYW1lLCBzZXROYW1lXSA9IFJlYWN0LnVzZVN0YXRlKCcnKVxuICBjb25zdCBbdHlwZSwgc2V0VHlwZV0gPSBSZWFjdC51c2VTdGF0ZTxDaGF0VmFyVHlwZT4oQ2hhdFZhclR5cGUuU3RyaW5nKVxuICBjb25zdCBbdmFsdWUsIHNldFZhbHVlXSA9IFJlYWN0LnVzZVN0YXRlPGFueT4oKVxuICBjb25zdCBbb2JqZWN0VmFsdWUsIHNldE9iamVjdFZhbHVlXSA9IFJlYWN0LnVzZVN0YXRlPE9iamVjdFZhbHVlSXRlbVtdPihbREVGQVVMVF9PQkpFQ1RfVkFMVUVdKVxuICBjb25zdCBbZWRpdG9yQ29udGVudCwgc2V0RWRpdG9yQ29udGVudF0gPSBSZWFjdC51c2VTdGF0ZTxzdHJpbmc+KClcbiAgY29uc3QgW2VkaXRJbkpTT04sIHNldEVkaXRJbkpTT05dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtkZXNjcmlwdGlvbiwgc2V0RGVzY3JpcHRpb25dID0gUmVhY3QudXNlU3RhdGU8c3RyaW5nPignJylcblxuICBjb25zdCBlZGl0b3JNaW5IZWlnaHQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAodHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlPYmplY3QpXG4gICAgICByZXR1cm4gJzI0MHB4J1xuICAgIHJldHVybiAnMTIwcHgnXG4gIH0sIFt0eXBlXSlcbiAgY29uc3QgcGxhY2Vob2xkZXIgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAodHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlTdHJpbmcpXG4gICAgICByZXR1cm4gYXJyYXlTdHJpbmdQbGFjZWhvbGRlclxuICAgIGlmICh0eXBlID09PSBDaGF0VmFyVHlwZS5BcnJheU51bWJlcilcbiAgICAgIHJldHVybiBhcnJheU51bWJlclBsYWNlaG9sZGVyXG4gICAgaWYgKHR5cGUgPT09IENoYXRWYXJUeXBlLkFycmF5T2JqZWN0KVxuICAgICAgcmV0dXJuIGFycmF5T2JqZWN0UGxhY2Vob2xkZXJcbiAgICBpZiAodHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlCb29sZWFuKVxuICAgICAgcmV0dXJuIGFycmF5Qm9vbFBsYWNlaG9sZGVyXG4gICAgcmV0dXJuIG9iamVjdFBsYWNlaG9sZGVyXG4gIH0sIFt0eXBlXSlcbiAgY29uc3QgZ2V0T2JqZWN0VmFsdWUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKCFjaGF0VmFyIHx8IE9iamVjdC5rZXlzKGNoYXRWYXIudmFsdWUpLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBbREVGQVVMVF9PQkpFQ1RfVkFMVUVdXG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoY2hhdFZhci52YWx1ZSkubWFwKChrZXkpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleSxcbiAgICAgICAgdHlwZTogdHlwZW9mIGNoYXRWYXIudmFsdWVba2V5XSA9PT0gJ3N0cmluZycgPyBDaGF0VmFyVHlwZS5TdHJpbmcgOiBDaGF0VmFyVHlwZS5OdW1iZXIsXG4gICAgICAgIHZhbHVlOiBjaGF0VmFyLnZhbHVlW2tleV0sXG4gICAgICB9XG4gICAgfSlcbiAgfSwgW2NoYXRWYXJdKVxuICBjb25zdCBmb3JtYXRWYWx1ZUZyb21PYmplY3QgPSB1c2VDYWxsYmFjaygobGlzdDogT2JqZWN0VmFsdWVJdGVtW10pID0+IHtcbiAgICByZXR1cm4gbGlzdC5yZWR1Y2UoKGFjYzogYW55LCBjdXJyKSA9PiB7XG4gICAgICBpZiAoY3Vyci5rZXkpXG4gICAgICAgIGFjY1tjdXJyLmtleV0gPSBjdXJyLnZhbHVlIHx8IG51bGxcbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSlcbiAgfSwgW10pXG5cbiAgY29uc3QgZm9ybWF0VmFsdWUgPSAodmFsdWU6IGFueSkgPT4ge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBDaGF0VmFyVHlwZS5TdHJpbmc6XG4gICAgICAgIHJldHVybiB2YWx1ZSB8fCAnJ1xuICAgICAgY2FzZSBDaGF0VmFyVHlwZS5OdW1iZXI6XG4gICAgICAgIHJldHVybiB2YWx1ZSB8fCAwXG4gICAgICBjYXNlIENoYXRWYXJUeXBlLkJvb2xlYW46XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHZhbHVlXG4gICAgICBjYXNlIENoYXRWYXJUeXBlLk9iamVjdDpcbiAgICAgICAgcmV0dXJuIGVkaXRJbkpTT04gPyB2YWx1ZSA6IGZvcm1hdFZhbHVlRnJvbU9iamVjdChvYmplY3RWYWx1ZSlcbiAgICAgIGNhc2UgQ2hhdFZhclR5cGUuQXJyYXlTdHJpbmc6XG4gICAgICBjYXNlIENoYXRWYXJUeXBlLkFycmF5TnVtYmVyOlxuICAgICAgY2FzZSBDaGF0VmFyVHlwZS5BcnJheU9iamVjdDpcbiAgICAgICAgcmV0dXJuIHZhbHVlPy5maWx0ZXIoQm9vbGVhbikgfHwgW11cbiAgICAgIGNhc2UgQ2hhdFZhclR5cGUuQXJyYXlCb29sZWFuOlxuICAgICAgICByZXR1cm4gdmFsdWUgfHwgW11cbiAgICB9XG4gIH1cblxuICBjb25zdCBjaGVja1ZhcmlhYmxlTmFtZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBpc1ZhbGlkLCBlcnJvck1lc3NhZ2VLZXkgfSA9IGNoZWNrS2V5cyhbdmFsdWVdLCBmYWxzZSlcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IHQoYHZhcktleUVycm9yLiR7ZXJyb3JNZXNzYWdlS2V5fWAsIHsgbnM6ICdhcHBEZWJ1ZycsIGtleTogdCgnZW52Lm1vZGFsLm5hbWUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pLFxuICAgICAgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVmFyTmFtZUNoYW5nZSA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgIHJlcGxhY2VTcGFjZVdpdGhVbmRlcnNjb3JlSW5WYXJOYW1lSW5wdXQoZS50YXJnZXQpXG4gICAgaWYgKCEhZS50YXJnZXQudmFsdWUgJiYgIWNoZWNrVmFyaWFibGVOYW1lKGUudGFyZ2V0LnZhbHVlKSlcbiAgICAgIHJldHVyblxuICAgIHNldE5hbWUoZS50YXJnZXQudmFsdWUgfHwgJycpXG4gIH1cblxuICBjb25zdCBoYW5kbGVUeXBlQ2hhbmdlID0gKHY6IENoYXRWYXJUeXBlKSA9PiB7XG4gICAgc2V0VmFsdWUodW5kZWZpbmVkKVxuICAgIHNldEVkaXRvckNvbnRlbnQodW5kZWZpbmVkKVxuICAgIGlmICh2ID09PSBDaGF0VmFyVHlwZS5BcnJheU9iamVjdClcbiAgICAgIHNldEVkaXRJbkpTT04odHJ1ZSlcbiAgICBpZiAodiA9PT0gQ2hhdFZhclR5cGUuU3RyaW5nIHx8IHYgPT09IENoYXRWYXJUeXBlLk51bWJlciB8fCB2ID09PSBDaGF0VmFyVHlwZS5PYmplY3QpXG4gICAgICBzZXRFZGl0SW5KU09OKGZhbHNlKVxuICAgIGlmICh2ID09PSBDaGF0VmFyVHlwZS5Cb29sZWFuKVxuICAgICAgc2V0VmFsdWUoZmFsc2UpXG4gICAgaWYgKHYgPT09IENoYXRWYXJUeXBlLkFycmF5Qm9vbGVhbilcbiAgICAgIHNldFZhbHVlKFtmYWxzZV0pXG4gICAgc2V0VHlwZSh2KVxuICB9XG5cbiAgY29uc3QgaGFuZGxlRWRpdG9yQ2hhbmdlID0gKGVkaXRJbkpTT046IGJvb2xlYW4pID0+IHtcbiAgICBpZiAodHlwZSA9PT0gQ2hhdFZhclR5cGUuT2JqZWN0KSB7XG4gICAgICBpZiAoZWRpdEluSlNPTikge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9ICFvYmplY3RWYWx1ZVswXS5rZXkgPyB1bmRlZmluZWQgOiBmb3JtYXRWYWx1ZUZyb21PYmplY3Qob2JqZWN0VmFsdWUpXG4gICAgICAgIHNldFZhbHVlKG5ld1ZhbHVlKVxuICAgICAgICBzZXRFZGl0b3JDb250ZW50KEpTT04uc3RyaW5naWZ5KG5ld1ZhbHVlKSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoIWVkaXRvckNvbnRlbnQpIHtcbiAgICAgICAgICBzZXRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICAgICAgc2V0T2JqZWN0VmFsdWUoW0RFRkFVTFRfT0JKRUNUX1ZBTFVFXSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBKU09OLnBhcnNlKGVkaXRvckNvbnRlbnQpXG4gICAgICAgICAgICBzZXRWYWx1ZShuZXdWYWx1ZSlcbiAgICAgICAgICAgIGNvbnN0IG5ld09iamVjdFZhbHVlID0gT2JqZWN0LmtleXMobmV3VmFsdWUpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVvZiBuZXdWYWx1ZVtrZXldID09PSAnc3RyaW5nJyA/IENoYXRWYXJUeXBlLlN0cmluZyA6IENoYXRWYXJUeXBlLk51bWJlcixcbiAgICAgICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWVba2V5XSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHNldE9iamVjdFZhbHVlKG5ld09iamVjdFZhbHVlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgSlNPTi5wYXJzZSBlcnJvcnNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGUgPT09IENoYXRWYXJUeXBlLkFycmF5U3RyaW5nIHx8IHR5cGUgPT09IENoYXRWYXJUeXBlLkFycmF5TnVtYmVyKSB7XG4gICAgICBpZiAoZWRpdEluSlNPTikge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9ICh2YWx1ZT8ubGVuZ3RoICYmIHZhbHVlLmZpbHRlcihCb29sZWFuKS5sZW5ndGgpID8gdmFsdWUuZmlsdGVyKEJvb2xlYW4pIDogdW5kZWZpbmVkXG4gICAgICAgIHNldFZhbHVlKG5ld1ZhbHVlKVxuICAgICAgICBpZiAoIWVkaXRvckNvbnRlbnQpXG4gICAgICAgICAgc2V0RWRpdG9yQ29udGVudChKU09OLnN0cmluZ2lmeShuZXdWYWx1ZSkpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2V0VmFsdWUodmFsdWU/Lmxlbmd0aCA/IHZhbHVlIDogW3VuZGVmaW5lZF0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IENoYXRWYXJUeXBlLkFycmF5Qm9vbGVhbikge1xuICAgICAgaWYgKGVkaXRJbkpTT04pXG4gICAgICAgIHNldEVkaXRvckNvbnRlbnQoSlNPTi5zdHJpbmdpZnkodmFsdWUubWFwKChpdGVtOiBib29sZWFuKSA9PiBpdGVtID8gJ1RydWUnIDogJ0ZhbHNlJykpKVxuICAgIH1cbiAgICBzZXRFZGl0SW5KU09OKGVkaXRJbkpTT04pXG4gIH1cblxuICBjb25zdCBoYW5kbGVFZGl0b3JWYWx1ZUNoYW5nZSA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHNldEVkaXRvckNvbnRlbnQoY29udGVudClcbiAgICAgIHJldHVybiBzZXRWYWx1ZSh1bmRlZmluZWQpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc2V0RWRpdG9yQ29udGVudChjb250ZW50KVxuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gSlNPTi5wYXJzZShjb250ZW50KVxuICAgICAgICBpZiAodHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlCb29sZWFuKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBuZXdWYWx1ZS5tYXAoKGl0ZW06IHN0cmluZyB8IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSAnVHJ1ZScgfHwgaXRlbSA9PT0gJ3RydWUnIHx8IGl0ZW0gPT09IHRydWUpXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gJ0ZhbHNlJyB8fCBpdGVtID09PSAnZmFsc2UnIHx8IGl0ZW0gPT09IGZhbHNlKVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICB9KS5maWx0ZXIoKGl0ZW0/OiBib29sZWFuKSA9PiBpdGVtICE9PSB1bmRlZmluZWQpXG4gICAgICAgIH1cbiAgICAgICAgc2V0VmFsdWUobmV3VmFsdWUpXG4gICAgICB9XG4gICAgICBjYXRjaCB7XG4gICAgICAgIC8vIGlnbm9yZSBKU09OLnBhcnNlIGVycm9yc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSAoKSA9PiB7XG4gICAgaWYgKCFjaGVja1ZhcmlhYmxlTmFtZShuYW1lKSlcbiAgICAgIHJldHVyblxuICAgIGlmICghY2hhdFZhciAmJiB2YXJMaXN0LnNvbWUoY2hhdFZhciA9PiBjaGF0VmFyLm5hbWUgPT09IG5hbWUpKVxuICAgICAgcmV0dXJuIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6ICduYW1lIGlzIGV4aXN0ZWQnIH0pXG4gICAgLy8gaWYgKHR5cGUgIT09IENoYXRWYXJUeXBlLk9iamVjdCAmJiAhdmFsdWUpXG4gICAgLy8gICByZXR1cm4gbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogJ3ZhbHVlIGNhbiBub3QgYmUgZW1wdHknIH0pXG4gICAgaWYgKHR5cGUgPT09IENoYXRWYXJUeXBlLk9iamVjdCAmJiBvYmplY3RWYWx1ZS5zb21lKGl0ZW0gPT4gIWl0ZW0ua2V5ICYmICEhaXRlbS52YWx1ZSkpXG4gICAgICByZXR1cm4gbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogJ29iamVjdCBrZXkgY2FuIG5vdCBiZSBlbXB0eScgfSlcblxuICAgIG9uU2F2ZSh7XG4gICAgICBpZDogY2hhdFZhciA/IGNoYXRWYXIuaWQgOiB1dWlkNCgpLFxuICAgICAgbmFtZSxcbiAgICAgIHZhbHVlX3R5cGU6IHR5cGUsXG4gICAgICB2YWx1ZTogZm9ybWF0VmFsdWUodmFsdWUpLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgfSlcbiAgICBvbkNsb3NlKClcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNoYXRWYXIpIHtcbiAgICAgIHNldE5hbWUoY2hhdFZhci5uYW1lKVxuICAgICAgc2V0VHlwZShjaGF0VmFyLnZhbHVlX3R5cGUpXG4gICAgICBzZXRWYWx1ZShjaGF0VmFyLnZhbHVlKVxuICAgICAgc2V0RGVzY3JpcHRpb24oY2hhdFZhci5kZXNjcmlwdGlvbilcbiAgICAgIHNldE9iamVjdFZhbHVlKGdldE9iamVjdFZhbHVlKCkpXG4gICAgICBpZiAoY2hhdFZhci52YWx1ZV90eXBlID09PSBDaGF0VmFyVHlwZS5BcnJheU9iamVjdCkge1xuICAgICAgICBzZXRFZGl0b3JDb250ZW50KEpTT04uc3RyaW5naWZ5KGNoYXRWYXIudmFsdWUpKVxuICAgICAgICBzZXRFZGl0SW5KU09OKHRydWUpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2V0RWRpdEluSlNPTihmYWxzZSlcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtjaGF0VmFyLCBnZXRPYmplY3RWYWx1ZV0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NuKCdmbGV4IGgtZnVsbCB3LVszNjBweF0gZmxleC1jb2wgcm91bmRlZC0yeGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgc2hhZG93LTJ4bCcsIHR5cGUgPT09IENoYXRWYXJUeXBlLk9iamVjdCAmJiAndy1bNDgwcHhdJyl9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teGwtc2VtaWJvbGQgbWItMyBmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC00IHBiLTAgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAgeyFjaGF0VmFyID8gdCgnY2hhdFZhcmlhYmxlLm1vZGFsLnRpdGxlJywgeyBuczogJ3dvcmtmbG93JyB9KSA6IHQoJ2NoYXRWYXJpYWJsZS5tb2RhbC5lZGl0VGl0bGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTYgdy02IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC1oLVs0ODBweF0gb3ZlcmZsb3cteS1hdXRvIHB4LTQgcHktMlwiPlxuICAgICAgICB7LyogbmFtZSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgbWItMSBmbGV4IGgtNiBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdjaGF0VmFyaWFibGUubW9kYWwubmFtZScsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2NoYXRWYXJpYWJsZS5tb2RhbC5uYW1lUGxhY2Vob2xkZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pIHx8ICcnfVxuICAgICAgICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVZhck5hbWVDaGFuZ2V9XG4gICAgICAgICAgICAgIG9uQmx1cj17ZSA9PiBjaGVja1ZhcmlhYmxlTmFtZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7LyogdHlwZSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgbWItMSBmbGV4IGgtNiBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdjaGF0VmFyaWFibGUubW9kYWwudHlwZScsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgICA8VmFyaWFibGVUeXBlU2VsZWN0b3JcbiAgICAgICAgICAgICAgdmFsdWU9e3R5cGV9XG4gICAgICAgICAgICAgIGxpc3Q9e3R5cGVMaXN0fVxuICAgICAgICAgICAgICBvblNlbGVjdD17aGFuZGxlVHlwZUNoYW5nZX1cbiAgICAgICAgICAgICAgcG9wdXBDbGFzc05hbWU9XCJ3LVszMjdweF1cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiBkZWZhdWx0IHZhbHVlICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCBtYi0xIGZsZXggaC02IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgPGRpdj57dCgnY2hhdFZhcmlhYmxlLm1vZGFsLnZhbHVlJywgeyBuczogJ3dvcmtmbG93JyB9KX08L2Rpdj5cbiAgICAgICAgICAgIHsodHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlTdHJpbmcgfHwgdHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlOdW1iZXIgfHwgdHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlCb29sZWFuKSAmJiAoXG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiZ2hvc3RcIlxuICAgICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC10ZXh0LXRlcnRpYXJ5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVFZGl0b3JDaGFuZ2UoIWVkaXRJbkpTT04pfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2VkaXRJbkpTT04gPyA8UmlJbnB1dEZpZWxkIGNsYXNzTmFtZT1cIm1yLTEgaC0zLjUgdy0zLjVcIiAvPiA6IDxSaURyYWZ0TGluZSBjbGFzc05hbWU9XCJtci0xIGgtMy41IHctMy41XCIgLz59XG4gICAgICAgICAgICAgICAge2VkaXRJbkpTT04gPyB0KCdjaGF0VmFyaWFibGUubW9kYWwub25lQnlPbmUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIDogdCgnY2hhdFZhcmlhYmxlLm1vZGFsLmVkaXRJbkpTT04nLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dHlwZSA9PT0gQ2hhdFZhclR5cGUuT2JqZWN0ICYmIChcbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJnaG9zdFwiXG4gICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXRleHQtdGVydGlhcnlcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUVkaXRvckNoYW5nZSghZWRpdEluSlNPTil9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7ZWRpdEluSlNPTiA/IDxSaUlucHV0RmllbGQgY2xhc3NOYW1lPVwibXItMSBoLTMuNSB3LTMuNVwiIC8+IDogPFJpRHJhZnRMaW5lIGNsYXNzTmFtZT1cIm1yLTEgaC0zLjUgdy0zLjVcIiAvPn1cbiAgICAgICAgICAgICAgICB7ZWRpdEluSlNPTiA/IHQoJ2NoYXRWYXJpYWJsZS5tb2RhbC5lZGl0SW5Gb3JtJywgeyBuczogJ3dvcmtmbG93JyB9KSA6IHQoJ2NoYXRWYXJpYWJsZS5tb2RhbC5lZGl0SW5KU09OJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleFwiPlxuICAgICAgICAgICAge3R5cGUgPT09IENoYXRWYXJUeXBlLlN0cmluZyAmJiAoXG4gICAgICAgICAgICAgIC8vIElucHV0IHdpbGwgcmVtb3ZlIFxcblxcciwgc28gdXNlIFRleHRhcmVhIGp1c3QgbGlrZSBkZXNjcmlwdGlvbiBhcmVhXG4gICAgICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHBsYWNlaG9sZGVyOnN5c3RlbS1zbS1yZWd1bGFyIGJsb2NrIGgtMjAgdy1mdWxsIHJlc2l6ZS1ub25lIGFwcGVhcmFuY2Utbm9uZSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItdHJhbnNwYXJlbnQgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcC0yIHRleHQtY29tcG9uZW50cy1pbnB1dC10ZXh0LWZpbGxlZCBjYXJldC1wcmltYXJ5LTYwMCBvdXRsaW5lLW5vbmUgcGxhY2Vob2xkZXI6dGV4dC1jb21wb25lbnRzLWlucHV0LXRleHQtcGxhY2Vob2xkZXIgaG92ZXI6Ym9yZGVyLWNvbXBvbmVudHMtaW5wdXQtYm9yZGVyLWhvdmVyIGhvdmVyOmJnLWNvbXBvbmVudHMtaW5wdXQtYmctaG92ZXIgZm9jdXM6Ym9yZGVyLWNvbXBvbmVudHMtaW5wdXQtYm9yZGVyLWFjdGl2ZSBmb2N1czpiZy1jb21wb25lbnRzLWlucHV0LWJnLWFjdGl2ZSBmb2N1czpzaGFkb3cteHNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnY2hhdFZhcmlhYmxlLm1vZGFsLnZhbHVlUGxhY2Vob2xkZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pIHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFZhbHVlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dHlwZSA9PT0gQ2hhdFZhclR5cGUuTnVtYmVyICYmIChcbiAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2NoYXRWYXJpYWJsZS5tb2RhbC52YWx1ZVBsYWNlaG9sZGVyJywgeyBuczogJ3dvcmtmbG93JyB9KSB8fCAnJ31cbiAgICAgICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0VmFsdWUoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3R5cGUgPT09IENoYXRWYXJUeXBlLkJvb2xlYW4gJiYgKFxuICAgICAgICAgICAgICA8Qm9vbFZhbHVlXG4gICAgICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRWYWx1ZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dHlwZSA9PT0gQ2hhdFZhclR5cGUuT2JqZWN0ICYmICFlZGl0SW5KU09OICYmIChcbiAgICAgICAgICAgICAgPE9iamVjdFZhbHVlTGlzdFxuICAgICAgICAgICAgICAgIGxpc3Q9e29iamVjdFZhbHVlfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRPYmplY3RWYWx1ZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlTdHJpbmcgJiYgIWVkaXRJbkpTT04gJiYgKFxuICAgICAgICAgICAgICA8QXJyYXlWYWx1ZUxpc3RcbiAgICAgICAgICAgICAgICBpc1N0cmluZ1xuICAgICAgICAgICAgICAgIGxpc3Q9e3ZhbHVlIHx8IFt1bmRlZmluZWRdfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRWYWx1ZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dHlwZSA9PT0gQ2hhdFZhclR5cGUuQXJyYXlOdW1iZXIgJiYgIWVkaXRJbkpTT04gJiYgKFxuICAgICAgICAgICAgICA8QXJyYXlWYWx1ZUxpc3RcbiAgICAgICAgICAgICAgICBpc1N0cmluZz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgbGlzdD17dmFsdWUgfHwgW3VuZGVmaW5lZF19XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFZhbHVlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0eXBlID09PSBDaGF0VmFyVHlwZS5BcnJheUJvb2xlYW4gJiYgIWVkaXRJbkpTT04gJiYgKFxuICAgICAgICAgICAgICA8QXJyYXlCb29sTGlzdFxuICAgICAgICAgICAgICAgIGxpc3Q9e3ZhbHVlIHx8IFt0cnVlXX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VmFsdWV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICB7ZWRpdEluSlNPTiAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtWzEwcHhdIGJnLWNvbXBvbmVudHMtaW5wdXQtYmctbm9ybWFsIHB5LTIgcGwtMyBwci0xXCIgc3R5bGU9e3sgaGVpZ2h0OiBlZGl0b3JNaW5IZWlnaHQgfX0+XG4gICAgICAgICAgICAgICAgPENvZGVFZGl0b3JcbiAgICAgICAgICAgICAgICAgIGlzRXhwYW5kXG4gICAgICAgICAgICAgICAgICBub1dyYXBwZXJcbiAgICAgICAgICAgICAgICAgIGxhbmd1YWdlPXtDb2RlTGFuZ3VhZ2UuanNvbn1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtlZGl0b3JDb250ZW50fVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9ezxkaXYgY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1wcmVcIj57cGxhY2Vob2xkZXJ9PC9kaXY+fVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUVkaXRvclZhbHVlQ2hhbmdlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiBkZXNjcmlwdGlvbiAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCBtYi0xIGZsZXggaC02IGl0ZW1zLWNlbnRlciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2NoYXRWYXJpYWJsZS5tb2RhbC5kZXNjcmlwdGlvbicsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXJlZ3VsYXIgcGxhY2Vob2xkZXI6c3lzdGVtLXNtLXJlZ3VsYXIgYmxvY2sgaC0yMCB3LWZ1bGwgcmVzaXplLW5vbmUgYXBwZWFyYW5jZS1ub25lIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCBiZy1jb21wb25lbnRzLWlucHV0LWJnLW5vcm1hbCBwLTIgdGV4dC1jb21wb25lbnRzLWlucHV0LXRleHQtZmlsbGVkIGNhcmV0LXByaW1hcnktNjAwIG91dGxpbmUtbm9uZSBwbGFjZWhvbGRlcjp0ZXh0LWNvbXBvbmVudHMtaW5wdXQtdGV4dC1wbGFjZWhvbGRlciBob3Zlcjpib3JkZXItY29tcG9uZW50cy1pbnB1dC1ib3JkZXItaG92ZXIgaG92ZXI6YmctY29tcG9uZW50cy1pbnB1dC1iZy1ob3ZlciBmb2N1czpib3JkZXItY29tcG9uZW50cy1pbnB1dC1ib3JkZXItYWN0aXZlIGZvY3VzOmJnLWNvbXBvbmVudHMtaW5wdXQtYmctYWN0aXZlIGZvY3VzOnNoYWRvdy14c1wiXG4gICAgICAgICAgICAgIHZhbHVlPXtkZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2NoYXRWYXJpYWJsZS5tb2RhbC5kZXNjcmlwdGlvblBsYWNlaG9sZGVyJywgeyBuczogJ3dvcmtmbG93JyB9KSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0RGVzY3JpcHRpb24oZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXJvdy1yZXZlcnNlIHJvdW5kZWQtYi0yeGwgcC00IHB0LTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yXCI+XG4gICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfT57dCgnb3BlcmF0aW9uLmNhbmNlbCcsIHsgbnM6ICdjb21tb24nIH0pfTwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIiBvbkNsaWNrPXtoYW5kbGVTYXZlfT57dCgnb3BlcmF0aW9uLnNhdmUnLCB7IG5zOiAnY29tbW9uJyB9KX08L0J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGF0VmFyaWFibGVNb2RhbFxuIl19