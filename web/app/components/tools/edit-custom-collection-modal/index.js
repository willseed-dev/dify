"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const immer_1 = require("immer");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const app_icon_1 = require("@/app/components/base/app-icon");
const button_1 = require("@/app/components/base/button");
const drawer_plus_1 = require("@/app/components/base/drawer-plus");
const emoji_picker_1 = require("@/app/components/base/emoji-picker");
const input_1 = require("@/app/components/base/input");
const textarea_1 = require("@/app/components/base/textarea");
const toast_1 = require("@/app/components/base/toast");
const selector_1 = require("@/app/components/tools/labels/selector");
const tools_1 = require("@/service/tools");
const classnames_1 = require("@/utils/classnames");
const general_1 = require("../../base/icons/src/vender/line/general");
const types_1 = require("../types");
const config_credentials_1 = require("./config-credentials");
const get_schema_1 = require("./get-schema");
const test_api_1 = require("./test-api");
// Add and Edit
const EditCustomCollectionModal = ({ positionLeft, dialogClassName = '', payload, onHide, onAdd, onEdit, onRemove, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdd = !payload;
    const isEdit = !!payload;
    const [editFirst, setEditFirst] = (0, react_2.useState)(!isAdd);
    const [paramsSchemas, setParamsSchemas] = (0, react_2.useState)(payload?.tools || []);
    const [labels, setLabels] = (0, react_2.useState)(payload?.labels || []);
    const [customCollection, setCustomCollection, getCustomCollection] = (0, ahooks_1.useGetState)(isAdd
        ? {
            provider: '',
            credentials: {
                auth_type: types_1.AuthType.none,
                api_key_header: 'Authorization',
                api_key_header_prefix: types_1.AuthHeaderPrefix.basic,
            },
            icon: {
                content: '🕵️',
                background: '#FEF7C3',
            },
            schema_type: '',
            schema: '',
        }
        : payload);
    const originalProvider = isEdit ? payload.provider : '';
    // Sync customCollection state when payload changes
    (0, react_2.useEffect)(() => {
        if (isEdit) {
            setCustomCollection(payload);
            setParamsSchemas(payload.tools || []);
            setLabels(payload.labels || []);
        }
    }, [isEdit, payload]);
    const [showEmojiPicker, setShowEmojiPicker] = (0, react_2.useState)(false);
    const emoji = customCollection.icon;
    const setEmoji = (emoji) => {
        const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
            draft.icon = emoji;
        });
        setCustomCollection(newCollection);
    };
    const schema = customCollection.schema;
    const debouncedSchema = (0, ahooks_1.useDebounce)(schema, { wait: 500 });
    const setSchema = (schema) => {
        const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
            draft.schema = schema;
        });
        setCustomCollection(newCollection);
    };
    (0, react_2.useEffect)(() => {
        if (!debouncedSchema)
            return;
        if (isEdit && editFirst) {
            setEditFirst(false);
            return;
        }
        (async () => {
            try {
                const { parameters_schema, schema_type } = await (0, tools_1.parseParamsSchema)(debouncedSchema);
                const customCollection = getCustomCollection();
                const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
                    draft.schema_type = schema_type;
                });
                setCustomCollection(newCollection);
                setParamsSchemas(parameters_schema);
            }
            catch {
                const customCollection = getCustomCollection();
                const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
                    draft.schema_type = '';
                });
                setCustomCollection(newCollection);
                setParamsSchemas([]);
            }
        })();
    }, [debouncedSchema]);
    const [credentialsModalShow, setCredentialsModalShow] = (0, react_2.useState)(false);
    const credential = customCollection.credentials;
    const setCredential = (credential) => {
        const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
            draft.credentials = credential;
        });
        setCustomCollection(newCollection);
    };
    const [currTool, setCurrTool] = (0, react_2.useState)(null);
    const [isShowTestApi, setIsShowTestApi] = (0, react_2.useState)(false);
    const handleLabelSelect = (value) => {
        setLabels(value);
    };
    const handleSave = () => {
        // const postData = clone(customCollection)
        const postData = (0, immer_1.produce)(customCollection, (draft) => {
            delete draft.tools;
            if (draft.credentials.auth_type === types_1.AuthType.none) {
                delete draft.credentials.api_key_header;
                delete draft.credentials.api_key_header_prefix;
                delete draft.credentials.api_key_value;
            }
            draft.labels = labels;
        });
        let errorMessage = '';
        if (!postData.provider)
            errorMessage = t('errorMsg.fieldRequired', { ns: 'common', field: t('createTool.name', { ns: 'tools' }) });
        if (!postData.schema)
            errorMessage = t('errorMsg.fieldRequired', { ns: 'common', field: t('createTool.schema', { ns: 'tools' }) });
        if (errorMessage) {
            toast_1.default.notify({
                type: 'error',
                message: errorMessage,
            });
            return;
        }
        if (isAdd) {
            onAdd?.(postData);
            return;
        }
        onEdit?.({
            ...postData,
            original_provider: originalProvider,
        });
    };
    const getPath = (url) => {
        if (!url)
            return '';
        try {
            const path = decodeURI(new URL(url).pathname);
            return path || '';
        }
        catch {
            return url;
        }
    };
    return (<>
      <drawer_plus_1.default isShow positionCenter={isAdd && !positionLeft} onHide={onHide} title={t(`createTool.${isAdd ? 'title' : 'editTitle'}`, { ns: 'tools' })} dialogClassName={dialogClassName} panelClassName="mt-2 !w-[640px]" maxWidthClassName="!max-w-[640px]" height="calc(100vh - 16px)" headerClassName="!border-b-divider-regular" body={(<div className="flex h-full flex-col">
            <div className="h-0 grow space-y-4 overflow-y-auto px-6 py-3">
              <div>
                <div className="system-sm-medium py-2 text-text-primary">
                  {t('createTool.name', { ns: 'tools' })}
                  {' '}
                  <span className="ml-1 text-red-500">*</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <app_icon_1.default size="large" onClick={() => { setShowEmojiPicker(true); }} className="cursor-pointer" icon={emoji.content} background={emoji.background}/>
                  <input_1.default className="h-10 grow" placeholder={t('createTool.toolNamePlaceHolder', { ns: 'tools' })} value={customCollection.provider} onChange={(e) => {
                const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
                    draft.provider = e.target.value;
                });
                setCustomCollection(newCollection);
            }}/>
                </div>
              </div>

              {/* Schema */}
              <div className="select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="system-sm-medium py-2 text-text-primary">
                      {t('createTool.schema', { ns: 'tools' })}
                      <span className="ml-1 text-red-500">*</span>
                    </div>
                    <div className="mx-2 h-3 w-px bg-divider-regular"></div>
                    <a href="https://swagger.io/specification/" target="_blank" rel="noopener noreferrer" className="flex h-[18px] items-center space-x-1  text-text-accent">
                      <div className="text-xs font-normal">{t('createTool.viewSchemaSpec', { ns: 'tools' })}</div>
                      <general_1.LinkExternal02 className="h-3 w-3"/>
                    </a>
                  </div>
                  <get_schema_1.default onChange={setSchema}/>

                </div>
                <textarea_1.default className="h-[240px] resize-none" value={schema} onChange={e => setSchema(e.target.value)} placeholder={t('createTool.schemaPlaceHolder', { ns: 'tools' })}/>
              </div>

              {/* Available Tools  */}
              <div>
                <div className="system-sm-medium py-2 text-text-primary">{t('createTool.availableTools.title', { ns: 'tools' })}</div>
                <div className="w-full overflow-x-auto rounded-lg border border-divider-regular">
                  <table className="system-xs-regular w-full text-text-secondary">
                    <thead className="uppercase text-text-tertiary">
                      <tr className={(0, classnames_1.cn)(paramsSchemas.length > 0 && 'border-b', 'border-divider-regular')}>
                        <th className="p-2 pl-3 font-medium">{t('createTool.availableTools.name', { ns: 'tools' })}</th>
                        <th className="w-[236px] p-2 pl-3 font-medium">{t('createTool.availableTools.description', { ns: 'tools' })}</th>
                        <th className="p-2 pl-3 font-medium">{t('createTool.availableTools.method', { ns: 'tools' })}</th>
                        <th className="p-2 pl-3 font-medium">{t('createTool.availableTools.path', { ns: 'tools' })}</th>
                        <th className="w-[54px] p-2 pl-3 font-medium">{t('createTool.availableTools.action', { ns: 'tools' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paramsSchemas.map((item, index) => (<tr key={index} className="border-b border-divider-regular last:border-0">
                          <td className="p-2 pl-3">{item.operation_id}</td>
                          <td className="w-[236px] p-2 pl-3">{item.summary}</td>
                          <td className="p-2 pl-3">{item.method}</td>
                          <td className="p-2 pl-3">{getPath(item.server_url)}</td>
                          <td className="w-[62px] p-2 pl-3">
                            <button_1.default size="small" onClick={() => {
                    setCurrTool(item);
                    setIsShowTestApi(true);
                }}>
                              {t('createTool.availableTools.test', { ns: 'tools' })}
                            </button_1.default>
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Authorization method */}
              <div>
                <div className="system-sm-medium py-2 text-text-primary">{t('createTool.authMethod.title', { ns: 'tools' })}</div>
                <div className="flex h-9 cursor-pointer items-center justify-between rounded-lg bg-components-input-bg-normal px-2.5" onClick={() => setCredentialsModalShow(true)}>
                  <div className="system-xs-regular text-text-primary">{t(`createTool.authMethod.types.${credential.auth_type}`, { ns: 'tools' })}</div>
                  <react_1.RiSettings2Line className="h-4 w-4 text-text-secondary"/>
                </div>
              </div>

              {/* Labels */}
              <div>
                <div className="system-sm-medium py-2 text-text-primary">{t('createTool.toolInput.label', { ns: 'tools' })}</div>
                <selector_1.default value={labels} onChange={handleLabelSelect}/>
              </div>

              {/* Privacy Policy */}
              <div>
                <div className="system-sm-medium py-2 text-text-primary">{t('createTool.privacyPolicy', { ns: 'tools' })}</div>
                <input_1.default value={customCollection.privacy_policy} onChange={(e) => {
                const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
                    draft.privacy_policy = e.target.value;
                });
                setCustomCollection(newCollection);
            }} className="h-10 grow" placeholder={t('createTool.privacyPolicyPlaceholder', { ns: 'tools' }) || ''}/>
              </div>

              <div>
                <div className="system-sm-medium py-2 text-text-primary">{t('createTool.customDisclaimer', { ns: 'tools' })}</div>
                <input_1.default value={customCollection.custom_disclaimer} onChange={(e) => {
                const newCollection = (0, immer_1.produce)(customCollection, (draft) => {
                    draft.custom_disclaimer = e.target.value;
                });
                setCustomCollection(newCollection);
            }} className="h-10 grow" placeholder={t('createTool.customDisclaimerPlaceholder', { ns: 'tools' }) || ''}/>
              </div>

            </div>
            <div className={(0, classnames_1.cn)(isEdit ? 'justify-between' : 'justify-end', 'mt-2 flex shrink-0 rounded-b-[10px] border-t border-divider-regular bg-background-section-burn px-6 py-4')}>
              {isEdit && (<button_1.default variant="warning" onClick={onRemove}>{t('operation.delete', { ns: 'common' })}</button_1.default>)}
              <div className="flex space-x-2 ">
                <button_1.default onClick={onHide}>{t('operation.cancel', { ns: 'common' })}</button_1.default>
                <button_1.default variant="primary" onClick={handleSave}>{t('operation.save', { ns: 'common' })}</button_1.default>
              </div>
            </div>
            {showEmojiPicker && (<emoji_picker_1.default onSelect={(icon, icon_background) => {
                    setEmoji({ content: icon, background: icon_background });
                    setShowEmojiPicker(false);
                }} onClose={() => {
                    setShowEmojiPicker(false);
                }}/>)}
            {credentialsModalShow && (<config_credentials_1.default positionCenter={isAdd} credential={credential} onChange={setCredential} onHide={() => setCredentialsModalShow(false)}/>)}
            {isShowTestApi && (<test_api_1.default positionCenter={isAdd} tool={currTool} customCollection={customCollection} onHide={() => setIsShowTestApi(false)}/>)}
          </div>)} isShowMask={true} clickOutsideNotOpen={true}/>
    </>);
};
exports.default = React.memo(EditCustomCollectionModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiw0Q0FBa0Q7QUFDbEQsbUNBQWlEO0FBQ2pELGlDQUErQjtBQUMvQiwrQkFBOEI7QUFDOUIsaUNBQTJDO0FBQzNDLGlEQUE4QztBQUM5Qyw2REFBb0Q7QUFDcEQseURBQWlEO0FBQ2pELG1FQUFzRDtBQUN0RCxxRUFBNEQ7QUFDNUQsdURBQStDO0FBQy9DLDZEQUFxRDtBQUNyRCx1REFBK0M7QUFDL0MscUVBQWtFO0FBQ2xFLDJDQUFtRDtBQUNuRCxtREFBdUM7QUFDdkMsc0VBQXlFO0FBQ3pFLG9DQUFxRDtBQUNyRCw2REFBb0Q7QUFDcEQsNkNBQW9DO0FBQ3BDLHlDQUFnQztBQVdoQyxlQUFlO0FBQ2YsTUFBTSx5QkFBeUIsR0FBYyxDQUFDLEVBQzVDLFlBQVksRUFDWixlQUFlLEdBQUcsRUFBRSxFQUNwQixPQUFPLEVBQ1AsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxHQUNULEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQTtJQUN0QixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFBO0lBRXhCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEQsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBc0IsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUM3RixNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBVyxPQUFPLEVBQUUsTUFBTSxJQUFJLEVBQUUs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QUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUM3QyxDQUNILENBQ0Q7WUFBQSxDQUFDLGFBQWEsSUFBSSxDQUNoQixDQUFDLGtCQUFPLENBQ04sY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ3RCLElBQUksQ0FBQyxDQUFDLFFBQTZCLENBQUMsQ0FDcEMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUNuQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN0QyxDQUNILENBQ0g7VUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDRixVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDakIsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFFOUI7SUFBQSxHQUFHLENBRUosQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBDcmVkZW50aWFsLCBDdXN0b21Db2xsZWN0aW9uQmFja2VuZCwgQ3VzdG9tUGFyYW1TY2hlbWEsIEVtb2ppIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBSaVNldHRpbmdzMkxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlRGVib3VuY2UsIHVzZUdldFN0YXRlIH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQXBwSWNvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYXBwLWljb24nXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgRHJhd2VyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9kcmF3ZXItcGx1cydcbmltcG9ydCBFbW9qaVBpY2tlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZW1vamktcGlja2VyJ1xuaW1wb3J0IElucHV0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pbnB1dCdcbmltcG9ydCBUZXh0YXJlYSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdGV4dGFyZWEnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IExhYmVsU2VsZWN0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy9sYWJlbHMvc2VsZWN0b3InXG5pbXBvcnQgeyBwYXJzZVBhcmFtc1NjaGVtYSB9IGZyb20gJ0Avc2VydmljZS90b29scydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgTGlua0V4dGVybmFsMDIgfSBmcm9tICcuLi8uLi9iYXNlL2ljb25zL3NyYy92ZW5kZXIvbGluZS9nZW5lcmFsJ1xuaW1wb3J0IHsgQXV0aEhlYWRlclByZWZpeCwgQXV0aFR5cGUgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCBDb25maWdDcmVkZW50aWFscyBmcm9tICcuL2NvbmZpZy1jcmVkZW50aWFscydcbmltcG9ydCBHZXRTY2hlbWEgZnJvbSAnLi9nZXQtc2NoZW1hJ1xuaW1wb3J0IFRlc3RBcGkgZnJvbSAnLi90ZXN0LWFwaSdcblxudHlwZSBQcm9wcyA9IHtcbiAgcG9zaXRpb25MZWZ0PzogYm9vbGVhblxuICBkaWFsb2dDbGFzc05hbWU/OiBzdHJpbmdcbiAgcGF5bG9hZDogYW55XG4gIG9uSGlkZTogKCkgPT4gdm9pZFxuICBvbkFkZD86IChwYXlsb2FkOiBDdXN0b21Db2xsZWN0aW9uQmFja2VuZCkgPT4gdm9pZFxuICBvblJlbW92ZT86ICgpID0+IHZvaWRcbiAgb25FZGl0PzogKHBheWxvYWQ6IEN1c3RvbUNvbGxlY3Rpb25CYWNrZW5kKSA9PiB2b2lkXG59XG4vLyBBZGQgYW5kIEVkaXRcbmNvbnN0IEVkaXRDdXN0b21Db2xsZWN0aW9uTW9kYWw6IEZDPFByb3BzPiA9ICh7XG4gIHBvc2l0aW9uTGVmdCxcbiAgZGlhbG9nQ2xhc3NOYW1lID0gJycsXG4gIHBheWxvYWQsXG4gIG9uSGlkZSxcbiAgb25BZGQsXG4gIG9uRWRpdCxcbiAgb25SZW1vdmUsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBpc0FkZCA9ICFwYXlsb2FkXG4gIGNvbnN0IGlzRWRpdCA9ICEhcGF5bG9hZFxuXG4gIGNvbnN0IFtlZGl0Rmlyc3QsIHNldEVkaXRGaXJzdF0gPSB1c2VTdGF0ZSghaXNBZGQpXG4gIGNvbnN0IFtwYXJhbXNTY2hlbWFzLCBzZXRQYXJhbXNTY2hlbWFzXSA9IHVzZVN0YXRlPEN1c3RvbVBhcmFtU2NoZW1hW10+KHBheWxvYWQ/LnRvb2xzIHx8IFtdKVxuICBjb25zdCBbbGFiZWxzLCBzZXRMYWJlbHNdID0gdXNlU3RhdGU8c3RyaW5nW10+KHBheWxvYWQ/LmxhYmVscyB8fCBbXSlcbiAgY29uc3QgW2N1c3RvbUNvbGxlY3Rpb24sIHNldEN1c3RvbUNvbGxlY3Rpb24sIGdldEN1c3RvbUNvbGxlY3Rpb25dID0gdXNlR2V0U3RhdGU8Q3VzdG9tQ29sbGVjdGlvbkJhY2tlbmQ+KGlzQWRkXG4gICAgPyB7XG4gICAgICAgIHByb3ZpZGVyOiAnJyxcbiAgICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgICBhdXRoX3R5cGU6IEF1dGhUeXBlLm5vbmUsXG4gICAgICAgICAgYXBpX2tleV9oZWFkZXI6ICdBdXRob3JpemF0aW9uJyxcbiAgICAgICAgICBhcGlfa2V5X2hlYWRlcl9wcmVmaXg6IEF1dGhIZWFkZXJQcmVmaXguYmFzaWMsXG4gICAgICAgIH0sXG4gICAgICAgIGljb246IHtcbiAgICAgICAgICBjb250ZW50OiAn8J+Vte+4jycsXG4gICAgICAgICAgYmFja2dyb3VuZDogJyNGRUY3QzMnLFxuICAgICAgICB9LFxuICAgICAgICBzY2hlbWFfdHlwZTogJycsXG4gICAgICAgIHNjaGVtYTogJycsXG4gICAgICB9XG4gICAgOiBwYXlsb2FkKVxuXG4gIGNvbnN0IG9yaWdpbmFsUHJvdmlkZXIgPSBpc0VkaXQgPyBwYXlsb2FkLnByb3ZpZGVyIDogJydcblxuICAvLyBTeW5jIGN1c3RvbUNvbGxlY3Rpb24gc3RhdGUgd2hlbiBwYXlsb2FkIGNoYW5nZXNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNFZGl0KSB7XG4gICAgICBzZXRDdXN0b21Db2xsZWN0aW9uKHBheWxvYWQpXG4gICAgICBzZXRQYXJhbXNTY2hlbWFzKHBheWxvYWQudG9vbHMgfHwgW10pXG4gICAgICBzZXRMYWJlbHMocGF5bG9hZC5sYWJlbHMgfHwgW10pXG4gICAgfVxuICB9LCBbaXNFZGl0LCBwYXlsb2FkXSlcblxuICBjb25zdCBbc2hvd0Vtb2ppUGlja2VyLCBzZXRTaG93RW1vamlQaWNrZXJdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGVtb2ppID0gY3VzdG9tQ29sbGVjdGlvbi5pY29uXG4gIGNvbnN0IHNldEVtb2ppID0gKGVtb2ppOiBFbW9qaSkgPT4ge1xuICAgIGNvbnN0IG5ld0NvbGxlY3Rpb24gPSBwcm9kdWNlKGN1c3RvbUNvbGxlY3Rpb24sIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQuaWNvbiA9IGVtb2ppXG4gICAgfSlcbiAgICBzZXRDdXN0b21Db2xsZWN0aW9uKG5ld0NvbGxlY3Rpb24pXG4gIH1cbiAgY29uc3Qgc2NoZW1hID0gY3VzdG9tQ29sbGVjdGlvbi5zY2hlbWFcbiAgY29uc3QgZGVib3VuY2VkU2NoZW1hID0gdXNlRGVib3VuY2Uoc2NoZW1hLCB7IHdhaXQ6IDUwMCB9KVxuICBjb25zdCBzZXRTY2hlbWEgPSAoc2NoZW1hOiBhbnkpID0+IHtcbiAgICBjb25zdCBuZXdDb2xsZWN0aW9uID0gcHJvZHVjZShjdXN0b21Db2xsZWN0aW9uLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnNjaGVtYSA9IHNjaGVtYVxuICAgIH0pXG4gICAgc2V0Q3VzdG9tQ29sbGVjdGlvbihuZXdDb2xsZWN0aW9uKVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWRlYm91bmNlZFNjaGVtYSlcbiAgICAgIHJldHVyblxuICAgIGlmIChpc0VkaXQgJiYgZWRpdEZpcnN0KSB7XG4gICAgICBzZXRFZGl0Rmlyc3QoZmFsc2UpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgcGFyYW1ldGVyc19zY2hlbWEsIHNjaGVtYV90eXBlIH0gPSBhd2FpdCBwYXJzZVBhcmFtc1NjaGVtYShkZWJvdW5jZWRTY2hlbWEpXG4gICAgICAgIGNvbnN0IGN1c3RvbUNvbGxlY3Rpb24gPSBnZXRDdXN0b21Db2xsZWN0aW9uKClcbiAgICAgICAgY29uc3QgbmV3Q29sbGVjdGlvbiA9IHByb2R1Y2UoY3VzdG9tQ29sbGVjdGlvbiwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgZHJhZnQuc2NoZW1hX3R5cGUgPSBzY2hlbWFfdHlwZVxuICAgICAgICB9KVxuICAgICAgICBzZXRDdXN0b21Db2xsZWN0aW9uKG5ld0NvbGxlY3Rpb24pXG4gICAgICAgIHNldFBhcmFtc1NjaGVtYXMocGFyYW1ldGVyc19zY2hlbWEpXG4gICAgICB9XG4gICAgICBjYXRjaCB7XG4gICAgICAgIGNvbnN0IGN1c3RvbUNvbGxlY3Rpb24gPSBnZXRDdXN0b21Db2xsZWN0aW9uKClcbiAgICAgICAgY29uc3QgbmV3Q29sbGVjdGlvbiA9IHByb2R1Y2UoY3VzdG9tQ29sbGVjdGlvbiwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgZHJhZnQuc2NoZW1hX3R5cGUgPSAnJ1xuICAgICAgICB9KVxuICAgICAgICBzZXRDdXN0b21Db2xsZWN0aW9uKG5ld0NvbGxlY3Rpb24pXG4gICAgICAgIHNldFBhcmFtc1NjaGVtYXMoW10pXG4gICAgICB9XG4gICAgfSkoKVxuICB9LCBbZGVib3VuY2VkU2NoZW1hXSlcblxuICBjb25zdCBbY3JlZGVudGlhbHNNb2RhbFNob3csIHNldENyZWRlbnRpYWxzTW9kYWxTaG93XSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBjcmVkZW50aWFsID0gY3VzdG9tQ29sbGVjdGlvbi5jcmVkZW50aWFsc1xuICBjb25zdCBzZXRDcmVkZW50aWFsID0gKGNyZWRlbnRpYWw6IENyZWRlbnRpYWwpID0+IHtcbiAgICBjb25zdCBuZXdDb2xsZWN0aW9uID0gcHJvZHVjZShjdXN0b21Db2xsZWN0aW9uLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmNyZWRlbnRpYWxzID0gY3JlZGVudGlhbFxuICAgIH0pXG4gICAgc2V0Q3VzdG9tQ29sbGVjdGlvbihuZXdDb2xsZWN0aW9uKVxuICB9XG5cbiAgY29uc3QgW2N1cnJUb29sLCBzZXRDdXJyVG9vbF0gPSB1c2VTdGF0ZTxDdXN0b21QYXJhbVNjaGVtYSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1Nob3dUZXN0QXBpLCBzZXRJc1Nob3dUZXN0QXBpXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IGhhbmRsZUxhYmVsU2VsZWN0ID0gKHZhbHVlOiBzdHJpbmdbXSkgPT4ge1xuICAgIHNldExhYmVscyh2YWx1ZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSAoKSA9PiB7XG4gICAgLy8gY29uc3QgcG9zdERhdGEgPSBjbG9uZShjdXN0b21Db2xsZWN0aW9uKVxuICAgIGNvbnN0IHBvc3REYXRhID0gcHJvZHVjZShjdXN0b21Db2xsZWN0aW9uLCAoZHJhZnQpID0+IHtcbiAgICAgIGRlbGV0ZSBkcmFmdC50b29sc1xuXG4gICAgICBpZiAoZHJhZnQuY3JlZGVudGlhbHMuYXV0aF90eXBlID09PSBBdXRoVHlwZS5ub25lKSB7XG4gICAgICAgIGRlbGV0ZSBkcmFmdC5jcmVkZW50aWFscy5hcGlfa2V5X2hlYWRlclxuICAgICAgICBkZWxldGUgZHJhZnQuY3JlZGVudGlhbHMuYXBpX2tleV9oZWFkZXJfcHJlZml4XG4gICAgICAgIGRlbGV0ZSBkcmFmdC5jcmVkZW50aWFscy5hcGlfa2V5X3ZhbHVlXG4gICAgICB9XG5cbiAgICAgIGRyYWZ0LmxhYmVscyA9IGxhYmVsc1xuICAgIH0pXG5cbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gJydcbiAgICBpZiAoIXBvc3REYXRhLnByb3ZpZGVyKVxuICAgICAgZXJyb3JNZXNzYWdlID0gdCgnZXJyb3JNc2cuZmllbGRSZXF1aXJlZCcsIHsgbnM6ICdjb21tb24nLCBmaWVsZDogdCgnY3JlYXRlVG9vbC5uYW1lJywgeyBuczogJ3Rvb2xzJyB9KSB9KVxuXG4gICAgaWYgKCFwb3N0RGF0YS5zY2hlbWEpXG4gICAgICBlcnJvck1lc3NhZ2UgPSB0KCdlcnJvck1zZy5maWVsZFJlcXVpcmVkJywgeyBuczogJ2NvbW1vbicsIGZpZWxkOiB0KCdjcmVhdGVUb29sLnNjaGVtYScsIHsgbnM6ICd0b29scycgfSkgfSlcblxuICAgIGlmIChlcnJvck1lc3NhZ2UpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaXNBZGQpIHtcbiAgICAgIG9uQWRkPy4ocG9zdERhdGEpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBvbkVkaXQ/Lih7XG4gICAgICAuLi5wb3N0RGF0YSxcbiAgICAgIG9yaWdpbmFsX3Byb3ZpZGVyOiBvcmlnaW5hbFByb3ZpZGVyLFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBnZXRQYXRoID0gKHVybDogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCF1cmwpXG4gICAgICByZXR1cm4gJydcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXRoID0gZGVjb2RlVVJJKG5ldyBVUkwodXJsKS5wYXRobmFtZSlcbiAgICAgIHJldHVybiBwYXRoIHx8ICcnXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIHJldHVybiB1cmxcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8RHJhd2VyXG4gICAgICAgIGlzU2hvd1xuICAgICAgICBwb3NpdGlvbkNlbnRlcj17aXNBZGQgJiYgIXBvc2l0aW9uTGVmdH1cbiAgICAgICAgb25IaWRlPXtvbkhpZGV9XG4gICAgICAgIHRpdGxlPXt0KGBjcmVhdGVUb29sLiR7aXNBZGQgPyAndGl0bGUnIDogJ2VkaXRUaXRsZSd9YCwgeyBuczogJ3Rvb2xzJyB9KSF9XG4gICAgICAgIGRpYWxvZ0NsYXNzTmFtZT17ZGlhbG9nQ2xhc3NOYW1lfVxuICAgICAgICBwYW5lbENsYXNzTmFtZT1cIm10LTIgIXctWzY0MHB4XVwiXG4gICAgICAgIG1heFdpZHRoQ2xhc3NOYW1lPVwiIW1heC13LVs2NDBweF1cIlxuICAgICAgICBoZWlnaHQ9XCJjYWxjKDEwMHZoIC0gMTZweClcIlxuICAgICAgICBoZWFkZXJDbGFzc05hbWU9XCIhYm9yZGVyLWItZGl2aWRlci1yZWd1bGFyXCJcbiAgICAgICAgYm9keT17KFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgZmxleC1jb2xcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0wIGdyb3cgc3BhY2UteS00IG92ZXJmbG93LXktYXV0byBweC02IHB5LTNcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gcHktMiB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAgICAgICAge3QoJ2NyZWF0ZVRvb2wubmFtZScsIHsgbnM6ICd0b29scycgfSl9XG4gICAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMSB0ZXh0LXJlZC01MDBcIj4qPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICA8QXBwSWNvbiBzaXplPVwibGFyZ2VcIiBvbkNsaWNrPXsoKSA9PiB7IHNldFNob3dFbW9qaVBpY2tlcih0cnVlKSB9fSBjbGFzc05hbWU9XCJjdXJzb3ItcG9pbnRlclwiIGljb249e2Vtb2ppLmNvbnRlbnR9IGJhY2tncm91bmQ9e2Vtb2ppLmJhY2tncm91bmR9IC8+XG4gICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC0xMCBncm93XCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2NyZWF0ZVRvb2wudG9vbE5hbWVQbGFjZUhvbGRlcicsIHsgbnM6ICd0b29scycgfSkhfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y3VzdG9tQ29sbGVjdGlvbi5wcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Q29sbGVjdGlvbiA9IHByb2R1Y2UoY3VzdG9tQ29sbGVjdGlvbiwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFmdC5wcm92aWRlciA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICBzZXRDdXN0b21Db2xsZWN0aW9uKG5ld0NvbGxlY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogU2NoZW1hICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdC1ub25lXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIHB5LTIgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnY3JlYXRlVG9vbC5zY2hlbWEnLCB7IG5zOiAndG9vbHMnIH0pfVxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTEgdGV4dC1yZWQtNTAwXCI+Kjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtMiBoLTMgdy1weCBiZy1kaXZpZGVyLXJlZ3VsYXJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9zd2FnZ2VyLmlvL3NwZWNpZmljYXRpb24vXCJcbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaC1bMThweF0gaXRlbXMtY2VudGVyIHNwYWNlLXgtMSAgdGV4dC10ZXh0LWFjY2VudFwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ub3JtYWxcIj57dCgnY3JlYXRlVG9vbC52aWV3U2NoZW1hU3BlYycsIHsgbnM6ICd0b29scycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPExpbmtFeHRlcm5hbDAyIGNsYXNzTmFtZT1cImgtMyB3LTNcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxHZXRTY2hlbWEgb25DaGFuZ2U9e3NldFNjaGVtYX0gLz5cblxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxUZXh0YXJlYVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC1bMjQwcHhdIHJlc2l6ZS1ub25lXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzY2hlbWF9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRTY2hlbWEoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2NyZWF0ZVRvb2wuc2NoZW1hUGxhY2VIb2xkZXInLCB7IG5zOiAndG9vbHMnIH0pIX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogQXZhaWxhYmxlIFRvb2xzICAqL31cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gcHktMiB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCdjcmVhdGVUb29sLmF2YWlsYWJsZVRvb2xzLnRpdGxlJywgeyBuczogJ3Rvb2xzJyB9KX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBvdmVyZmxvdy14LWF1dG8gcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItcmVndWxhclwiPlxuICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIHctZnVsbCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZCBjbGFzc05hbWU9XCJ1cHBlcmNhc2UgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT17Y24ocGFyYW1zU2NoZW1hcy5sZW5ndGggPiAwICYmICdib3JkZXItYicsICdib3JkZXItZGl2aWRlci1yZWd1bGFyJyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiBwbC0zIGZvbnQtbWVkaXVtXCI+e3QoJ2NyZWF0ZVRvb2wuYXZhaWxhYmxlVG9vbHMubmFtZScsIHsgbnM6ICd0b29scycgfSl9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ3LVsyMzZweF0gcC0yIHBsLTMgZm9udC1tZWRpdW1cIj57dCgnY3JlYXRlVG9vbC5hdmFpbGFibGVUb29scy5kZXNjcmlwdGlvbicsIHsgbnM6ICd0b29scycgfSl9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgcGwtMyBmb250LW1lZGl1bVwiPnt0KCdjcmVhdGVUb29sLmF2YWlsYWJsZVRvb2xzLm1ldGhvZCcsIHsgbnM6ICd0b29scycgfSl9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgcGwtMyBmb250LW1lZGl1bVwiPnt0KCdjcmVhdGVUb29sLmF2YWlsYWJsZVRvb2xzLnBhdGgnLCB7IG5zOiAndG9vbHMnIH0pfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidy1bNTRweF0gcC0yIHBsLTMgZm9udC1tZWRpdW1cIj57dCgnY3JlYXRlVG9vbC5hdmFpbGFibGVUb29scy5hY3Rpb24nLCB7IG5zOiAndG9vbHMnIH0pfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgIHtwYXJhbXNTY2hlbWFzLm1hcCgoaXRlbSwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2luZGV4fSBjbGFzc05hbWU9XCJib3JkZXItYiBib3JkZXItZGl2aWRlci1yZWd1bGFyIGxhc3Q6Ym9yZGVyLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiBwbC0zXCI+e2l0ZW0ub3BlcmF0aW9uX2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3LVsyMzZweF0gcC0yIHBsLTNcIj57aXRlbS5zdW1tYXJ5fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgcGwtM1wiPntpdGVtLm1ldGhvZH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yIHBsLTNcIj57Z2V0UGF0aChpdGVtLnNlcnZlcl91cmwpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3LVs2MnB4XSBwLTIgcGwtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnJUb29sKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzU2hvd1Rlc3RBcGkodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ2NyZWF0ZVRvb2wuYXZhaWxhYmxlVG9vbHMudGVzdCcsIHsgbnM6ICd0b29scycgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIEF1dGhvcml6YXRpb24gbWV0aG9kICovfVxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBweS0yIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ2NyZWF0ZVRvb2wuYXV0aE1ldGhvZC50aXRsZScsIHsgbnM6ICd0b29scycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtOSBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcHgtMi41XCIgb25DbGljaz17KCkgPT4gc2V0Q3JlZGVudGlhbHNNb2RhbFNob3codHJ1ZSl9PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KGBjcmVhdGVUb29sLmF1dGhNZXRob2QudHlwZXMuJHtjcmVkZW50aWFsLmF1dGhfdHlwZX1gLCB7IG5zOiAndG9vbHMnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPFJpU2V0dGluZ3MyTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC1zZWNvbmRhcnlcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogTGFiZWxzICovfVxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBweS0yIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ2NyZWF0ZVRvb2wudG9vbElucHV0LmxhYmVsJywgeyBuczogJ3Rvb2xzJyB9KX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8TGFiZWxTZWxlY3RvciB2YWx1ZT17bGFiZWxzfSBvbkNoYW5nZT17aGFuZGxlTGFiZWxTZWxlY3R9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBQcml2YWN5IFBvbGljeSAqL31cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gcHktMiB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCdjcmVhdGVUb29sLnByaXZhY3lQb2xpY3knLCB7IG5zOiAndG9vbHMnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1c3RvbUNvbGxlY3Rpb24ucHJpdmFjeV9wb2xpY3l9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Q29sbGVjdGlvbiA9IHByb2R1Y2UoY3VzdG9tQ29sbGVjdGlvbiwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZHJhZnQucHJpdmFjeV9wb2xpY3kgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBzZXRDdXN0b21Db2xsZWN0aW9uKG5ld0NvbGxlY3Rpb24pXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC0xMCBncm93XCJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdjcmVhdGVUb29sLnByaXZhY3lQb2xpY3lQbGFjZWhvbGRlcicsIHsgbnM6ICd0b29scycgfSkgfHwgJyd9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gcHktMiB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCdjcmVhdGVUb29sLmN1c3RvbURpc2NsYWltZXInLCB7IG5zOiAndG9vbHMnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1c3RvbUNvbGxlY3Rpb24uY3VzdG9tX2Rpc2NsYWltZXJ9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Q29sbGVjdGlvbiA9IHByb2R1Y2UoY3VzdG9tQ29sbGVjdGlvbiwgKGRyYWZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZHJhZnQuY3VzdG9tX2Rpc2NsYWltZXIgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBzZXRDdXN0b21Db2xsZWN0aW9uKG5ld0NvbGxlY3Rpb24pXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC0xMCBncm93XCJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdjcmVhdGVUb29sLmN1c3RvbURpc2NsYWltZXJQbGFjZWhvbGRlcicsIHsgbnM6ICd0b29scycgfSkgfHwgJyd9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKGlzRWRpdCA/ICdqdXN0aWZ5LWJldHdlZW4nIDogJ2p1c3RpZnktZW5kJywgJ210LTIgZmxleCBzaHJpbmstMCByb3VuZGVkLWItWzEwcHhdIGJvcmRlci10IGJvcmRlci1kaXZpZGVyLXJlZ3VsYXIgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHgtNiBweS00Jyl9PlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaXNFZGl0ICYmIChcbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cIndhcm5pbmdcIiBvbkNsaWNrPXtvblJlbW92ZX0+e3QoJ29wZXJhdGlvbi5kZWxldGUnLCB7IG5zOiAnY29tbW9uJyB9KX08L0J1dHRvbj5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNwYWNlLXgtMiBcIj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uSGlkZX0+e3QoJ29wZXJhdGlvbi5jYW5jZWwnLCB7IG5zOiAnY29tbW9uJyB9KX08L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJwcmltYXJ5XCIgb25DbGljaz17aGFuZGxlU2F2ZX0+e3QoJ29wZXJhdGlvbi5zYXZlJywgeyBuczogJ2NvbW1vbicgfSl9PC9CdXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7c2hvd0Vtb2ppUGlja2VyICYmIChcbiAgICAgICAgICAgICAgPEVtb2ppUGlja2VyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q9eyhpY29uLCBpY29uX2JhY2tncm91bmQpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldEVtb2ppKHsgY29udGVudDogaWNvbiwgYmFja2dyb3VuZDogaWNvbl9iYWNrZ3JvdW5kIH0pXG4gICAgICAgICAgICAgICAgICBzZXRTaG93RW1vamlQaWNrZXIoZmFsc2UpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRTaG93RW1vamlQaWNrZXIoZmFsc2UpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7Y3JlZGVudGlhbHNNb2RhbFNob3cgJiYgKFxuICAgICAgICAgICAgICA8Q29uZmlnQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICBwb3NpdGlvbkNlbnRlcj17aXNBZGR9XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbD17Y3JlZGVudGlhbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0Q3JlZGVudGlhbH1cbiAgICAgICAgICAgICAgICBvbkhpZGU9eygpID0+IHNldENyZWRlbnRpYWxzTW9kYWxTaG93KGZhbHNlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7aXNTaG93VGVzdEFwaSAmJiAoXG4gICAgICAgICAgICAgIDxUZXN0QXBpXG4gICAgICAgICAgICAgICAgcG9zaXRpb25DZW50ZXI9e2lzQWRkfVxuICAgICAgICAgICAgICAgIHRvb2w9e2N1cnJUb29sIGFzIEN1c3RvbVBhcmFtU2NoZW1hfVxuICAgICAgICAgICAgICAgIGN1c3RvbUNvbGxlY3Rpb249e2N1c3RvbUNvbGxlY3Rpb259XG4gICAgICAgICAgICAgICAgb25IaWRlPXsoKSA9PiBzZXRJc1Nob3dUZXN0QXBpKGZhbHNlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIGlzU2hvd01hc2s9e3RydWV9XG4gICAgICAgIGNsaWNrT3V0c2lkZU5vdE9wZW49e3RydWV9XG4gICAgICAvPlxuICAgIDwvPlxuXG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oRWRpdEN1c3RvbUNvbGxlY3Rpb25Nb2RhbClcbiJdfQ==